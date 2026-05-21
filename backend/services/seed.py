import logging
import secrets
from datetime import datetime, timezone

from core.config import settings
from core.database import get_db
from core.security import hash_password
from models.product import Product
from models.user import UserInDB
from models.contact import Testimonial

logger = logging.getLogger(__name__)


SEED_PRODUCTS: list[dict] = [
    {
        "name": "SpikeBulls Indicator — Subscription",
        "slug": "indicator-subscription",
        "category": "indicator",
        "short_description": "Indicator access with flexible monthly/annual plans.",
        "description": "A multi-layer technical indicator suite for MetaTrader 5. Real-time trend detection, smart money concepts, liquidity zones, and volatility-aware entry levels — all on one clean overlay.",
        "price": 29.0,
        "features": [
            "Multi-timeframe trend engine",
            "Liquidity & order-block detection",
            "Volatility-adjusted entry zones",
            "Built-in risk calculator",
            "Push, email & terminal alerts",
            "Regular updates",
        ],
        "platforms": ["MetaTrader 5", "Windows", "VPS"],
        "images": [
            "https://images.unsplash.com/photo-1689732888407-310424e3a372?crop=entropy&cs=srgb&fm=jpg&q=85",
        ],
        "delivery_type": "membership",
        "subscription_tiers": [
            {
                "name": "1 Month",
                "price": 29.0,
                "license_duration_days": 30,
            },
            {
                "name": "6 Months",
                "price": 69.0,
                "compare_at_price": 174.0,
                "license_duration_days": 180,
                "highlight": True,
                "badge": "Best Value",
            },
            {
                "name": "1 Year",
                "price": 99.0,
                "compare_at_price": 348.0,
                "license_duration_days": 365,
            },
        ],
        "accent": "blue",
        "highlight": False,
        "status": "active",
    },
    {
        "name": "SpikeBulls MT5 Indicator Pro",
        "slug": "mt5-indicator-pro",
        "category": "indicator",
        "short_description": "Precision signals engineered for the modern trader.",
        "description": "A multi-layer technical indicator suite for MetaTrader 5. Real-time trend detection, smart money concepts, liquidity zones, and volatility-aware entry levels — all on one clean overlay.",
        "price": 149.0,
        "compare_at_price": 199.0,
        "features": [
            "Multi-timeframe trend engine",
            "Liquidity & order-block detection",
            "Volatility-adjusted entry zones",
            "Built-in risk calculator",
            "Push, email & terminal alerts",
            "Lifetime updates",
        ],
        "platforms": ["MetaTrader 5", "Windows", "VPS"],
        "images": [
            "https://images.unsplash.com/photo-1689732888407-310424e3a372?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1639754390580-2e7437267698?crop=entropy&cs=srgb&fm=jpg&q=85",
        ],
        "delivery_type": "license",
        "accent": "blue",
        "highlight": False,
        "status": "active",
    },
    {
        "name": "SpikeBulls Algorithm — Subscription",
        "slug": "algorithm-subscription",
        "category": "algo",
        "short_description": "Automated strategy with flexible subscription plans.",
        "description": "An institutional-grade algorithmic strategy engineered for consistent risk-adjusted returns. Trades 24/5 across FX, indices, and metals with adaptive position sizing and drawdown control.",
        "price": 79.0,
        "features": [
            "Adaptive position sizing",
            "Drawdown-controlled execution",
            "Multi-asset portfolio engine",
            "News-aware trading filter",
            "One-click VPS deployment",
            "Regular updates",
        ],
        "platforms": ["MetaTrader 5", "VPS", "Cloud"],
        "images": [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&q=85",
        ],
        "delivery_type": "membership",
        "subscription_tiers": [
            {
                "name": "1 Month",
                "price": 79.0,
                "license_duration_days": 30,
            },
            {
                "name": "6 Months",
                "price": 199.0,
                "compare_at_price": 474.0,
                "license_duration_days": 180,
                "highlight": True,
                "badge": "Best Value",
            },
            {
                "name": "1 Year",
                "price": 299.0,
                "compare_at_price": 948.0,
                "license_duration_days": 365,
            },
        ],
        "accent": "violet",
        "highlight": False,
        "status": "active",
    },
    {
        "name": "SpikeBulls Algo Strategy",
        "slug": "algo-strategy",
        "category": "algo",
        "short_description": "Fully automated execution. Zero emotional bias.",
        "description": "An institutional-grade algorithmic strategy engineered for consistent risk-adjusted returns. Trades 24/5 across FX, indices, and metals with adaptive position sizing and drawdown control.",
        "price": 299.0,
        "compare_at_price": 399.0,
        "features": [
            "Adaptive position sizing",
            "Drawdown-controlled execution",
            "Multi-asset portfolio engine",
            "News-aware trading filter",
            "One-click VPS deployment",
            "Lifetime updates",
        ],
        "platforms": ["MetaTrader 5", "VPS", "Cloud"],
        "images": [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?crop=entropy&cs=srgb&fm=jpg&q=85",
        ],
        "delivery_type": "license",
        "accent": "violet",
        "highlight": False,
        "status": "active",
    },
    {
        "name": "SpikeBulls Forex Signals \u2014 Pro",
        "slug": "forex-signals-pro",
        "category": "signals",
        "short_description": "Daily institutional-style forex & gold signals.",
        "description": "Receive 3\u20136 high-conviction trade ideas every session across major FX pairs, gold, and indices. Each signal includes entry, stop, multiple TPs, and risk guidance \u2014 delivered via Telegram, Discord, and email.",
        "price": 79.0,
        "compare_at_price": 99.0,
        "features": [
            "3\u20136 signals per trading session",
            "FX majors, gold, indices",
            "Telegram + Discord + email delivery",
            "Entry / SL / multi-TP structure",
            "Weekly market analysis",
            "30-day rolling subscription",
        ],
        "platforms": ["Telegram", "Discord", "Email"],
        "images": [
            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=srgb&fm=jpg&q=85",
        ],
        "delivery_type": "membership",
        "license_duration_days": 30,
        "accent": "blue",
        "highlight": True,
        "badge": "Most Popular",
        "status": "active",
    },
    {
        "name": "SpikeBulls Automation Suite",
        "slug": "automation-suite",
        "category": "automation",
        "short_description": "Trade copier, risk manager & execution toolkit.",
        "description": "A complete automation toolkit that copies trades across accounts, enforces per-account risk limits, and adds smart trailing, partial closes, and break-even logic on top of any MT5 strategy.",
        "price": 199.0,
        "features": [
            "Multi-account trade copier",
            "Per-account risk caps",
            "Smart trailing & partial closes",
            "News blackout windows",
            "One-click hedge & flatten",
            "Lifetime updates",
        ],
        "platforms": ["MetaTrader 5", "VPS"],
        "images": [
            "https://images.unsplash.com/photo-1621264448270-9ef00e88a935?crop=entropy&cs=srgb&fm=jpg&q=85",
        ],
        "delivery_type": "license",
        "accent": "violet",
        "status": "active",
    },
    {
        "name": "SpikeBulls Complete Bundle",
        "slug": "complete-bundle",
        "category": "algo",
        "short_description": "Indicator + Algo + Automation + 3 months of signals.",
        "description": "Everything we make in one package. MT5 Indicator Pro, the Algo Strategy, the Automation Suite, plus 3 months of Forex Signals included. Lifetime updates on all license products.",
        "price": 499.0,
        "compare_at_price": 776.0,
        "features": [
            "MT5 Indicator Pro (lifetime)",
            "Algo Strategy (lifetime)",
            "Automation Suite (lifetime)",
            "3 months Forex Signals included",
            "Priority Discord channel",
            "VPS setup assistance",
        ],
        "platforms": ["MetaTrader 5", "VPS", "Cloud"],
        "images": [
            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=srgb&fm=jpg&q=85",
        ],
        "delivery_type": "license",
        "accent": "gradient",
        "highlight": True,
        "badge": "Best Value",
        "status": "active",
    },
    {
        "name": "SpikeBulls Gold Sniper Indicator",
        "slug": "gold-sniper-indicator",
        "category": "indicator",
        "short_description": "XAU/USD specialist \u2014 built for the world's most volatile pair.",
        "description": "A dedicated XAU/USD indicator built around session liquidity, killzone timing, and gold-specific volatility. Designed to sit alongside the MT5 Indicator Pro for gold traders.",
        "price": 99.0,
        "features": [
            "London + NY killzone overlays",
            "Gold-tuned liquidity engine",
            "Session bias module",
            "Push + terminal alerts",
            "Lifetime updates",
        ],
        "platforms": ["MetaTrader 5", "Windows", "VPS"],
        "images": [
            "https://images.unsplash.com/photo-1639754390580-2e7437267698?crop=entropy&cs=srgb&fm=jpg&q=85",
        ],
        "delivery_type": "license",
        "accent": "blue",
        "status": "active",
    },
    {
        "name": "SpikeBulls Indicator Pack — Download",
        "slug": "indicator-pack-download",
        "category": "indicator",
        "short_description": "Complete indicator bundle with instant file download.",
        "description": "Get immediate access to the complete SpikeBulls indicator suite. Includes all MT5 indicators with instant file download, lifetime updates, and premium support.",
        "price": 199.0,
        "compare_at_price": 249.0,
        "features": [
            "Instant file download",
            "All SpikeBulls indicators included",
            "Lifetime updates",
            "Installation guide",
            "Premium Discord access",
        ],
        "platforms": ["MetaTrader 5", "Windows", "VPS"],
        "images": [
            "https://images.unsplash.com/photo-1689732888407-310424e3a372?crop=entropy&cs=srgb&fm=jpg&q=85",
        ],
        "delivery_type": "download",
        "file_path": "spikebulls-indicator.zip",
        "max_downloads": 5,
        "accent": "blue",
        "highlight": True,
        "badge": "Instant Download",
        "status": "active",
    },
]


