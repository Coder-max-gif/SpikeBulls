import logging
import os
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import FileResponse
from jwt import InvalidTokenError, ExpiredSignatureError

from core.config import settings
from core.database import get_db
from core.deps import get_current_user
from core.security import create_download_token, decode_download_token
from models.product import Product
from models.order import Order
from models.download import DownloadLog, DownloadLogCreate

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/downloads", tags=["downloads"])

STORAGE_DIR = Path(__file__).parent.parent / "storage" / "products"


@router.get("/token/{product_id}")
async def request_download_token(
    product_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    db=Depends(get_db),
):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product["delivery_type"] != "download" or not product.get("file_path"):
        raise HTTPException(status_code=400, detail="Product is not downloadable")
    
    order = await db.orders.find_one({
        "user_id": current_user["id"],
        "status": "paid",
        "items.product_id": product_id,
    })
    if not order:
        raise HTTPException(status_code=403, detail="You do not own this product")
    
    download_count = await db.download_logs.count_documents({
        "user_id": current_user["id"],
        "product_id": product_id,
    })
    max_downloads = product.get("max_downloads", 5)
    if download_count >= max_downloads:
        raise HTTPException(status_code=429, detail=f"Download limit exceeded (max {max_downloads})")
    
    token = create_download_token(
        user_id=current_user["id"],
        product_id=product_id,
        order_id=order["id"],
    )
    return {"download_token": token, "download_url": f"/api/downloads/{token}"}


@router.get("/{token}")
async def download_file(
    token: str,
    request: Request,
    db=Depends(get_db),
):
    try:
        payload = decode_download_token(token)
    except ExpiredSignatureError:
        raise HTTPException(status_code=403, detail="Download token expired")
    except InvalidTokenError:
        raise HTTPException(status_code=403, detail="Invalid download token")
    
    user_id = payload["sub"]
    product_id = payload["product_id"]
    order_id = payload.get("order_id")
    
    product = await db.products.find_one({"id": product_id})
    if not product or not product.get("file_path"):
        raise HTTPException(status_code=404, detail="Product or file not found")
    
    file_path = STORAGE_DIR / product["file_path"]
    if not file_path.exists() or not file_path.is_file():
        logger.error(f"File not found: {file_path}")
        raise HTTPException(status_code=404, detail="File not found")
    
    download_log = DownloadLogCreate(
        user_id=user_id,
        product_id=product_id,
        order_id=order_id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    await db.download_logs.insert_one(DownloadLog(**download_log.model_dump()).model_dump())
    
    filename = file_path.name
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream",
    )


@router.get("/me")
async def get_my_downloads(
    current_user: Annotated[dict, Depends(get_current_user)],
    db=Depends(get_db),
):
    orders_cursor = db.orders.find({
        "user_id": current_user["id"],
        "status": "paid",
    })
    orders = [order async for order in orders_cursor]
    
    all_product_ids = []
    for order in orders:
        for item in order.get("items", []):
            all_product_ids.append(item["product_id"])
    
    product_ids = list(set(all_product_ids))
    
    products_cursor = db.products.find({
        "id": {"$in": product_ids},
        "delivery_type": "download",
        "file_path": {"$ne": None},
    })
    products = [prod async for prod in products_cursor]
    products_by_id = {p["id"]: p for p in products}
    
    result = []
    processed_product_ids = set()
    
    for order in orders:
        for item in order.get("items", []):
            product_id = item["product_id"]
            if product_id in processed_product_ids:
                continue
            
            product = products_by_id.get(product_id)
            if not product:
                continue
            
            processed_product_ids.add(product_id)
            
            download_count = await db.download_logs.count_documents({
                "user_id": current_user["id"],
                "product_id": product["id"],
            })
            
            result.append({
                "product": product,
                "order": order,
                "download_count": download_count,
                "max_downloads": product.get("max_downloads", 5),
            })
    
    return result
