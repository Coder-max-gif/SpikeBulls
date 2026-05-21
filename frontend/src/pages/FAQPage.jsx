import React from "react";
import { motion } from "framer-motion";
import FAQ from "../components/FAQ";
import FinalCTA from "../components/FinalCTA";

export default function FAQPage() {
  return (
    <main className="bg-app">
      <section className="relative pt-32 pb-4 sm:pt-40 overflow-hidden">
        <div className="absolute inset-0 grid-overlay" />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex glass rounded-full px-3 py-1 text-[11.5px] uppercase tracking-[0.18em] text-slate-700">
              Help Center
            </div>
            <h1 className="mt-5 font-display text-[44px] sm:text-[60px] font-semibold tracking-tight leading-[1.04] text-slate-900">
              Frequently asked <span className="text-gradient-accent">questions</span>
            </h1>
            <p className="mt-5 text-slate-600 text-[16px] sm:text-[18px] leading-relaxed">
              Everything you need to know about our products, setup, and support.
            </p>
          </motion.div>
        </div>
      </section>

      <FAQ heading={false} />
      <FinalCTA />
    </main>
  );
}
