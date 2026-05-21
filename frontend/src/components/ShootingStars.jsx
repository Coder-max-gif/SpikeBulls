import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function ShootingStars({ count = 12 }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 3 + Math.random() * 4,
      angle: 20 + Math.random() * 30,
      length: 50 + Math.random() * 100,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: Math.cos(star.angle * Math.PI / 180) * 300,
            y: Math.sin(star.angle * Math.PI / 180) * 300,
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "linear",
          }}
        >
          <div
            className="relative"
            style={{
              width: star.length,
              height: 2,
              background: "linear-gradient(to right, rgba(96,165,250,0), rgba(96,165,250,0.8), rgba(167,139,250,0.9))",
              transform: `rotate(-${star.angle}deg)`,
              boxShadow: "0 0 10px rgba(96,165,250,0.6), 0 0 20px rgba(167,139,250,0.4)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 4,
              height: 4,
              background: "#A78BFA",
              boxShadow: "0 0 10px #A78BFA, 0 0 20px #60A5FA",
              right: -2,
              top: -1,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
