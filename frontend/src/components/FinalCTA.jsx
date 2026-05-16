import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import GlowCube from "./GlowCube";

export default function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-overlay" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(96,165,250,0.18), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="glass-strong rounded-3xl p-10 sm:p-16 relative overflow-hidden text-center"
        >
          <div className="absolute -top-12 -left-12 opacity-50 hidden sm:block">
            <GlowCube size={140} />
          </div>
          <div className="absolute -bottom-12 -right-12 opacity-50 hidden sm:block">
            <GlowCube size={140} />
          </div>

          <div className="relative">
            <div className="inline-flex glass rounded-full px-3 py-1 text-[11.5px] uppercase tracking-[0.18em] text-zinc-300 items-center gap-1">
              <Sparkles className="h-3 w-3 text-blue-400" /> Ready when you are
            </div>
            <h2 className="mt-6 font-display text-[36px] sm:text-[56px] font-semibold tracking-tight leading-[1.05]">
              <span className="text-white">Stop trading on </span>
              <span className="text-gradient-accent">hope.</span>
              <br />
              <span className="text-white">Start trading on </span>
              <span className="text-gradient-accent">data.</span>
            </h2>
            <p className="mt-5 text-zinc-400 text-[15px] sm:text-[17px] max-w-xl mx-auto">
              Join thousands of traders running our indicator and algo strategy in live markets every day.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => navigate("/pricing")} className="btn-primary">
                Get Started <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => navigate("/contact")} className="btn-ghost">
                Request demo license
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
