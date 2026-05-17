import logging
from typing import Any

import stripe

from core.config import settings

logger = logging.getLogger(__name__)

if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY


def is_enabled() -> bool:
    return settings.ENABLE_STRIPE and bool(settings.STRIPE_SECRET_KEY)


def create_checkout_session(
    order_id: str,
    user_email: str,
    line_items: list[dict[str, Any]],
) -> dict:
    """Create a real Stripe Checkout session."""
    session = stripe.checkout.Session.create(
        mode="payment",
        payment_method_types=["card"],
        customer_email=user_email,
        line_items=line_items,
        success_url=f"{settings.STRIPE_SUCCESS_URL}?order_id={order_id}&session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{settings.STRIPE_CANCEL_URL}?order_id={order_id}",
        metadata={"order_id": order_id},
    )
    return {"id": session.id, "url": session.url}


def verify_webhook(payload: bytes, sig_header: str) -> dict | None:
    if not settings.STRIPE_WEBHOOK_SECRET:
        logger.warning("Stripe webhook secret not set; skipping verification.")
        try:
            import json
            return json.loads(payload)
        except Exception:
            return None
    try:
        return stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception as exc:
        logger.error("Webhook verification failed: %s", exc)
        return None
