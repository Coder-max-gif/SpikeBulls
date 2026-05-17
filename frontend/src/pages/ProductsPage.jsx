import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2, LineChart, Bot, Radio, Settings2 } from "lucide-react";
import { useProducts } from "../lib/queries";

const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "indicator", label: "Indicators" },
  { id: "algo", label: "Algo Strategies" },
  { id: "signals", label: "Forex Signals" },
  { id: "automation", label: "Automation Tools" },
];

const ICONS = { indicator: LineChart, algo: Bot, signals: Radio, automation: Settings2 };

export default function ProductsPage() {
  const [cat, setCat] = useState("all");
  const { products, loading } = useProducts(cat === "all" ? undefined : cat);
  const navigate = useNavigate();

  return (
    <main className="bg-app min-h-screen">
      <section className="relative pt-32 pb-12 sm:pt-40 overflow-hidden">
        <div className="absolute inset-0 grid-overlay" />
        <div className="relative mx-auto max-w-7xl px-5">
          <div className="max-w-2xl">
            <div className="inline-flex glass rounded-full px-3 py-1 text-[11.5px] uppercase tracking-[0.18em] text-zinc-300">Catalog</div>
            <h1 className="mt-5 font-display text-[44px] sm:text-[56px] font-semibold tracking-tight leading-[1.04] text-white">
              All SpikeBulls <span className="text-gradient-accent">products</span>
            </h1>
            <p className="mt-4 text-zinc-400 text-[16px] leading-relaxed">
              Indicators, algorithmic strategies, forex signals, and automation tools — built for traders who treat this as a business.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`px-3.5 py-2 rounded-lg text-[13px] transition-colors ${
                  cat === c.id
                    ? "bg-white/[0.07] text-white border border-white/15"
                    : "text-zinc-400 hover:text-white border border-white/10 bg-white/[0.02]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 pb-24">
        <div className="mx-auto max-w-7xl px-5">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-zinc-500" /></div>
          ) : products.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-zinc-400">No products in this category yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p, i) => {
                const Icon = ICONS[p.category] || LineChart;
                const isViolet = p.accent === "violet" || p.accent === "gradient";
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    className="glass rounded-2xl p-6 flex flex-col"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`h-10 w-10 rounded-lg border flex items-center justify-center ${
                        isViolet ? "bg-violet-500/15 border-violet-400/30 text-violet-300" : "bg-blue-500/15 border-blue-400/30 text-blue-300"
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {p.badge && (
                        <span className="text-[10.5px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-200 border border-white/10">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-5 font-display text-[20px] text-white font-medium">{p.name}</h3>
                    <p className="mt-2 text-[13.5px] text-zinc-400 line-clamp-2">{p.short_description}</p>

                    <ul className="mt-4 space-y-1.5">
                      {(p.features || []).slice(0, 3).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-[12.5px] text-zinc-300">
                          <Check className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${isViolet ? "text-violet-400" : "text-blue-400"}`} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex-1" />
                    <div className="mt-6 flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-[26px] text-white font-semibold">${p.price.toFixed(0)}</span>
                        {p.compare_at_price && p.compare_at_price > p.price && (
                          <span className="text-[12px] text-zinc-500 line-through">${p.compare_at_price.toFixed(0)}</span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-500">{p.delivery_type === "membership" ? "30d" : "Lifetime"}</span>
                    </div>
                    <button onClick={() => navigate(`/products/${p.slug}`)} className="btn-primary mt-4 !py-2.5">
                      View product <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
