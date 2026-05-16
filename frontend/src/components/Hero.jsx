import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import AnimatedDashboard from "./AnimatedDashboard";
import GlowCube from "./GlowCube";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-app">
      <div className="absolute inset-0 grid-overlay" />

      {/* glow cube behind text */}
      <div className="hidden lg:block absolute top-32 right-[-60px] opacity-90 pointer-events-none">
        <GlowCube size={260} />
      </div>

      <div className="relative mx-auto max-w-7xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 w-fit mx-auto glass rounded-full px-3 py-1.5 mb-7"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-[12px] text-zinc-300">
            v4.2 · Adaptive volatility engine is live
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-display text-center text-[44px] sm:text-[64px] lg:text-[76px] leading-[1.02] tracking-tight font-semibold"
        >
          <span className="text-gradient">Institutional-grade</span>
          <br />
          <span className="text-white">trading tools for the </span>
          <span className="text-gradient-accent">modern trader</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 text-center text-zinc-400 text-[16px] sm:text-[18px] max-w-2xl mx-auto leading-relaxed"
        >
          A precision MT5 indicator suite and a fully automated algo strategy —
          engineered for traders who refuse to leave money on the table.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <button onClick={() => navigate("/pricing")} className="btn-primary">
            Start Trading <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              const el = document.querySelector("#products");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-ghost"
          >
            See the products
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-5 flex items-center justify-center gap-2 text-[12px] text-zinc-500"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/80" />
          14-day demo license available · No card required
        </motion.div>

        <div className="mt-16 sm:mt-20 max-w-5xl mx-auto">
          <AnimatedDashboard />
        </div>
      </div>

      {/* bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#06070B]" />
    </section>
  );
}
