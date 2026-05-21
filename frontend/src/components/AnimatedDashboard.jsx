import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Circle } from "lucide-react";

// Animated SVG trading dashboard mockup
export default function AnimatedDashboard() {
  const [currentPrice, setCurrentPrice] = useState(2345.67);
  const [priceDirection, setPriceDirection] = useState("up");
  const [priceChange, setPriceChange] = useState(0.45);

  // Real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice((prev) => {
        const change = (Math.random() - 0.48) * 2.5;
        const newPrice = parseFloat((prev + change).toFixed(2));
        
        setPriceDirection(change > 0 ? "up" : "down");
        setPriceChange(parseFloat((Math.abs(change) / prev * 100).toFixed(2)));
        
        return newPrice;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const candles = useMemo(() => generateCandles(45), []);
  const linePath = useMemo(() => generateLine(80), []);

  return (
    <div className="relative w-full">
      <motion.div
        initial={{ opacity: 0, y: 24, rotateX: 5 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative glass-strong rounded-2xl p-5 overflow-hidden"
        style={{
          boxShadow:
            "0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(15,23,42,0.07), 0 20px 40px -10px rgba(255,215,0,0.08)",
          transform: "perspective(1000px)",
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
            <div className="flex items-center gap-2 text-[12px] text-slate-600">
              <span className="font-medium text-slate-900">XAU/USD</span>
              <span className="text-slate-500">· M15</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600">LIVE</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 ml-4">
              <span className={`text-lg font-bold ${priceDirection === 'up' ? 'text-emerald-400' : 'text-rose-600'}`}>
                ${currentPrice.toLocaleString()}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${priceDirection === 'up' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-rose-500/20 text-rose-600'}`}>
                {priceDirection === 'up' ? '+' : '-'}{priceChange}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-500">SpikeBulls</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <span className="text-slate-600">v5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <Stat label="Equity" value="$84,294" delta="+8.2%" up />
          <Stat label="Win Rate" value="92%" delta="+1.4%" up />
          <Stat label="DD" value="-1.8%" delta="+0.5%" up={false} />
        </div>

        {/* chart area with 3D effects */}
        <div className="relative rounded-xl bg-slate-50 border border-slate-200 p-4 overflow-hidden">
          <div className="absolute inset-0 grid-overlay opacity-60" />
          <svg viewBox="0 0 600 240" className="relative w-full h-[200px] sm:h-[240px]">
            <defs>
              <linearGradient id="lineGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FCD34D" />
              </linearGradient>
              <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* horizontal grid */}
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1="0"
                x2="600"
                y1={50 + i * 50}
                y2={50 + i * 50}
                stroke="rgba(15,23,42,0.06)"
                strokeDasharray="3 4"
              />
            ))}

            {/* candles with 3D shadow effect */}
            {candles.map((c, i) => {
              const x = 10 + i * 12;
              const color = c.up ? "#34D399" : "#F87171";
              return (
                <g key={i} filter="url(#shadow)">
                  <line x1={x + 3} x2={x + 3} y1={c.high} y2={c.low} stroke={color} strokeOpacity="0.8" strokeWidth="1.2" />
                  <rect
                    x={x + 0.5}
                    y={Math.min(c.open, c.close) + 1}
                    width="5"
                    height={Math.max(2, Math.abs(c.close - c.open))}
                    fill="rgba(0,0,0,0.3)"
                    opacity="0.5"
                  />
                  <rect
                    x={x}
                    y={Math.min(c.open, c.close)}
                    width="6"
                    height={Math.max(2, Math.abs(c.close - c.open))}
                    fill={color}
                    opacity="0.95"
                  />
                </g>
              );
            })}

            {/* line overlay with glow */}
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
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />

            {/* signal markers with glow */}
            <Signal x="150" y="150" type="buy" />
            <Signal x="280" y="90" type="sell" />
            <Signal x="420" y="60" type="buy" />
            <Signal x="520" y="120" type="buy" />
          </svg>

          {/* floating tooltip - 3D style */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute top-4 right-4 glass rounded-lg px-3 py-2 text-[11px]"
            style={{
              boxShadow: "0 10px 30px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(15,23,42,0.10)",
            }}
          >
            <div className="text-slate-600">Signal · BUY</div>
            <div className="text-slate-900 font-medium">2345.67 → 2389.42</div>
            <div className="text-amber-400 flex items-center gap-1 mt-0.5">
              <TrendingUp className="h-3 w-3" /> +437 pips
            </div>
          </motion.div>
        </div>

        {/* bottom row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <MiniMetric label="Sharpe" value="3.94" />
          <MiniMetric label="Profit Factor" value="4.82" />
          <MiniMetric label="Avg R:R" value="1:3.2" />
          <MiniMetric label="Trades / wk" value="58" />
        </div>
      </motion.div>

      {/* floating mini cards with 3D float */}
      <motion.div
        initial={{ opacity: 0, x: -30, rotateY: -15 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex absolute -left-2 sm:-left-6 top-1/4 glass-strong rounded-xl p-3 z-10"
        style={{ 
          animation: "float3D 6s ease-in-out infinite",
          animationDelay: "-2s"
        }}
      >
        <div className="flex items-center gap-2">
          <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-lg flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-500/20 to-yellow-500/10">
            <img src="/spikebulls-logo.png" alt="SpikeBulls Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500">SpikeBulls</div>
            <div className="text-[13px] text-slate-900 font-medium">Gold Trading</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30, rotateY: 15 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="flex absolute -right-2 sm:-right-4 bottom-10 glass-strong rounded-xl p-3 z-10"
        style={{ 
          animation: "float3D 6s ease-in-out infinite",
          animationDelay: "-4s"
        }}
      >
        <div className="flex items-center gap-2">
          <Circle className="h-2 w-2 fill-amber-400 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-500">Latency</div>
            <div className="text-[13px] text-slate-900 font-medium">28ms</div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes float3D {
          0%, 100% { 
            transform: translateY(0px) rotateY(0deg) scale(1);
          }
          25% { 
            transform: translateY(-8px) rotateY(5deg) scale(1.02);
          }
          50% { 
            transform: translateY(-4px) rotateY(0deg) scale(1);
          }
          75% { 
            transform: translateY(-10px) rotateY(-5deg) scale(1.03);
          }
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value, delta, up }) {
  return (
    <motion.div
      className="glass rounded-xl p-3"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="text-[18px] text-slate-900 font-medium font-display mt-0.5">{value}</div>
      <div
        className={`text-[11px] mt-0.5 flex items-center gap-1 ${
          up ? "text-emerald-400" : "text-rose-600"
        }`}
      >
        {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {delta}
      </div>
    </motion.div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="flex items-center justify-between glass rounded-lg px-3 py-2">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="text-[13px] text-slate-900 font-medium">{value}</span>
    </div>
  );
}

function Signal({ x, y, type }) {
  const color = type === "buy" ? "#34D399" : "#F87171";
  return (
    <g>
      <circle cx={x} cy={y} r="10" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2" />
      <circle cx={x} cy={y} r="6" fill={color} fillOpacity="0.2" />
      <circle cx={x} cy={y} r="3" fill={color} />
    </g>
  );
}

function generateCandles(n) {
  let price = 140;
  const arr = [];
  for (let i = 0; i < n; i++) {
    const open = price;
    const move = (Math.random() - 0.47) * 16;
    const close = open - move; // SVG y inverted
    const high = Math.min(open, close) - Math.random() * 8 - 3;
    const low = Math.max(open, close) + Math.random() * 8 + 3;
    arr.push({ open, close, high, low, up: close < open });
    price = close;
  }
  return arr;
}

function generateLine(n) {
  let y = 165;
  const points = [];
  for (let i = 0; i < n; i++) {
    y += (Math.random() - 0.52) * 10;
    y = Math.max(35, Math.min(205, y));
    const x = (i * 600) / (n - 1);
    points.push([x, y]);
  }
  const line = points
    .map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`))
    .join(" ");
  const area = `${line} L 600 240 L 0 240 Z`;
  return { line, area };
}
