import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Circle } from "lucide-react";

// Animated SVG trading dashboard mockup
export default function AnimatedDashboard() {
  const candles = useMemo(() => generateCandles(38), []);
  const linePath = useMemo(() => generateLine(60), []);

  return (
    <div className="relative w-full">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative glass-strong rounded-2xl p-5 overflow-hidden"
        style={{
          boxShadow:
            "0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* top toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            </div>
            <div className="flex items-center gap-2 text-[12px] text-zinc-400">
              <span className="font-medium text-white">EUR/USD</span>
              <span className="text-zinc-500">· H1</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300">LIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-zinc-500">SpikeBulls</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <span className="text-zinc-400">v4.2</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <Stat label="Equity" value="$48,294" delta="+2.4%" up />
          <Stat label="Win Rate" value="68.4%" delta="+0.6%" up />
          <Stat label="DD" value="-4.1%" delta="-0.3%" up={false} />
        </div>

        {/* chart area */}
        <div className="relative rounded-xl bg-[#0A0C13] border border-white/5 p-4 overflow-hidden">
          <div className="absolute inset-0 grid-overlay opacity-60" />
          <svg viewBox="0 0 600 240" className="relative w-full h-[200px] sm:h-[240px]">
            <defs>
              <linearGradient id="lineGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
              <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* horizontal grid */}
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1="0"
                x2="600"
                y1={50 + i * 50}
                y2={50 + i * 50}
                stroke="rgba(255,255,255,0.04)"
                strokeDasharray="3 4"
              />
            ))}

            {/* candles */}
            {candles.map((c, i) => {
              const x = 10 + i * 14;
              const color = c.up ? "#34D399" : "#F87171";
              return (
                <g key={i}>
                  <line x1={x + 4} x2={x + 4} y1={c.high} y2={c.low} stroke={color} strokeOpacity="0.7" />
                  <rect
                    x={x}
                    y={Math.min(c.open, c.close)}
                    width="8"
                    height={Math.max(2, Math.abs(c.close - c.open))}
                    fill={color}
                    opacity="0.85"
                  />
                </g>
              );
            })}

            {/* line overlay */}
            <motion.path
              d={linePath.area}
              fill="url(#areaGrad)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
            />
            <motion.path
              d={linePath.line}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            />

            {/* signal markers */}
            <Signal x="120" y="160" type="buy" />
            <Signal x="320" y="110" type="sell" />
            <Signal x="500" y="70" type="buy" />
          </svg>

          {/* floating tooltip */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute top-4 right-4 glass rounded-lg px-3 py-2 text-[11px]"
          >
            <div className="text-zinc-400">Signal · BUY</div>
            <div className="text-white font-medium">1.0842 → 1.0901</div>
            <div className="text-emerald-400 flex items-center gap-1 mt-0.5">
              <TrendingUp className="h-3 w-3" /> +59 pips
            </div>
          </motion.div>
        </div>

        {/* bottom row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <MiniMetric label="Sharpe" value="2.71" />
          <MiniMetric label="Profit Factor" value="3.18" />
          <MiniMetric label="Avg R:R" value="1:2.4" />
          <MiniMetric label="Trades / wk" value="34" />
        </div>
      </motion.div>

      {/* floating mini cards */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="hidden sm:flex absolute -left-6 top-1/3 glass-strong rounded-xl p-3 animate-float"
        style={{ animationDelay: "-2s" }}
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <ArrowUpRight className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500">XAU/USD</div>
            <div className="text-[13px] text-white font-medium">+128 pips</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="hidden sm:flex absolute -right-4 bottom-10 glass-strong rounded-xl p-3 animate-float"
      >
        <div className="flex items-center gap-2">
          <Circle className="h-2 w-2 fill-blue-400 text-blue-400" />
          <div>
            <div className="text-[10px] text-zinc-500">Latency</div>
            <div className="text-[13px] text-white font-medium">42ms</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Stat({ label, value, delta, up }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="text-[11px] text-zinc-500">{label}</div>
      <div className="text-[18px] text-white font-medium font-display mt-0.5">{value}</div>
      <div
        className={`text-[11px] mt-0.5 flex items-center gap-1 ${
          up ? "text-emerald-400" : "text-rose-400"
        }`}
      >
        {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {delta}
      </div>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="flex items-center justify-between glass rounded-lg px-3 py-2">
      <span className="text-[11px] text-zinc-500">{label}</span>
      <span className="text-[13px] text-white font-medium">{value}</span>
    </div>
  );
}

function Signal({ x, y, type }) {
  const color = type === "buy" ? "#34D399" : "#F87171";
  return (
    <g>
      <circle cx={x} cy={y} r="6" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
      <circle cx={x} cy={y} r="2" fill={color} />
    </g>
  );
}

function generateCandles(n) {
  let price = 130;
  const arr = [];
  for (let i = 0; i < n; i++) {
    const open = price;
    const move = (Math.random() - 0.45) * 14;
    const close = open - move; // SVG y inverted
    const high = Math.min(open, close) - Math.random() * 6 - 2;
    const low = Math.max(open, close) + Math.random() * 6 + 2;
    arr.push({ open, close, high, low, up: close < open });
    price = close;
  }
  return arr;
}

function generateLine(n) {
  let y = 170;
  const points = [];
  for (let i = 0; i < n; i++) {
    y += (Math.random() - 0.55) * 8;
    y = Math.max(40, Math.min(200, y));
    const x = (i * 600) / (n - 1);
    points.push([x, y]);
  }
  const line = points
    .map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`))
    .join(" ");
  const area = `${line} L 600 240 L 0 240 Z`;
  return { line, area };
}
