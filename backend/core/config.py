import os
from functools import lru_cache
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")


class Settings:
    # Mongo
    MONGO_URL: str = os.environ["MONGO_URL"]
    DB_NAME: str = os.environ["DB_NAME"]
    CORS_ORIGINS: str = os.environ.get("CORS_ORIGINS", "*")

    # App
    APP_NAME: str = os.environ.get("APP_NAME", "SpikeBulls")
    APP_URL: str = os.environ.get("APP_URL", "http://localhost:3000")

    # Auth
    JWT_SECRET: str = os.environ.get("JWT_SECRET", "change-me")
    JWT_ALGORITHM: str = os.environ.get("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.environ.get("REFRESH_TOKEN_EXPIRE_DAYS", "30"))

    # Admin seed
    ADMIN_EMAIL: str = os.environ.get("ADMIN_EMAIL", "admin@spikebulls.com")
    ADMIN_PASSWORD: str = os.environ.get("ADMIN_PASSWORD", "")

    # Stripe
    ENABLE_STRIPE: bool = os.environ.get("ENABLE_STRIPE", "false").lower() == "true"
    STRIPE_SECRET_KEY: str = os.environ.get("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
    STRIPE_SUCCESS_URL: str = os.environ.get("STRIPE_SUCCESS_URL", "http://localhost:3000/checkout/success")
    STRIPE_CANCEL_URL: str = os.environ.get("STRIPE_CANCEL_URL", "http://localhost:3000/checkout/cancel")
    
    # Binance Pay
    BINANCE_PAY_API_KEY: str = os.environ.get("BINANCE_PAY_API_KEY", "")
    BINANCE_PAY_SECRET_KEY: str = os.environ.get("BINANCE_PAY_SECRET_KEY", "")
    BINANCE_PAY_WEBHOOK_SECRET: str = os.environ.get("BINANCE_PAY_WEBHOOK_SECRET", "")
    BINANCE_PAY_MERCHANT_ID: str = os.environ.get("BINANCE_PAY_MERCHANT_ID", "")
    BINANCE_PAY_BASE_URL: str = os.environ.get("BINANCE_PAY_BASE_URL", "https://bpay.binanceapi.com")

    # Email
    EMAIL_PROVIDER: str = os.environ.get("EMAIL_PROVIDER", "console")
    EMAIL_FROM: str = os.environ.get("EMAIL_FROM", "SpikeBulls <hello@spikebulls.com>")
    SMTP_HOST: str = os.environ.get("SMTP_HOST", "")
    SMTP_PORT: int = int(os.environ.get("SMTP_PORT", "587"))
    SMTP_USER: str = os.environ.get("SMTP_USER", "")
    SMTP_PASS: str = os.environ.get("SMTP_PASS", "")
    RESEND_API_KEY: str = os.environ.get("RESEND_API_KEY", "")


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
