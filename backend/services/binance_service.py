import hmac
import hashlib
import json
import time
import logging
from typing import Any

import requests

from core.config import settings

logger = logging.getLogger(__name__)


def is_enabled() -> bool:
    return bool(settings.BINANCE_PAY_API_KEY and settings.BINANCE_PAY_SECRET_KEY)


def _generate_signature(payload: dict, timestamp: int, nonce: str) -> str:
    if not settings.BINANCE_PAY_SECRET_KEY:
        return ""
    
    payload_str = json.dumps(payload, separators=(",", ":"))
    message = f"{timestamp}\n{nonce}\n{payload_str}\n"
    
    signature = hmac.new(
        settings.BINANCE_PAY_SECRET_KEY.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha512
    ).hexdigest()
    
    return signature


def create_order(
    order_id: str,
    user_email: str,
    amount: float,
    currency: str = "USDT",
    product_name: str = "SpikeBulls Product",
) -> dict:
    if not is_enabled():
        raise RuntimeError("Binance Pay not configured")
    
    timestamp = int(time.time() * 1000)
    nonce = str(int(time.time()))
    
    payload = {
        "merchantId": settings.BINANCE_PAY_MERCHANT_ID if hasattr(settings, 'BINANCE_PAY_MERCHANT_ID') else "",
        "merchantTradeNo": order_id,
        "orderAmount": str(amount),
        "currency": currency,
        "goods": {
            "goodsType": "02",
            "goodsCategory": "Z000",
            "referenceGoodsId": order_id,
            "goodsName": product_name,
        },
        "returnUrl": f"{settings.APP_URL}/checkout/success?order_id={order_id}",
        "cancelUrl": f"{settings.APP_URL}/checkout/cancel?order_id={order_id}",
    }
    
    signature = _generate_signature(payload, timestamp, nonce)
    
    headers = {
        "Content-Type": "application/json",
        "BinancePay-Timestamp": str(timestamp),
        "BinancePay-Nonce": nonce,
        "BinancePay-Certificate-Sn": settings.BINANCE_PAY_API_KEY if settings.BINANCE_PAY_API_KEY else "",
        "BinancePay-Signature": signature,
    }
    
    try:
        base_url = settings.BINANCE_PAY_BASE_URL if hasattr(settings, 'BINANCE_PAY_BASE_URL') else "https://bpay.binanceapi.com"
        response = requests.post(
            f"{base_url}/binancepay/openapi/v2/order",
            json=payload,
            headers=headers,
            timeout=30,
        )
        response.raise_for_status()
        result = response.json()
        
        if result.get("status") != "SUCCESS":
            logger.error("Binance Pay error: %s", result)
            raise RuntimeError(f"Binance Pay error: {result.get('errorMessage')}")
        
        return result["data"]
    except requests.RequestException as e:
        logger.exception("Binance Pay request failed")
        raise RuntimeError(f"Binance Pay request failed: {str(e)}")


def verify_webhook(payload: bytes, headers: dict) -> dict | None:
    if not settings.BINANCE_PAY_SECRET_KEY:
        logger.warning("Binance Pay secret not set; skipping verification")
        try:
            return json.loads(payload)
        except Exception:
            return None
    
    timestamp = headers.get("BinancePay-Timestamp")
    nonce = headers.get("BinancePay-Nonce")
    signature = headers.get("BinancePay-Signature")
    
    if not all([timestamp, nonce, signature]):
        logger.warning("Missing Binance Pay webhook headers")
        return None
    
    try:
        payload_str = payload.decode("utf-8")
        message = f"{timestamp}\n{nonce}\n{payload_str}\n"
        
        expected_signature = hmac.new(
            settings.BINANCE_PAY_SECRET_KEY.encode("utf-8"),
            message.encode("utf-8"),
            hashlib.sha512
        ).hexdigest()
        
        if not hmac.compare_digest(expected_signature, signature):
            logger.warning("Invalid Binance Pay webhook signature")
            return None
        
        return json.loads(payload_str)
    except Exception as e:
        logger.exception("Binance Pay webhook verification failed")
        return None


def query_order(binance_order_id: str) -> dict | None:
    if not is_enabled():
        return None
    
    timestamp = int(time.time() * 1000)
    nonce = str(int(time.time()))
    
    payload = {
        "prepayId": binance_order_id,
    }
    
    signature = _generate_signature(payload, timestamp, nonce)
    
    headers = {
        "Content-Type": "application/json",
        "BinancePay-Timestamp": str(timestamp),
        "BinancePay-Nonce": nonce,
        "BinancePay-Certificate-Sn": settings.BINANCE_PAY_API_KEY if settings.BINANCE_PAY_API_KEY else "",
        "BinancePay-Signature": signature,
    }
    
    try:
        base_url = settings.BINANCE_PAY_BASE_URL if hasattr(settings, 'BINANCE_PAY_BASE_URL') else "https://bpay.binanceapi.com"
        response = requests.post(
            f"{base_url}/binancepay/openapi/v2/order/query",
            json=payload,
            headers=headers,
            timeout=30,
        )
        response.raise_for_status()
        result = response.json()
        return result.get("data")
    except Exception as e:
        logger.exception("Binance Pay query failed")
        return None
