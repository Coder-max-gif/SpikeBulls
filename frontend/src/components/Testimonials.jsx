import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "../mock";
import { SectionHeader } from "./ProductsOverview";

export default function Testimonials() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow="Trader voices"
          title="What serious traders are saying"
          subtitle="Real reviews from prop traders, portfolio managers, and quantitative researchers using our products."
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="glass rounded-2xl p-7 relative"
            >
              <Quote className="absolute top-5 right-5 h-6 w-6 text-blue-400/20" />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-blue-300 text-blue-300" />
                ))}
              </div>
              <p className="text-[15px] text-zinc-200 leading-relaxed">“{t.quote}”</p>
              <div className="mt-6 flex items-center gap-3 pt-5 border-t border-white/5">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/30 border border-white/10 flex items-center justify-center text-white font-medium text-sm">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-[14px] text-white font-medium">{t.name}</div>
                  <div className="text-[12px] text-zinc-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
