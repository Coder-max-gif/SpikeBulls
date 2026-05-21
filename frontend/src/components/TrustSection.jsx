import React from "react";
import { motion } from "framer-motion";
import { TRUST_BADGES, TRUST_STATS } from "../mock";
import AnimatedNumber from "./AnimatedNumber";

export default function TrustSection() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="text-center mb-12">
          <p className="text-[12px] uppercase tracking-[0.18em] text-slate-500">
            Trusted by traders worldwide
          </p>
        </div>

        {/* badges marquee */}
        <div className="relative overflow-hidden">
          <div className="flex gap-3 animate-marquee w-max">
            {[...TRUST_BADGES, ...TRUST_BADGES, ...TRUST_BADGES].map((b, i) => (
              <div
                key={i}
                className="glass rounded-xl px-5 py-3 flex flex-col min-w-[180px]"
              >
                <span className="text-[14px] text-slate-900 font-medium">{b.label}</span>
                <span className="text-[11px] text-slate-500">{b.sub}</span>
              </div>
            ))}
          </div>
          {/* edges fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F8FAFC] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F8FAFC] to-transparent" />
        </div>

        {/* stats */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {TRUST_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass rounded-2xl p-6"
            >
              <div className="font-display text-[32px] sm:text-[40px] text-slate-900 font-semibold tracking-tight leading-none">
                <AnimatedNumber value={s.value} />
              </div>
              <div className="mt-2 text-[13px] text-slate-600">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
