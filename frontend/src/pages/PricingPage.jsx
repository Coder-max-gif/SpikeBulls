import React from "react";
import { motion } from "framer-motion";
import PricingPreview from "../components/PricingPreview";
import FAQ from "../components/FAQ";
import FinalCTA from "../components/FinalCTA";

export default function PricingPage() {
  return (
    <main className="bg-app">
      <section className="relative pt-32 pb-4 sm:pt-40 overflow-hidden">
        <div className="absolute inset-0 grid-overlay" />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex glass rounded-full px-3 py-1 text-[11.5px] uppercase tracking-[0.18em] text-slate-700">
              Pricing
            </div>
            <h1 className="mt-5 font-display text-[44px] sm:text-[60px] font-semibold tracking-tight leading-[1.04] text-slate-900">
              Lifetime access. <span className="text-gradient-accent">No subscriptions.</span>
            </h1>
            <p className="mt-5 text-slate-600 text-[16px] sm:text-[18px] leading-relaxed">
              Pay once, own forever. Includes lifetime updates and community access on every plan.
            </p>
          </motion.div>
        </div>
      </section>

      <PricingPreview heading={false} />
      <FAQ heading={true} limit={5} />
      <FinalCTA />
    </main>
  );
}
