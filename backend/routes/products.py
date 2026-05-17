from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Query

from core.database import get_db
from models.product import Product, ProductCategory
from models.contact import Testimonial

router = APIRouter(prefix="/products", tags=["products"])


def _clean(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc


@router.get("")
async def list_products(
    category: ProductCategory | None = None,
    status_: str = Query("active", alias="status"),
):
    db = get_db()
    query: dict = {}
    if status_ != "all":
        query["status"] = status_
    if category:
        query["category"] = category
    docs = await db.products.find(query).sort("created_at", 1).to_list(200)
    return [_clean(d) for d in docs]


@router.get("/{slug}")
async def get_product(slug: str):
    db = get_db()
    doc = await db.products.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return _clean(doc)


testimonials_router = APIRouter(prefix="/testimonials", tags=["testimonials"])


@testimonials_router.get("")
async def list_testimonials():
    db = get_db()
    docs = await db.testimonials.find({"visible": True}).sort("created_at", 1).to_list(50)
    return [_clean(d) for d in docs]
