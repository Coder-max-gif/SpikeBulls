import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { FEATURES } from "../mock";
import { SectionHeader } from "./ProductsOverview";
import TiltCard from "./TiltCard";

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow="Why traders choose us"
          title="Every edge, engineered in"
          subtitle="From signal clarity to portfolio-level risk control — each feature is built to compound your advantage."
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = Icons[f.icon] || Icons.Sparkles;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <TiltCard className="group relative glass rounded-2xl p-6 overflow-hidden hover:border-slate-300 transition-all">
                  {/* hover glow */}
                  <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(400px circle at var(--x, 50%) var(--y, 0%), rgba(96,165,250,0.12), transparent 50%)",
                    }}
                  />
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500/15 to-violet-500/15 border border-slate-200 text-blue-600">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-5 font-display text-[20px] text-slate-900 font-medium">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[14px] text-slate-600 leading-relaxed">{f.desc}</p>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
