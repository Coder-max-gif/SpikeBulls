// Static marketing content for SpikeBulls.
// Products, testimonials, and pricing are now served from the backend API.
// This file only holds copy that doesn't need to be admin-editable.

export const BRAND = {
  name: "SpikeBulls",
  tagline: "Premium Forex Trading Technology",
  email: "hello@spikebulls.com",
  social: {
    twitter: "#",
    youtube: "#",
    telegram: "#",
    discord: "#"
  }
};

export const NAV_LINKS = [
  { label: "Products", href: "#products" },
  { label: "Features", href: "#features" },
  { label: "Performance", href: "#performance" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" }
];

export const TRUST_BADGES = [
  { label: "MetaTrader 5", sub: "Certified" },
  { label: "TradingView", sub: "Compatible" },
  { label: "FIX API", sub: "Supported" },
  { label: "Windows / Mac", sub: "Cross-platform" },
  { label: "VPS Ready", sub: "24/7 Uptime" }
];

export const TRUST_STATS = [
  { value: "12,400+", label: "Active Traders" },
  { value: "$1.8B", label: "Volume Analyzed" },
  { value: "68.4%", label: "Avg. Win Rate" },
  { value: "42ms", label: "Avg. Signal Latency" }
];

export const PRODUCTS = [
  {
    id: "mt5-indicator",
    title: "MT5 Indicator",
    tagline: "Precision signals engineered for the modern trader.",
    description:
      "A multi-layer technical indicator suite for MetaTrader 5. Real-time trend detection, smart money concepts, and volatility-aware entries — all in one overlay.",
    features: [
      "Multi-timeframe trend engine",
      "Liquidity & order-block detection",
      "Volatility-adjusted entry zones",
      "Built-in risk calculator",
      "Push, email & terminal alerts"
    ],
    platforms: ["MetaTrader 5", "Windows", "VPS"],
    accent: "blue",
    cta: "Explore MT5 Indicator",
    href: "/products/mt5-indicator"
  },
  {
    id: "algo-strategy",
    title: "Algo Strategy",
    tagline: "Fully automated execution. Zero emotional bias.",
    description:
      "An institutional-grade algorithmic strategy engineered for consistent risk-adjusted returns. Trades 24/5 across FX, indices, and metals with adaptive position sizing.",
    features: [
      "Adaptive position sizing",
      "Drawdown-controlled execution",
      "Multi-asset portfolio engine",
      "News-aware trading filter",
      "One-click VPS deployment"
    ],
    platforms: ["MetaTrader 5", "VPS", "Cloud"],
    accent: "violet",
    cta: "Explore Algo Strategy",
    href: "/products/algo-strategy"
  }
];

export const FEATURES = [
  {
    icon: "Activity",
    title: "Signal Clarity",
    desc: "No noise, no lag. Clean entry & exit signals validated across multiple confluences before they ever reach your chart."
  },
  {
    icon: "TrendingUp",
    title: "Trend Detection",
    desc: "A proprietary multi-timeframe engine that maps macro structure to micro execution with institutional precision."
  },
  {
    icon: "ShieldCheck",
    title: "Risk Management",
    desc: "Built-in position sizing, drawdown caps, and volatility-adjusted stops keep capital protected at all times."
  },
  {
    icon: "Cpu",
    title: "Automation Support",
    desc: "Deploy on VPS, run 24/5, and let the algo handle every entry, exit, and trail without human intervention."
  },
  {
    icon: "Zap",
    title: "Real-Time Analysis",
    desc: "Tick-level processing with 42ms average signal latency. The market moves fast — you move faster."
  },
  {
    icon: "LineChart",
    title: "Adaptive Logic",
    desc: "Strategy parameters self-tune to current volatility regime, so performance stays consistent across conditions."
  }
];

export const PERFORMANCE_METRICS = [
  { label: "Net Profit (12M)", value: "+184.2%", trend: "up" },
  { label: "Max Drawdown", value: "-9.4%", trend: "down" },
  { label: "Sharpe Ratio", value: "2.71", trend: "up" },
  { label: "Profit Factor", value: "3.18", trend: "up" },
  { label: "Win Rate", value: "68.4%", trend: "up" },
  { label: "Avg R:R", value: "1 : 2.4", trend: "up" }
];

export const EQUITY_CURVE = [
  100, 102, 101, 105, 108, 112, 110, 116, 121, 119, 125, 131,
  128, 134, 140, 138, 145, 152, 149, 158, 166, 162, 171, 178,
  176, 184, 192, 188, 198, 206, 212, 209, 219, 227, 234, 241,
  238, 248, 256, 263, 270, 268, 278, 284
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose Your Product",
    desc: "Pick the MT5 Indicator for manual precision, the Algo Strategy for full automation, or bundle both for complete coverage."
  },
  {
    step: "02",
    title: "One-Click Setup",
    desc: "Receive your license, install via our guided setup, and connect to your MT5 terminal or VPS in under 5 minutes."
  },
  {
    step: "03",
    title: "Start Trading",
    desc: "Get live signals on your charts or let the algorithm execute autonomously. Monitor performance from any device."
  }
];

