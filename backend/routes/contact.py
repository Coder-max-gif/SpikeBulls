from fastapi import APIRouter, Depends, HTTPException, Request

from core.database import get_db
from core.deps import get_optional_user
from core.email import send_email, wrap_email
from models.contact import ContactCreate, ContactSubmission

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("")
async def submit_contact(
    payload: ContactCreate,
    request: Request,
    user=Depends(get_optional_user),
):
    db = get_db()
    data = payload.model_dump()
    if not data.get("source"):
        data["source"] = request.headers.get("referer") or None
    submission = ContactSubmission(**data)
    doc = submission.model_dump()
    doc["user_id"] = user["id"] if user else None
    doc["ip"] = request.client.host if request.client else None
    await db.contact_submissions.insert_one(doc)

    # Auto-reply to user
    body = (
        f"<p>Hi {submission.name},</p>"
        "<p>Thanks for reaching out to SpikeBulls. We received your message and will reply within one business day.</p>"
        "<p>For urgent issues join our Discord or Telegram support channel.</p>"
    )
    try:
        await send_email(
            submission.email,
            "We received your message \u2014 SpikeBulls",
            wrap_email("Message received", body),
            meta={"type": "contact_ack", "submission_id": submission.id},
        )
    except Exception:
        pass

    return {"ok": True, "id": submission.id}
