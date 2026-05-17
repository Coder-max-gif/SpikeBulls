import uuid
from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


ProductCategory = Literal["indicator", "algo", "signals", "automation"]
ProductStatus = Literal["active", "draft", "archived"]
DeliveryType = Literal["license", "download", "membership"]


class ProductBase(BaseModel):
    name: str
    slug: str
    category: ProductCategory
    short_description: str
    description: str
    price: float = Field(ge=0)
    compare_at_price: float | None = Field(default=None, ge=0)
    currency: str = "USD"
    features: list[str] = Field(default_factory=list)
    platforms: list[str] = Field(default_factory=list)
    images: list[str] = Field(default_factory=list)
    delivery_type: DeliveryType = "license"
    download_url: str | None = None
    stripe_price_id: str | None = None
    license_duration_days: int | None = None  # None = lifetime
    status: ProductStatus = "active"
    highlight: bool = False
    badge: str | None = None
    accent: str = "blue"  # blue|violet|gradient


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    category: ProductCategory | None = None
    short_description: str | None = None
    description: str | None = None
    price: float | None = None
    compare_at_price: float | None = None
    features: list[str] | None = None
    platforms: list[str] | None = None
    images: list[str] | None = None
    delivery_type: DeliveryType | None = None
    download_url: str | None = None
    stripe_price_id: str | None = None
    license_duration_days: int | None = None
    status: ProductStatus | None = None
    highlight: bool | None = None
    badge: str | None = None
    accent: str | None = None


class Product(ProductBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
