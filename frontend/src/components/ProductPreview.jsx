import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Activity, Bot, LineChart, Layers, Bell, Zap } from "lucide-react";
import { SectionHeader } from "./ProductsOverview";
import { PREVIEW_IMAGES } from "../mock";

export default function ProductPreview() {
  const navigate = useNavigate();
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow="Product Preview"
          title="A closer look at what you're getting"
          subtitle="Real interface, real signals, real automation. No mockup magic."
        />

        <div className="mt-14 grid lg:grid-cols-2 gap-5">
          {/* MT5 Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="group glass-strong rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute -top-24 -left-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-blue-500/15 border border-blue-400/30 flex items-center justify-center">
                <LineChart className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-zinc-500">Product 01</div>
                <h3 className="font-display text-[22px] text-white font-medium">MT5 Indicator</h3>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-white/5 aspect-[16/10] bg-[#0A0C13]">
              <img
                src={PREVIEW_IMAGES.candles1}
                alt="MT5 Indicator chart preview"
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-[#06070B]/40 to-transparent" />
              {/* overlay tags */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="glass rounded-md px-2 py-1 text-[11px] text-white">EUR/USD H1</span>
                <span className="glass rounded-md px-2 py-1 text-[11px] text-emerald-300">BUY 1.0842</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="glass rounded-md px-2.5 py-1.5 text-[11px] text-white flex items-center gap-1.5">
                  <Activity className="h-3 w-3 text-blue-300" /> Trend Engine: Bullish
                </div>
                <div className="glass rounded-md px-2.5 py-1.5 text-[11px] text-white">SL 1.0815 · TP 1.0901</div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { icon: Layers, label: "MTF Engine" },
                { icon: Bell, label: "Smart Alerts" },
                { icon: Zap, label: "42ms Latency" },
              ].map((it, i) => (
                <div key={i} className="glass rounded-lg p-3 flex items-center gap-2">
                  <it.icon className="h-4 w-4 text-blue-300" />
                  <span className="text-[12px] text-zinc-300">{it.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/products/mt5-indicator")}
              className="mt-6 btn-primary !py-2.5"
            >
              View MT5 Indicator <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Algo Strategy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group glass-strong rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-20 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-violet-500/15 border border-violet-400/30 flex items-center justify-center">
                <Bot className="h-5 w-5 text-violet-300" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-zinc-500">Product 02</div>
                <h3 className="font-display text-[22px] text-white font-medium">Algo Strategy</h3>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-white/5 aspect-[16/10] bg-[#0A0C13]">
              <img
                src={PREVIEW_IMAGES.analytics1}
                alt="Algo dashboard preview"
                className="absolute inset-0 w-full h-full object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-[#06070B]/40 to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="glass rounded-md px-2 py-1 text-[11px] text-white">Portfolio</span>
                <span className="glass rounded-md px-2 py-1 text-[11px] text-violet-300">Live · 8 assets</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2">
                <div className="glass rounded-md px-2.5 py-1.5">
                  <div className="text-[10px] text-zinc-500">Open</div>
                  <div className="text-[12px] text-white font-medium">12</div>
                </div>
                <div className="glass rounded-md px-2.5 py-1.5">
                  <div className="text-[10px] text-zinc-500">PnL</div>
                  <div className="text-[12px] text-emerald-300 font-medium">+$2,481</div>
                </div>
                <div className="glass rounded-md px-2.5 py-1.5">
                  <div className="text-[10px] text-zinc-500">DD</div>
                  <div className="text-[12px] text-white font-medium">-4.1%</div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { icon: Bot, label: "24/5 Auto" },
                { icon: Layers, label: "Multi-asset" },
                { icon: Zap, label: "News Filter" },
              ].map((it, i) => (
                <div key={i} className="glass rounded-lg p-3 flex items-center gap-2">
                  <it.icon className="h-4 w-4 text-violet-300" />
                  <span className="text-[12px] text-zinc-300">{it.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/products/algo-strategy")}
              className="mt-6 btn-primary !py-2.5"
              style={{
                background: "linear-gradient(180deg, #8B5CF6 0%, #7C3AED 100%)",
                borderColor: "rgba(167,139,250,0.6)",
                boxShadow: "0 8px 24px -8px rgba(139,92,246,0.55), inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              View Algo Strategy <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
