import uuid
from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, EmailStr, Field

ContactTopic = Literal["general", "demo", "bundle", "support"]
ContactStatus = Literal["new", "in_progress", "closed"]


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    topic: ContactTopic = "general"
    message: str = Field(min_length=5, max_length=4000)
    source: str | None = None


class ContactSubmission(ContactCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: ContactStatus = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TestimonialBase(BaseModel):
    name: str
    role: str
    quote: str
    rating: int = Field(default=5, ge=1, le=5)
    avatar_url: str | None = None
    visible: bool = True


class TestimonialCreate(TestimonialBase):
    pass


class Testimonial(TestimonialBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
