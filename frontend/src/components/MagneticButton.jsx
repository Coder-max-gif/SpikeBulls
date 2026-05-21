import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MagneticButton({ children, className = "", onClick, variant = "primary" }) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseClasses = variant === "primary" 
    ? "btn-primary" 
    : "btn-ghost";

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden ${baseClasses} ${className}`}
      animate={{
        x: position.x * 0.3,
        y: position.y * 0.3,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.span
        className="relative z-10 flex items-center gap-2 whitespace-nowrap"
        animate={{
          x: position.x * 0.6,
          y: position.y * 0.6,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.1 }}
      >
        {children}
      </motion.span>

      <motion.div
        className="absolute inset-0 opacity-0"
        animate={{
          opacity: [0, 0.15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeOut",
        }}
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 70%)",
        }}
      />
    </motion.button>
  );
}
