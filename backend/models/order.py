import uuid
from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


OrderStatus = Literal["pending", "paid", "failed", "refunded", "cancelled"]


class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int = 1


class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_email: str
    items: list[OrderItem]
    subtotal: float
    total: float
    currency: str = "USD"
    status: OrderStatus = "pending"
    payment_provider: str = "stripe"
    stripe_session_id: str | None = None
    stripe_payment_intent: str | None = None
    license_ids: list[str] = Field(default_factory=list)
    simulated: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CheckoutCreate(BaseModel):
    product_ids: list[str] = Field(min_length=1)
