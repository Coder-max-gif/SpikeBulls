import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// A 3D-feel glowing wireframe cube built with pure CSS transforms
export default function GlowCube({ size = 220 }) {
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    x.set(e.clientX - rect.left - centerX);
    y.set(e.clientY - rect.top - centerY);
  };

  const s = size;
  const faceStyle = {
    position: "absolute",
    width: s,
    height: s,
    border: "1px solid rgba(96, 165, 250, 0.45)",
    background:
      "linear-gradient(135deg, rgba(59,130,246,0.10), rgba(139,92,246,0.10))",
    boxShadow:
      "0 0 24px rgba(96,165,250,0.25), inset 0 0 24px rgba(139,92,246,0.18)",
    backdropFilter: "blur(6px)",
  };
  const half = s / 2;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative"
      style={{
        width: s,
        height: s,
        perspective: 1200,
      }}
    >
      <motion.div
        className="relative"
        style={{
          width: s,
          height: s,
          transformStyle: "preserve-3d",
          x: useTransform(mouseX, (val) => val * 0.1),
          y: useTransform(mouseY, (val) => val * 0.1),
        }}
        animate={{ rotateX: [18, 22, 18], rotateY: [0, 360] }}
        transition={{
          rotateY: { duration: 28, repeat: Infinity, ease: "linear" },
          rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {/* faces */}
        <div style={{ ...faceStyle, transform: `translateZ(${half}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${half}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${half}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${half}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${half}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${half}px)` }} />
      </motion.div>

      {/* outer glow */}
      <motion.div
        className="absolute inset-0 -z-10 animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle at center, rgba(96,165,250,0.45), rgba(139,92,246,0.25) 35%, transparent 70%)",
          filter: "blur(30px)",
          x: useTransform(mouseX, (val) => val * 0.05),
          y: useTransform(mouseY, (val) => val * 0.05),
        }}
      />
    </div>
  );
}
