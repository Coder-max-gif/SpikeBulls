import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from core.config import settings
from core.database import close_db, ensure_indexes
from routes.admin import router as admin_router
from routes.auth import router as auth_router
from routes.checkout import router as checkout_router
from routes.contact import router as contact_router
from routes.downloads import router as downloads_router
from routes.licenses import router as licenses_router
from routes.payments import router as payments_router
from routes.products import router as products_router, testimonials_router
from routes.user import router as user_router
from services.seed import seed_database

limiter = Limiter(key_func=get_remote_address, storage_uri="memory://")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting %s backend...", settings.APP_NAME)
    try:
        await ensure_indexes()
        await seed_database()
    except Exception as exc:
        logger.exception("Startup tasks failed: %s", exc)
    yield
    await close_db()


app = FastAPI(title=f"{settings.APP_NAME} API", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.get("/api/")
async def root():
    return {
        "app": settings.APP_NAME,
        "status": "ok",
        "stripe_enabled": settings.ENABLE_STRIPE,
        "email_provider": settings.EMAIL_PROVIDER,
    }


@app.get("/api/health")
async def health():
    return {"status": "ok"}


# Mount routers under /api
app.include_router(auth_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(testimonials_router, prefix="/api")
app.include_router(contact_router, prefix="/api")
app.include_router(checkout_router, prefix="/api")
app.include_router(user_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(downloads_router, prefix="/api")
app.include_router(licenses_router, prefix="/api")
app.include_router(payments_router, prefix="/api")


# CORS
allow_origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")] if settings.CORS_ORIGINS != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)
