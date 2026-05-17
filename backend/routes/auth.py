import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

from core.config import settings
from core.database import get_db
from core.deps import get_current_user
from core.email import send_email, wrap_email
from core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from models.user import (
    EmailRequest,
    PasswordReset,
    TokenPair,
    UpdateProfile,
    UserCreate,
    UserInDB,
    UserLogin,
    UserPublic,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def _to_public(user: dict) -> UserPublic:
    return UserPublic(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        role=user.get("role", "user"),
        email_verified=user.get("email_verified", False),
        created_at=user["created_at"],
    )


def _build_token_pair(user: dict) -> TokenPair:
    public = _to_public(user)
    access = create_access_token(user["id"], extra={"role": user.get("role", "user")})
    refresh = create_refresh_token(user["id"])
    return TokenPair(access_token=access, refresh_token=refresh, user=public)


@router.post("/register", response_model=TokenPair)
async def register(payload: UserCreate):
    db = get_db()
    existing = await db.users.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    verify_token = secrets.token_urlsafe(32)
    user = UserInDB(
        email=payload.email.lower(),
        name=payload.name.strip(),
        password_hash=hash_password(payload.password),
        verify_token=verify_token,
    )
    await db.users.insert_one(user.model_dump())

    # Send welcome / verification email (non-blocking on failure)
    verify_url = f"{settings.APP_URL}/verify-email?token={verify_token}"
    body = (
        f"<p>Hi {user.name},</p>"
        f"<p>Welcome to SpikeBulls. Confirm your email address to unlock your account.</p>"
    )
    try:
        await send_email(
            user.email,
            "Welcome to SpikeBulls",
            wrap_email("Welcome aboard", body, "Verify email", verify_url),
            meta={"type": "welcome"},
        )
    except Exception:
        pass

    stored = await db.users.find_one({"id": user.id})
    return _build_token_pair(stored)


@router.post("/login", response_model=TokenPair)
async def login(payload: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account disabled")
    return _build_token_pair(user)


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/refresh", response_model=TokenPair)
async def refresh(payload: RefreshRequest):
    try:
        data = decode_token(payload.refresh_token)
        if data.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    db = get_db()
    user = await db.users.find_one({"id": data["sub"]})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return _build_token_pair(user)


@router.get("/me", response_model=UserPublic)
async def me(user=Depends(get_current_user)):
    return _to_public(user)


@router.patch("/me", response_model=UserPublic)
async def update_me(payload: UpdateProfile, user=Depends(get_current_user)):
    db = get_db()
    updates: dict = {"updated_at": datetime.now(timezone.utc)}
    if payload.name is not None:
        updates["name"] = payload.name.strip()
    if payload.password:
        updates["password_hash"] = hash_password(payload.password)
    await db.users.update_one({"id": user["id"]}, {"$set": updates})
    refreshed = await db.users.find_one({"id": user["id"]})
    return _to_public(refreshed)


@router.post("/forgot-password")
async def forgot_password(payload: EmailRequest):
    db = get_db()
    user = await db.users.find_one({"email": payload.email.lower()})
    # Always return success to prevent user enumeration
    if user:
        token = secrets.token_urlsafe(40)
        expires = datetime.now(timezone.utc) + timedelta(hours=1)
        await db.users.update_one(
            {"id": user["id"]},
            {"$set": {"reset_token": token, "reset_token_expires": expires}},
        )
        reset_url = f"{settings.APP_URL}/reset-password?token={token}"
        body = (
            f"<p>Hi {user['name']},</p>"
            "<p>We received a request to reset your SpikeBulls password. The link below expires in 1 hour.</p>"
            "<p>If you didn't request this, you can safely ignore this email.</p>"
        )
        await send_email(
            user["email"],
            "Reset your SpikeBulls password",
            wrap_email("Password reset", body, "Reset password", reset_url),
            meta={"type": "password_reset"},
        )
    return {"ok": True, "message": "If that email exists, a reset link has been sent."}


@router.post("/reset-password")
async def reset_password(payload: PasswordReset):
    db = get_db()
    user = await db.users.find_one({"reset_token": payload.token})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    expires = user.get("reset_token_expires")
    if expires and expires.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Reset token expired")
    await db.users.update_one(
        {"id": user["id"]},
        {
            "$set": {
                "password_hash": hash_password(payload.password),
                "reset_token": None,
                "reset_token_expires": None,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )
    return {"ok": True, "message": "Password updated. You can now log in."}


class VerifyEmailRequest(BaseModel):
    token: str


@router.post("/verify-email")
async def verify_email(payload: VerifyEmailRequest):
    db = get_db()
    user = await db.users.find_one({"verify_token": payload.token})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification token")
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"email_verified": True, "verify_token": None}},
    )
    return {"ok": True, "message": "Email verified."}
