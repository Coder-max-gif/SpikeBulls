from datetime import datetime, timezone
from pathlib import Path
import uuid
import os

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse

from core.database import get_db
from core.deps import get_current_admin
from models.contact import Testimonial, TestimonialCreate
from models.product import Product, ProductCreate, ProductUpdate
from services.seed import generate_license_key

STORAGE_DIR = Path(__file__).parent.parent / "storage"
PRODUCT_IMAGES_DIR = STORAGE_DIR / "product-images"
PRODUCTS_DIR = STORAGE_DIR / "products"

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_DOWNLOAD_TYPES = {"application/zip", "application/x-zip-compressed", "application/octet-stream"}
MAX_FILE_SIZE = 50 * 1024 * 1024

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])


def _clean(d):
    d.pop("_id", None)
    return d


# ---- Dashboard summary ----
@router.get("/summary")
async def summary():
    db = get_db()
    users = await db.users.count_documents({})
    products = await db.products.count_documents({})
    orders_paid = await db.orders.count_documents({"status": "paid"})
    revenue_pipeline = await db.orders.aggregate(
        [{"$match": {"status": "paid"}}, {"$group": {"_id": None, "total": {"$sum": "$total"}}}]
    ).to_list(1)
    revenue = revenue_pipeline[0]["total"] if revenue_pipeline else 0
    leads = await db.contact_submissions.count_documents({})
    licenses_active = await db.licenses.count_documents({"status": "active"})
    return {
        "users": users,
        "products": products,
        "paid_orders": orders_paid,
        "revenue": revenue,
        "leads": leads,
        "active_licenses": licenses_active,
    }


# ---- Products ----
@router.get("/products")
async def admin_list_products():
    db = get_db()
    docs = await db.products.find({}).sort("created_at", 1).to_list(500)
    return [_clean(d) for d in docs]


@router.post("/products")
async def admin_create_product(payload: ProductCreate):
    db = get_db()
    if await db.products.find_one({"slug": payload.slug}):
        raise HTTPException(status_code=400, detail="Slug already exists")
    product = Product(**payload.model_dump())
    await db.products.insert_one(product.model_dump())
    return _clean(product.model_dump())


@router.patch("/products/{product_id}")
async def admin_update_product(product_id: str, payload: ProductUpdate):
    db = get_db()
    updates = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    updates["updated_at"] = datetime.now(timezone.utc)
    result = await db.products.update_one({"id": product_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    doc = await db.products.find_one({"id": product_id})
    return _clean(doc)


@router.delete("/products/{product_id}")
async def admin_delete_product(product_id: str):
    db = get_db()
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"ok": True}


# ---- Users ----
@router.get("/users")
async def admin_list_users():
    db = get_db()
    docs = await db.users.find({}, {"password_hash": 0}).sort("created_at", -1).to_list(500)
    return [_clean(d) for d in docs]


@router.patch("/users/{user_id}/role")
async def admin_set_role(user_id: str, role: str):
    if role not in ("user", "admin"):
        raise HTTPException(status_code=400, detail="Invalid role")
    db = get_db()
    await db.users.update_one({"id": user_id}, {"$set": {"role": role}})
    return {"ok": True}


@router.patch("/users/{user_id}/active")
async def admin_toggle_active(user_id: str, is_active: bool):
    db = get_db()
    await db.users.update_one({"id": user_id}, {"$set": {"is_active": is_active}})
    return {"ok": True}


# ---- Orders ----
@router.get("/orders")
async def admin_list_orders():
    db = get_db()
    docs = await db.orders.find({}).sort("created_at", -1).to_list(500)
    return [_clean(d) for d in docs]


# ---- Leads / Contact submissions ----
@router.get("/leads")
async def admin_list_leads():
    db = get_db()
    docs = await db.contact_submissions.find({}).sort("created_at", -1).to_list(500)
    return [_clean(d) for d in docs]


@router.patch("/leads/{lead_id}")
async def admin_update_lead(lead_id: str, status: str):
    if status not in ("new", "in_progress", "closed"):
        raise HTTPException(status_code=400, detail="Invalid status")
    db = get_db()
    await db.contact_submissions.update_one({"id": lead_id}, {"$set": {"status": status}})
    return {"ok": True}


# ---- Licenses ----
@router.get("/licenses")
async def admin_list_licenses():
    db = get_db()
    docs = await db.licenses.find({}).sort("created_at", -1).to_list(500)
    return [_clean(d) for d in docs]


@router.post("/licenses/{license_id}/revoke")
async def admin_revoke_license(license_id: str):
    db = get_db()
    await db.licenses.update_one({"id": license_id}, {"$set": {"status": "revoked"}})
    return {"ok": True}


@router.post("/licenses/{license_id}/regenerate")
async def admin_regenerate_license(license_id: str):
    db = get_db()
    new_key = generate_license_key()
    await db.licenses.update_one(
        {"id": license_id},
        {"$set": {"key": new_key, "status": "active", "activations": 0}},
    )
    return {"ok": True, "key": new_key}


# ---- Testimonials ----
@router.get("/testimonials")
async def admin_list_testimonials():
    db = get_db()
    docs = await db.testimonials.find({}).sort("created_at", 1).to_list(100)
    return [_clean(d) for d in docs]


@router.post("/testimonials")
async def admin_create_testimonial(payload: TestimonialCreate):
    db = get_db()
    t = Testimonial(**payload.model_dump())
    await db.testimonials.insert_one(t.model_dump())
    return _clean(t.model_dump())


@router.delete("/testimonials/{tid}")
async def admin_delete_testimonial(tid: str):
    db = get_db()
    await db.testimonials.delete_one({"id": tid})
    return {"ok": True}


# ---- File Upload ----
@router.post("/products/{product_id}/upload")
async def admin_upload_product_file(
    product_id: str,
    file: UploadFile = File(...),
    type: str = Form(...)
):
    db = get_db()
    
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if type not in ("image", "download"):
        raise HTTPException(status_code=400, detail="Invalid type. Must be 'image' or 'download'")
    
    content = await file.read()
    
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File too large. Max {MAX_FILE_SIZE // (1024*1024)}MB")
    
    file_ext = Path(file.filename).suffix.lower() if file.filename else ".bin"
    unique_id = str(uuid.uuid4())[:8]
    safe_filename = f"{unique_id}_{file.filename.replace(' ', '_') if file.filename else f'file{file_ext}'}"
    
    if type == "image":
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail=f"Invalid image type. Allowed: {', '.join(ALLOWED_IMAGE_TYPES)}")
        save_dir = PRODUCT_IMAGES_DIR
        save_path = save_dir / safe_filename
        field_to_update = "images"
    else:
        if file.content_type not in ALLOWED_DOWNLOAD_TYPES and not file_ext == ".zip":
            raise HTTPException(status_code=400, detail=f"Invalid download type. Must be ZIP file")
        save_dir = PRODUCTS_DIR
        save_path = save_dir / safe_filename
        field_to_update = "file_path"
    
    save_dir.mkdir(parents=True, exist_ok=True)
    
    with open(save_path, "wb") as f:
        f.write(content)
    
    updates = {"updated_at": datetime.now(timezone.utc)}
    
    if type == "image":
        current_images = product.get("images", [])
        current_images.append(safe_filename)
        updates["images"] = current_images
    else:
        updates["file_path"] = safe_filename
        updates["delivery_type"] = "download"
    
    await db.products.update_one({"id": product_id}, {"$set": updates})
    
    updated_product = await db.products.find_one({"id": product_id})
    
    return {
        "ok": True,
        "file_path": safe_filename,
        "type": type,
        "product": _clean(updated_product)
    }
