import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, LineChart, Bell, Layers, Zap, ShieldCheck, Activity } from "lucide-react";
import AnimatedDashboard from "../components/AnimatedDashboard";
import FinalCTA from "../components/FinalCTA";
import { PRODUCTS, PREVIEW_IMAGES } from "../mock";

export default function MT5IndicatorPage() {
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.id === "mt5-indicator");

  const extraFeatures = [
    { icon: Layers, title: "Multi-Timeframe Engine", desc: "Reads structure across M15, H1, H4, and D1 simultaneously — you only see signals that align with the macro trend." },
    { icon: Bell, title: "Smart Alerts", desc: "Push, email, and terminal alerts the moment a setup forms. Never glued to your screen again." },
    { icon: ShieldCheck, title: "Risk Calculator", desc: "Built-in lot sizing based on your account, risk %, and stop distance. One click and you're sized." },
    { icon: Zap, title: "Volatility Adaptive", desc: "Entry zones widen and tighten automatically based on ATR. No more static stops in dynamic markets." },
    { icon: Activity, title: "No Repaint", desc: "Every signal locks at candle close. What you see in backtest is what you get in live execution." },
    { icon: LineChart, title: "Liquidity Zones", desc: "Auto-detected order blocks, FVGs, and equal highs/lows — the maps institutions trade on." },
  ];

  return (
    <main className="bg-app">
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-overlay" />
        <div className="relative mx-auto max-w-7xl px-5">
          <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 text-[13px] text-zinc-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex glass rounded-full px-3 py-1 text-[11.5px] uppercase tracking-[0.18em] text-blue-300 items-center gap-1">
                Product 01 · MT5 Indicator
              </div>
              <h1 className="mt-5 font-display text-[44px] sm:text-[60px] font-semibold tracking-tight leading-[1.04] text-white">
                Precision signals, <span className="text-gradient-accent">zero noise</span>
              </h1>
              <p className="mt-5 text-zinc-400 text-[16px] sm:text-[18px] leading-relaxed max-w-xl">
                {product.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button onClick={() => navigate("/pricing")} className="btn-primary">
                  Get Indicator — ${149} <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => navigate("/contact")} className="btn-ghost">
                  Request demo
                </button>
              </div>
              <ul className="mt-8 grid sm:grid-cols-2 gap-x-4 gap-y-2.5">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13.5px] text-zinc-300">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-blue-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
              <AnimatedDashboard />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="font-display text-[32px] sm:text-[40px] text-white font-semibold tracking-tight max-w-xl">
            Every tool a serious manual trader needs
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {extraFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="glass rounded-2xl p-6"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-[19px] text-white font-medium">{f.title}</h3>
                <p className="mt-2 text-[14px] text-zinc-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="glass-strong rounded-2xl overflow-hidden">
            <div className="relative aspect-[21/9]">
              <img src={PREVIEW_IMAGES.candles2} alt="Indicator preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-[#06070B]/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="text-[12px] text-zinc-400">In action</div>
                  <div className="font-display text-[22px] text-white font-medium">EUR/USD H1 — live setup</div>
                </div>
                <div className="glass rounded-lg px-3 py-2 text-[12px] text-emerald-300">+59 pips closed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
