import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, LineChart, Bot, Radio, Settings2, Loader2 } from "lucide-react";
import { useProducts } from "../lib/queries";
import TiltCard from "./TiltCard";
import MagneticButton from "./MagneticButton";

const CATEGORY_ICONS = {
  indicator: LineChart,
  algo: Bot,
  signals: Radio,
  automation: Settings2,
};

export default function ProductsOverview() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  // Pick the two flagship products: one indicator + one algo (fallback to first 2)
  const indicator = products.find((p) => p.category === "indicator");
  const algo = products.find((p) => p.category === "algo");
  const featured = [indicator, algo].filter(Boolean).slice(0, 2);
  const display = featured.length === 2 ? featured : products.slice(0, 2);

  return (
    <section id="products" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow="Built for Serious Traders"
          title="Four products. One unfair edge."
          subtitle="Indicators, algos, signals, and automation tools — use them solo or stack them for full coverage."
        />

        {loading ? (
          <div className="mt-14 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
          </div>
        ) : (
          <div className="mt-14 grid lg:grid-cols-2 gap-5">
            {display.map((p, idx) => {
              const Icon = CATEGORY_ICONS[p.category] || LineChart;
              const accent = p.accent === "violet" ? "violet" : "blue";
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                >
                  <TiltCard className="group relative glass-strong rounded-2xl overflow-hidden">
                    <div
                      className={`pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-50 ${
                        accent === "blue" ? "bg-blue-500/30" : "bg-violet-500/30"
                      }`}
                    />
                    <div className="relative p-7 sm:p-9">
                      <div className="flex items-center justify-between">
                        <div
                          className={`h-11 w-11 rounded-xl flex items-center justify-center border ${
                            accent === "blue"
                              ? "bg-blue-500/10 border-blue-400/30 text-blue-300"
                              : "bg-violet-500/10 border-violet-400/30 text-violet-300"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex items-center gap-2">
                          {(p.platforms || []).slice(0, 3).map((pl) => (
                            <span
                              key={pl}
                              className="text-[11px] text-zinc-400 px-2 py-1 rounded-md bg-white/[0.04] border border-white/5"
                            >
                              {pl}
                            </span>
                          ))}
                        </div>
                      </div>

                      <h3 className="mt-6 font-display text-[28px] sm:text-[32px] text-white font-semibold tracking-tight">
                        {p.name}
                      </h3>
                      <p className="mt-2 text-zinc-400 text-[15px]">{p.short_description}</p>
                      <p className="mt-4 text-zinc-500 text-[14px] leading-relaxed line-clamp-3">{p.description}</p>

                      <ul className="mt-6 grid sm:grid-cols-2 gap-x-4 gap-y-2.5">
                        {(p.features || []).slice(0, 5).map((f) => (
                          <li key={f} className="flex items-start gap-2 text-[13.5px] text-zinc-300">
                            <Check className={`h-4 w-4 mt-0.5 shrink-0 ${accent === "blue" ? "text-blue-400" : "text-violet-400"}`} />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 flex items-center gap-3">
                        <MagneticButton onClick={() => navigate(`/products/${p.slug}`)} className="!py-2.5">
                          Explore
                          <ArrowRight className="h-4 w-4" />
                        </MagneticButton>
                        <MagneticButton variant="ghost" onClick={() => navigate("/pricing")} className="!py-2.5">
                          ${p.price.toFixed(0)} · view pricing
                        </MagneticButton>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <button onClick={() => navigate("/products")} className="btn-ghost">
            See all products <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, align = "center" }) {
  return (
    <div className={align === "center" ? "max-w-2xl mx-auto text-center" : "max-w-2xl"}>
      {eyebrow && (
        <div className="inline-flex glass rounded-full px-3 py-1 text-[11.5px] uppercase tracking-[0.18em] text-zinc-400">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-5 font-display text-[34px] sm:text-[44px] text-white font-semibold tracking-tight leading-[1.08]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-zinc-400 text-[16px] leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
