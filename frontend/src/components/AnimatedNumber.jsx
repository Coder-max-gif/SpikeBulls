import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

// Parses a numeric value out of a label like "+184.2%" / "$1.8B" / "12,400+" / "42ms"
export default function AnimatedNumber({ value, duration = 1400 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    const match = String(value).match(/-?\d[\d,\.]*/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const numStr = match[0].replace(/,/g, "");
    const target = parseFloat(numStr);
    if (Number.isNaN(target)) {
      setDisplay(value);
      return;
    }
    const decimals = (numStr.split(".")[1] || "").length;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = target * eased;
      const formatted = formatNumber(current, decimals);
      setDisplay(String(value).replace(match[0], formatted));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

function formatNumber(n, decimals) {
  const fixed = n.toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart ? `${withCommas}.${decPart}` : withCommas;
}
