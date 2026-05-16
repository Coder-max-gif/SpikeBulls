import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, LineChart, Bot } from "lucide-react";
import { PRODUCTS } from "../mock";

export default function ProductsOverview() {
  const navigate = useNavigate();
  return (
    <section id="products" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow="Two Products. One Edge."
          title="Built for traders who treat this seriously"
          subtitle="Use the MT5 Indicator for sharp manual setups, deploy the Algo Strategy for fully automated execution, or run them together for maximum coverage."
        />

        <div className="mt-14 grid lg:grid-cols-2 gap-5">
          {PRODUCTS.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="group relative glass-strong rounded-2xl overflow-hidden"
            >
              {/* accent glow */}
              <div
                className={`pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-50 ${
                  p.accent === "blue"
                    ? "bg-blue-500/30"
                    : "bg-violet-500/30"
                }`}
              />

              <div className="relative p-7 sm:p-9">
                <div className="flex items-center justify-between">
                  <div
                    className={`h-11 w-11 rounded-xl flex items-center justify-center border ${
                      p.accent === "blue"
                        ? "bg-blue-500/10 border-blue-400/30 text-blue-300"
                        : "bg-violet-500/10 border-violet-400/30 text-violet-300"
                    }`}
                  >
                    {p.accent === "blue" ? <LineChart className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                  <div className="flex items-center gap-2">
                    {p.platforms.map((pl) => (
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
                  {p.title}
                </h3>
                <p className="mt-2 text-zinc-400 text-[15px]">{p.tagline}</p>
                <p className="mt-4 text-zinc-500 text-[14px] leading-relaxed">{p.description}</p>

                <ul className="mt-6 grid sm:grid-cols-2 gap-x-4 gap-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13.5px] text-zinc-300">
                      <Check
                        className={`h-4 w-4 mt-0.5 shrink-0 ${
                          p.accent === "blue" ? "text-blue-400" : "text-violet-400"
                        }`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex items-center gap-3">
                  <button
                    onClick={() => navigate(p.href)}
                    className="btn-primary !py-2.5"
                  >
                    {p.cta} <ArrowRight className="h-4 w-4" />
                  </button>
                  <button onClick={() => navigate("/pricing")} className="btn-ghost !py-2.5">
                    View pricing
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
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
