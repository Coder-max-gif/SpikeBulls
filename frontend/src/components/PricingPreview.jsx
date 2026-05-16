import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { PRICING_PLANS } from "../mock";
import { SectionHeader } from "./ProductsOverview";

export default function PricingPreview({ heading = true }) {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        {heading && (
          <SectionHeader
            eyebrow="Pricing"
            title="Simple, lifetime pricing"
            subtitle="Pay once. Own it forever. Lifetime updates included on every plan."
          />
        )}

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {PRICING_PLANS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              className={`relative rounded-2xl p-7 flex flex-col ${
                p.highlight
                  ? "glass-strong animated-border"
                  : "glass"
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white border border-white/10 inline-flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> {p.badge}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h3 className="font-display text-[20px] text-white font-medium">{p.name}</h3>
                <span
                  className={`text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    p.accent === "blue"
                      ? "bg-blue-500/10 text-blue-300"
                      : p.accent === "violet"
                      ? "bg-violet-500/10 text-violet-300"
                      : "bg-white/[0.06] text-zinc-300"
                  }`}
                >
                  {p.period}
                </span>
              </div>

              <p className="mt-2 text-[13.5px] text-zinc-400">{p.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-[44px] text-white font-semibold tracking-tight">
                  ${p.price}
                </span>
                <span className="text-[13px] text-zinc-500">USD</span>
              </div>

              <ul className="mt-6 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13.5px] text-zinc-300">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-blue-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="flex-1" />

              <button
                onClick={() => navigate("/contact")}
                className={`mt-8 ${
                  p.highlight ? "btn-primary" : "btn-ghost"
                }`}
              >
                {p.cta} <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-[12px] text-zinc-500">
          All plans include lifetime updates, community access, and email support. 14-day demo on request.
        </p>
      </div>
    </section>
  );
}
