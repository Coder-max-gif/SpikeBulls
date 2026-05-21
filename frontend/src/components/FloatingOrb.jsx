import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function FloatingOrb({ size = 400, color1 = "#60A5FA", color2 = "#A78BFA" }) {
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

  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      z: Math.random() * 100 - 50,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 0.5 + 0.1,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex items-center justify-center"
      style={{ width: size, height: size, perspective: 1000 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color1}40, ${color2}30, transparent 70%)`,
          filter: "blur(40px)",
          x: useTransform(mouseX, (val) => val * 0.3),
          y: useTransform(mouseY, (val) => val * 0.3),
        }}
      />

      <motion.div
        className="relative"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          transformStyle: "preserve-3d",
          x: useTransform(mouseX, (val) => val * 0.1),
          y: useTransform(mouseY, (val) => val * 0.1),
        }}
        animate={{
          rotateX: [0, 10, 0],
          rotateY: [0, 360],
        }}
        transition={{
          rotateY: { duration: 40, repeat: Infinity, ease: "linear" },
          rotateX: { duration: 12, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {particles.map((p, i) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: i % 2 === 0 ? color1 : color2,
              boxShadow: `0 0 ${p.size * 3}px ${i % 2 === 0 ? color1 : color2}`,
              left: "50%",
              top: "50%",
            }}
            animate={{
              x: [p.x, p.x + 20, p.x],
              y: [p.y, p.y - 30, p.y],
              z: [p.z, p.z + 40, p.z],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + p.delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}

        <div
          className="absolute inset-0 rounded-full border"
          style={{
            borderColor: `${color1}40`,
            background: `radial-gradient(circle at 30% 30%, ${color1}20, ${color2}15, transparent 60%)`,
            transform: "rotateX(60deg)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full border"
          style={{
            borderColor: `${color2}40`,
            transform: "rotateY(60deg)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full border"
          style={{
            borderColor: `${color1}30`,
            transform: "rotateX(30deg) rotateY(30deg)",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{
          borderColor: `${color1}20`,
          borderStyle: "dashed",
          x: useTransform(mouseX, (val) => val * 0.05),
          y: useTransform(mouseY, (val) => val * 0.05),
        }}
        animate={{
          rotateZ: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
