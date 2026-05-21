import React from "react";
import { motion } from "framer-motion";
import { HOW_IT_WORKS } from "../mock";
import { SectionHeader } from "./ProductsOverview";

export default function HowItWorks() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow="How it works"
          title="From signup to first trade in minutes"
          subtitle="No complicated setup, no manual configuration nightmares. Three steps and you're live."
        />

        <div className="mt-16 relative">
          {/* connector line */}
          <div className="hidden lg:block absolute top-[58px] left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

          <div className="grid lg:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="flex justify-center">
                  <div className="relative h-[116px] w-[116px] rounded-full glass-strong flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/10 to-violet-500/10" />
                    <span className="relative font-display text-[34px] text-gradient-accent font-semibold tracking-tight">
                      {s.step}
                    </span>
                    <div className="absolute -inset-1 rounded-full bg-blue-500/10 blur-xl -z-10" />
                  </div>
                </div>
                <div className="mt-6 text-center max-w-sm mx-auto">
                  <h3 className="font-display text-[22px] text-slate-900 font-medium">{s.title}</h3>
                  <p className="mt-2 text-[14px] text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
