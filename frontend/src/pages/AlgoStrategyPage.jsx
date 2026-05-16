import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, Bot, ShieldCheck, Cpu, Layers, Zap, Activity } from "lucide-react";
import AnimatedDashboard from "../components/AnimatedDashboard";
import FinalCTA from "../components/FinalCTA";
import { PRODUCTS, PREVIEW_IMAGES } from "../mock";

export default function AlgoStrategyPage() {
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.id === "algo-strategy");

  const extraFeatures = [
    { icon: Cpu, title: "Adaptive Position Sizing", desc: "Position size scales with current volatility regime and recent equity — protecting capital when conditions degrade." },
    { icon: ShieldCheck, title: "Drawdown Controller", desc: "Hard caps on daily, weekly, and total drawdown. The algo pauses itself rather than chase losses." },
    { icon: Layers, title: "Multi-Asset Portfolio", desc: "FX majors, gold, silver, oil, and major indices traded as one diversified portfolio with correlation filters." },
    { icon: Activity, title: "News-Aware Filter", desc: "Auto-blocks entries around high-impact news. No more getting wicked out at the FOMC." },
    { icon: Bot, title: "One-Click VPS Deploy", desc: "Guided setup for popular VPS providers. From purchase to live in under 15 minutes." },
    { icon: Zap, title: "Forward-Tested", desc: "Twelve months of live forward testing before release. The Sharpe is real, not curve-fitted." },
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
              <div className="inline-flex glass rounded-full px-3 py-1 text-[11.5px] uppercase tracking-[0.18em] text-violet-300 items-center gap-1">
                Product 02 · Algo Strategy
              </div>
              <h1 className="mt-5 font-display text-[44px] sm:text-[60px] font-semibold tracking-tight leading-[1.04] text-white">
                Full automation. <span className="text-gradient-accent">Zero emotion.</span>
              </h1>
              <p className="mt-5 text-zinc-400 text-[16px] sm:text-[18px] leading-relaxed max-w-xl">
                {product.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/pricing")}
                  className="btn-primary"
                  style={{
                    background: "linear-gradient(180deg, #8B5CF6 0%, #7C3AED 100%)",
                    borderColor: "rgba(167,139,250,0.6)",
                    boxShadow: "0 8px 24px -8px rgba(139,92,246,0.55), inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                >
                  Get Algo — ${299} <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => navigate("/contact")} className="btn-ghost">
                  Request demo
                </button>
              </div>
              <ul className="mt-8 grid sm:grid-cols-2 gap-x-4 gap-y-2.5">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13.5px] text-zinc-300">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-violet-400" />
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
            Institutional engineering, retail accessibility
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
                <div className="h-10 w-10 rounded-lg bg-violet-500/15 border border-violet-400/30 flex items-center justify-center text-violet-300">
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
              <img src={PREVIEW_IMAGES.analytics2} alt="Algo preview" className="absolute inset-0 w-full h-full object-cover opacity-45" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-[#06070B]/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="text-[12px] text-zinc-400">Live portfolio</div>
                  <div className="font-display text-[22px] text-white font-medium">8 instruments · 24/5 execution</div>
                </div>
                <div className="glass rounded-lg px-3 py-2 text-[12px] text-emerald-300">+$2,481 today</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
