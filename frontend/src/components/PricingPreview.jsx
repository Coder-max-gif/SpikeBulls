import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useProducts } from "../lib/queries";
import { SectionHeader } from "./ProductsOverview";

export default function PricingPreview({ heading = true, limit = 3 }) {
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  // Choose: 2 highlight items + a non-highlight in middle (or just take first N)
  const sorted = [...products].sort((a, b) => (b.highlight ? 1 : 0) - (a.highlight ? 1 : 0));
  const display = limit ? sorted.slice(0, limit) : sorted;
  // Ensure highlight card is in the middle for 3-card layout (purely visual)
  const ordered = (() => {
    if (display.length !== 3) return display;
    const highlight = display.find((p) => p.highlight);
    const rest = display.filter((p) => p.id !== highlight?.id);
    if (!highlight || rest.length !== 2) return display;
    return [rest[0], highlight, rest[1]];
  })();

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        {heading && (
          <SectionHeader
            eyebrow="Pricing"
            title="Simple, transparent pricing"
            subtitle="Lifetime licenses on most products. Signals available as a 30-day rolling membership."
          />
        )}

        {loading ? (
          <div className="mt-14 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
          </div>
        ) : (
          <div className={`mt-14 grid gap-5 ${ordered.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {ordered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.07 }}
                className={`relative rounded-2xl p-7 flex flex-col ${
                  p.highlight ? "glass-strong animated-border" : "glass"
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
                      p.delivery_type === "membership"
                        ? "bg-violet-500/10 text-violet-300"
                        : "bg-blue-500/10 text-blue-300"
                    }`}
                  >
                    {p.delivery_type === "membership" ? "30d" : "Lifetime"}
                  </span>
                </div>

                <p className="mt-2 text-[13.5px] text-zinc-400">{p.short_description}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-[44px] text-white font-semibold tracking-tight">
                    ${p.price.toFixed(0)}
                  </span>
                  {p.compare_at_price && p.compare_at_price > p.price && (
                    <span className="text-[14px] text-zinc-500 line-through">${p.compare_at_price.toFixed(0)}</span>
                  )}
                </div>

                <ul className="mt-6 space-y-2.5">
                  {(p.features || []).slice(0, 6).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13.5px] text-zinc-300">
                      <Check className="h-4 w-4 mt-0.5 shrink-0 text-blue-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex-1" />

                <button
                  onClick={() => navigate(`/products/${p.slug}`)}
                  className={`mt-8 ${p.highlight ? "btn-primary" : "btn-ghost"}`}
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {limit && (
          <div className="mt-10 text-center">
            <button onClick={() => navigate("/products")} className="btn-ghost">
              See all products <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <p className="mt-8 text-center text-[12px] text-zinc-500">
          Lifetime licenses include free updates. Signals are billed as a 30-day rolling membership.
        </p>
      </div>
    </section>
  );
}
