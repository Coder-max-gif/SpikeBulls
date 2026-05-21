import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import AnimatedDashboard from "./AnimatedDashboard";
import GlowCube from "./GlowCube";
import FloatingOrb from "./FloatingOrb";
import MagneticButton from "./MagneticButton";
import ShootingStars from "./ShootingStars";
import QuantBackground from "./QuantBackground";

export default function Hero() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 400, damping: 60 });
  const mouseY = useSpring(y, { stiffness: 400, damping: 60 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    x.set(e.clientX - rect.left - centerX);
    y.set(e.clientY - rect.top - centerY);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-app"
    >
      <QuantBackground />
      <ShootingStars count={16} />

      <motion.div
        className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-[-80px] opacity-95 pointer-events-none z-0"
        style={{
          x: useTransform(mouseX, (val) => val * 0.4),
          y: useTransform(mouseY, (val) => val * 0.4),
        }}
      >
        <FloatingOrb size={420} />
      </motion.div>

      <motion.div
        className="hidden lg:block absolute top-20 left-[-40px] opacity-70 pointer-events-none z-0"
        style={{
          x: useTransform(mouseX, (val) => val * 0.2),
          y: useTransform(mouseY, (val) => val * 0.2),
        }}
      >
        <GlowCube size={180} />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-5 z-10">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="flex items-center gap-2 w-fit mx-auto glass-strong rounded-full px-3 py-1.5 mb-7"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
          <span className="text-[12px] text-slate-700">
            v4.2 · Adaptive volatility engine is live
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, type: "spring" }}
          className="font-display text-center text-[44px] sm:text-[64px] lg:text-[80px] leading-[1.02] tracking-tight font-semibold"
        >
          <span className="text-gradient">Institutional-grade</span>
          <br />
          <span className="text-slate-900">trading tools for the </span>
          <span className="text-gradient-accent">modern trader</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="mt-6 text-center text-slate-600 text-[16px] sm:text-[18px] max-w-2xl mx-auto leading-relaxed"
        >
          A precision MT5 indicator suite and a fully automated algo strategy —
          engineered for traders who refuse to leave money on the table.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, type: "spring" }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton onClick={() => navigate("/pricing")}>
            Start Trading
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton
            variant="ghost"
            onClick={() => {
              const el = document.querySelector("#products");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            See the products
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-5 flex items-center justify-center gap-2 text-[12px] text-slate-500"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/80" />
          14-day demo license available · No card required
        </motion.div>

        <div className="mt-16 sm:mt-20 max-w-5xl mx-auto">
          <AnimatedDashboard />
        </div>
      </div>

      {/* bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#F8FAFC]" />
    </section>
  );
}
