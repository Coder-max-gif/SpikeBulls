import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PERFORMANCE_METRICS, EQUITY_CURVE } from "../mock";
import { SectionHeader } from "./ProductsOverview";
import AnimatedNumber from "./AnimatedNumber";

export default function Performance() {
  const curve = useMemo(() => {
    const max = Math.max(...EQUITY_CURVE);
    const min = Math.min(...EQUITY_CURVE);
    const w = 600, h = 220, pad = 8;
    const points = EQUITY_CURVE.map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / (EQUITY_CURVE.length - 1);
      const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
      return [x, y];
    });
    const line = points
      .map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`))
      .join(" ");
    const area = `${line} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`;
    return { line, area, w, h };
  }, []);

  return (
    <section id="performance" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow="Performance"
          title="Numbers that hold up under audit"
          subtitle="Twelve months of live, forward-tested execution across the Algo Strategy portfolio. Past performance is not a guarantee of future results."
        />

        <div className="mt-14 grid lg:grid-cols-5 gap-5">
          {/* chart card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 glass-strong rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[12px] text-zinc-500">Equity Curve · 12M</div>
                <div className="flex items-baseline gap-3 mt-1">
                  <div className="font-display text-[34px] text-white font-semibold tracking-tight">
                    <AnimatedNumber value="+184.2%" />
                  </div>
                  <span className="text-emerald-400 text-[13px] flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> net
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                {["1M", "3M", "6M", "1Y", "All"].map((t) => (
                  <span
                    key={t}
                    className={`text-[11px] px-2 py-1 rounded-md border ${
                      t === "1Y"
                        ? "bg-white/[0.06] border-white/10 text-white"
                        : "border-transparent text-zinc-500"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative rounded-xl bg-[#0A0C13] border border-white/5 p-4 overflow-hidden">
              <div className="absolute inset-0 grid-overlay opacity-50" />
              <svg viewBox={`0 0 ${curve.w} ${curve.h}`} className="relative w-full h-[220px]">
                <defs>
                  <linearGradient id="perfLine" x1="0" x2="1">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                  <linearGradient id="perfArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    x2={curve.w}
                    y1={40 + i * 50}
                    y2={40 + i * 50}
                    stroke="rgba(255,255,255,0.05)"
                    strokeDasharray="3 4"
                  />
                ))}
                <motion.path
                  d={curve.area}
                  fill="url(#perfArea)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                />
                <motion.path
                  d={curve.line}
                  fill="none"
                  stroke="url(#perfLine)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </svg>
            </div>
          </motion.div>

          {/* metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-3"
          >
            {PERFORMANCE_METRICS.map((m) => (
              <div key={m.label} className="glass rounded-2xl p-5">
                <div className="text-[12px] text-zinc-500">{m.label}</div>
                <div className="mt-1 font-display text-[26px] text-white font-semibold tracking-tight">
                  <AnimatedNumber value={m.value} />
                </div>
                <div
                  className={`text-[11px] mt-1 flex items-center gap-1 ${
                    m.trend === "up" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {m.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  vs. benchmark
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <p className="mt-10 text-center text-[12px] text-zinc-500 max-w-2xl mx-auto">
          Results shown reflect a live forward-tested portfolio. Trading carries risk; past performance does not guarantee future results.
        </p>
      </div>
    </section>
  );
}
