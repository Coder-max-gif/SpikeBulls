import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

const CURRENCIES = ["EUR/USD", "GBP/USD", "USD/JPY", "XAU/USD", "USD/CAD", "AUD/USD", "USD/CHF", "NZD/USD"];
const INDICATORS = [
  { name: "RSI", base: 55, range: 20 },
  { name: "MACD", base: 0.004, range: 0.008 },
  { name: "ATR", base: 0.012, range: 0.006 },
  { name: "BB", base: 1.082, range: 0.02 },
  { name: "CCI", base: 75, range: 40 },
  { name: "MA", base: 1.085, range: 0.015 },
];

function RandomNumber({ min = 0, max = 1, decimals = 4, interval = 500, prefix = "", suffix = "", colorClass = "text-blue-600/70" }) {
  const [value, setValue] = useState((Math.random() * (max - min) + min).toFixed(decimals));

  useEffect(() => {
    const timer = setInterval(() => {
      setValue((Math.random() * (max - min) + min).toFixed(decimals));
    }, interval + Math.random() * 300);
    return () => clearInterval(timer);
  }, [min, max, decimals, interval]);

  return (
    <span className={`font-mono ${colorClass}`}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

function PriceTicker({ currency, basePrice = 1.08 }) {
  const [price, setPrice] = useState(basePrice.toFixed(4));
  const [isUp, setIsUp] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const change = (Math.random() - 0.5) * 0.002;
      const newPrice = (parseFloat(price) + change).toFixed(4);
      setPrice(newPrice);
      setIsUp(change > 0);
    }, 350 + Math.random() * 350);
    return () => clearInterval(timer);
  }, [price]);

  return (
    <div className="flex items-center gap-2 px-4 py-2 glass-strong/30 rounded-md border border-slate-200 text-[11px] sm:text-[13px]">
      <span className="font-mono text-violet-600/80">{currency}</span>
      <span className={`font-mono ${isUp ? "text-emerald-600/90" : "text-rose-600/90"}`}>
        {price}
      </span>
    </div>
  );
}

export default function QuantBackground() {
  const numberGrid = useMemo(() => {
    return Array.from({ length: 12 }, (_, col) =>
      Array.from({ length: 20 }, (_, row) => ({
        id: `${col}-${row}`,
        col,
        row,
        type: Math.random() > 0.5 ? "price" : "number",
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60 z-0">
      {/* Grid base */}
      <div className="absolute inset-0 grid-overlay" />

      {/* Number grid - rapidly changing numbers - bigger and more dense */}
      <div className="absolute inset-0 grid grid-cols-12 gap-3 p-2 sm:p-4">
        {numberGrid.map((column, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-3">
            {column.map((cell) => (
              <div
                key={cell.id}
                className="text-[11px] sm:text-[13px] text-right"
                style={{ opacity: 0.35 + Math.random() * 0.5 }}
              >
                {cell.type === "price" ? (
                  <RandomNumber
                    min={0.7}
                    max={1.5}
                    decimals={4}
                    interval={250 + Math.random() * 400}
                  />
                ) : (
                  <RandomNumber
                    min={-200}
                    max={200}
                    decimals={2}
                    interval={150 + Math.random() * 350}
                    colorClass="text-blue-600/70"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Top price stream - bigger */}
      <div className="absolute top-16 left-0 right-0 flex justify-around px-4 sm:px-8">
        {CURRENCIES.slice(0, 6).map((currency, i) => (
          <PriceTicker
            key={currency}
            currency={currency}
            basePrice={1.0 + i * 0.03}
          />
        ))}
      </div>

      {/* Bottom price stream - bigger */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-around px-4 sm:px-8">
        {CURRENCIES.slice(2).map((currency, i) => (
          <PriceTicker
            key={currency}
            currency={currency}
            basePrice={0.85 + i * 0.08}
          />
        ))}
      </div>

      {/* Middle indicator row - bigger */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-around px-4 sm:px-8">
        {INDICATORS.map((ind, i) => (
          <div
            key={ind.name}
            className="text-[11px] sm:text-[13px] font-mono text-slate-600/80 glass-strong/25 px-4 py-2 rounded-full border border-slate-200"
          >
            {ind.name}:{" "}
            <RandomNumber
              min={ind.base - ind.range}
              max={ind.base + ind.range}
              decimals={ind.name === "MACD" || ind.name === "ATR" || ind.name === "BB" || ind.name === "MA" ? 3 : 1}
              interval={350 + i * 80}
            />
          </div>
        ))}
      </div>

      {/* Floating big price tags - bigger and more of them */}
      {[
        { x: 5, y: 20, currency: "XAU/USD", base: 2345.50, size: "text-[16px] sm:text-[20px]" },
        { x: 85, y: 65, currency: "EUR/USD", base: 1.0842, size: "text-[15px] sm:text-[19px]" },
        { x: 8, y: 80, currency: "SPX", base: 5123.45, size: "text-[14px] sm:text-[18px]" },
        { x: 90, y: 20, currency: "BTC", base: 67890.12, size: "text-[17px] sm:text-[21px]" },
        { x: 4, y: 50, currency: "GBP/USD", base: 1.2650, size: "text-[13px] sm:text-[17px]" },
        { x: 95, y: 45, currency: "USD/JPY", base: 149.50, size: "text-[13px] sm:text-[17px]" },
      ].map((item, i) => (
        <motion.div
          key={i}
          className={`absolute font-mono ${item.size}`}
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
          animate={{
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="text-violet-600/70 mr-2">{item.currency}</span>
          <RandomNumber
            min={item.base - item.base * 0.015}
            max={item.base + item.base * 0.015}
            decimals={item.currency === "BTC" || item.currency === "SPX" || item.currency === "USD/JPY" ? 2 : 4}
            interval={400 + i * 150}
            colorClass="text-emerald-600/80"
          />
        </motion.div>
      ))}
    </div>
  );
}
