import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, Loader2 } from "lucide-react";
import { useTestimonials } from "../lib/queries";
import { SectionHeader } from "./ProductsOverview";

export default function Testimonials() {
  const { items, loading } = useTestimonials();
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow="Trader voices"
          title="What serious traders are saying"
          subtitle="Real reviews from prop traders, portfolio managers, and quantitative researchers using SpikeBulls."
        />

        {loading ? (
          <div className="mt-14 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
          </div>
        ) : (
          <div className="mt-14 grid sm:grid-cols-2 gap-5">
            {items.map((t, i) => (
              <motion.div
                key={t.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="glass rounded-2xl p-7 relative"
              >
                <Quote className="absolute top-5 right-5 h-6 w-6 text-blue-400/20" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating || 5 }).map((_, i2) => (
                    <Star key={i2} className="h-3.5 w-3.5 fill-blue-300 text-blue-600" />
                  ))}
                </div>
                <p className="text-[15px] text-slate-800 leading-relaxed">“{t.quote}”</p>
                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-slate-200">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/30 border border-slate-200 flex items-center justify-center text-slate-900 font-medium text-sm">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-[14px] text-slate-900 font-medium">{t.name}</div>
                    <div className="text-[12px] text-slate-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
