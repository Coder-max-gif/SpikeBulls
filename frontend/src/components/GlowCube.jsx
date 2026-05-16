import React from "react";
import { motion } from "framer-motion";

// A 3D-feel glowing wireframe cube built with pure CSS transforms
export default function GlowCube({ size = 220 }) {
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
      <div
        className="absolute inset-0 -z-10 animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle at center, rgba(96,165,250,0.45), rgba(139,92,246,0.25) 35%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}