SEED_TESTIMONIALS: list[dict] = [
    {
        "name": "Marcus Chen",
        "role": "Prop Firm Trader, Singapore",
        "quote": "The MT5 Indicator changed how I read structure. I cut my chart time in half and my win rate climbed from 54% to 67% in three months.",
        "rating": 5,
    },
    {
        "name": "Sofia Almeida",
        "role": "Portfolio Manager",
        "quote": "The Algo Strategy runs on our VPS and handles drawdown better than half the systems we've built in-house. Genuinely institutional quality.",
        "rating": 5,
    },
    {
        "name": "James O'Connor",
        "role": "Full-Time FX Trader",
        "quote": "Clean signals, no repaint, no nonsense. The risk calculator alone is worth the price. This is what professional tooling looks like.",
        "rating": 5,
    },
    {
        "name": "Priya Raman",
        "role": "Quant Researcher",
        "quote": "I stress-tested the strategy across 8 years of tick data. The Sharpe is real, the drawdown is contained. Few retail products survive that test.",
        "rating": 5,
    },
]


async def seed_database() -> None:
    db = get_db()

    # --- Admin user ---
    admin = await db.users.find_one({"role": "admin"})
    if not admin:
        password = settings.ADMIN_PASSWORD or secrets.token_urlsafe(12)
        user = UserInDB(
            email=settings.ADMIN_EMAIL,
            name="SpikeBulls Admin",
            password_hash=hash_password(password),
            role="admin",
            email_verified=True,
        )
        await db.users.insert_one(user.model_dump())
        logger.info(
            "[SEED] Admin user created \u2014 email=%s password=%s (change after first login)",
            settings.ADMIN_EMAIL,
            password,
        )

    # --- Products ---
    existing_slugs = {
        doc["slug"] async for doc in db.products.find({}, {"slug": 1})
    }
    for entry in SEED_PRODUCTS:
        if entry["slug"] in existing_slugs:
            continue
        product = Product(**entry)
        await db.products.insert_one(product.model_dump())
    logger.info("[SEED] Products ensured (%d total in catalog).", await db.products.count_documents({}))

    # --- Testimonials ---
    if await db.testimonials.count_documents({}) == 0:
        for entry in SEED_TESTIMONIALS:
            t = Testimonial(**entry)
            await db.testimonials.insert_one(t.model_dump())
        logger.info("[SEED] Testimonials seeded.")


def generate_license_key() -> str:
    raw = secrets.token_hex(10).upper()
    return f"SPB-{raw[0:4]}-{raw[4:8]}-{raw[8:12]}-{raw[12:16]}-{raw[16:20]}"