export const TESTIMONIALS = [
  {
    name: "Marcus Chen",
    role: "Prop Firm Trader, Singapore",
    quote:
      "The MT5 Indicator changed how I read structure. I cut my chart time in half and my win rate climbed from 54% to 67% in three months.",
    rating: 5
  },
  {
    name: "Sofia Almeida",
    role: "Portfolio Manager",
    quote:
      "The Algo Strategy runs on our VPS and handles drawdown better than half the systems we've built in-house. Genuinely institutional quality.",
    rating: 5
  },
  {
    name: "James O'Connor",
    role: "Full-Time FX Trader",
    quote:
      "Clean signals, no repaint, no nonsense. The risk calculator alone is worth the price. This is what professional tooling looks like.",
    rating: 5
  },
  {
    name: "Priya Raman",
    role: "Quant Researcher",
    quote:
      "I stress-tested the strategy across 8 years of tick data. The Sharpe is real, the drawdown is contained. Few retail products survive that test.",
    rating: 5
  }
];

export const PRICING_PLANS = [
  {
    id: "indicator",
    name: "MT5 Indicator",
    price: 149,
    period: "one-time",
    description: "Lifetime access to the indicator suite for manual traders.",
    features: [
      "Full indicator suite",
      "Lifetime updates",
      "Email & push alerts",
      "Single MT5 license",
      "Community access"
    ],
    cta: "Get Indicator",
    highlight: false,
    accent: "blue"
  },
  {
    id: "bundle",
    name: "Complete Bundle",
    price: 399,
    period: "one-time",
    description: "Indicator + Algo Strategy. Everything you need to trade.",
    features: [
      "MT5 Indicator (full suite)",
      "Algo Strategy (full automation)",
      "Lifetime updates & support",
      "2 MT5 licenses",
      "Priority Discord channel",
      "VPS setup assistance"
    ],
    cta: "Get Bundle",
    highlight: true,
    badge: "Most Popular",
    accent: "gradient"
  },
  {
    id: "algo",
    name: "Algo Strategy",
    price: 299,
    period: "one-time",
    description: "Hands-free execution. Designed for VPS deployment.",
    features: [
      "Full strategy engine",
      "Lifetime updates",
      "Multi-asset portfolio",
      "Single MT5 license",
      "VPS setup guide"
    ],
    cta: "Get Algo",
    highlight: false,
    accent: "violet"
  }
];

export const FAQS = [
  {
    q: "Do your products repaint?",
    a: "No. Every signal generated by the MT5 Indicator is locked once a candle closes. The Algo Strategy executes only on confirmed conditions — no future-leaking, no repainting."
  },
  {
    q: "What markets and timeframes are supported?",
    a: "FX majors and minors, gold, silver, oil, and major indices (US30, NAS100, SPX500, DAX, etC). Timeframes from M5 to D1 are fully supported. M1 is available but not recommended."
  },
  {
    q: "Do I need a VPS to run the Algo Strategy?",
    a: "Strongly recommended. A VPS keeps your MT5 terminal online 24/5 with stable latency. We provide step-by-step setup for popular VPS providers in the bundle."
  },
  {
    q: "Is there a free trial?",
    a: "We offer a 14-day demo license on request so you can run both products on a demo MT5 account before purchasing. Contact support to enable it."
  },
  {
    q: "How do updates work?",
    a: "All purchases include lifetime updates. New versions are pushed automatically through our license portal — no reinstall, no extra fees."
  },
  {
    q: "What broker do I need?",
    a: "Any MT5 broker works. For best execution we recommend ECN brokers with sub-100ms latency to a major liquidity hub (London, NY, Frankfurt)."
  },
  {
    q: "Is this financial advice?",
    a: "No. Our products are technology tools. All trading carries risk, past performance does not guarantee future results, and you are responsible for your own decisions."
  }
];

export const FOOTER_LINKS = {
  Product: [
    { label: "MT5 Indicator", href: "/products/mt5-indicator-pro" },
    { label: "Algo Strategy", href: "/products/algo-strategy" },
    { label: "Forex Signals", href: "/products/forex-signals-pro" },
    { label: "Automation Suite", href: "/products/automation-suite" },
    { label: "All Products", href: "/products" },
    { label: "Pricing", href: "/pricing" }
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Performance", href: "/#performance" },
    { label: "Press", href: "#" },
    { label: "Contact", href: "/contact" }
  ],
  Support: [
    { label: "FAQ", href: "/faq" },
    { label: "Documentation", href: "#" },
    { label: "Setup Guide", href: "#" },
    { label: "Discord", href: "#" }
  ],
  Legal: [
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Risk Disclosure", href: "#" },
    { label: "Refund Policy", href: "#" }
  ]
};

export const PREVIEW_IMAGES = {
  hero: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=srgb&fm=jpg&q=85",
  dashboard: "https://images.unsplash.com/photo-1621264448270-9ef00e88a935?crop=entropy&cs=srgb&fm=jpg&q=85",
  candles1: "https://images.unsplash.com/photo-1689732888407-310424e3a372?crop=entropy&cs=srgb&fm=jpg&q=85",
  candles2: "https://images.unsplash.com/photo-1639754390580-2e7437267698?crop=entropy&cs=srgb&fm=jpg&q=85",
  analytics1: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&q=85",
  analytics2: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?crop=entropy&cs=srgb&fm=jpg&q=85"
};
