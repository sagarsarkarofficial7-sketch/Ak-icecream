"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function FloatingParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; type: 'drop' | 'leaf' | 'chunk' }[]>([]);

  useEffect(() => {
    // Generate organic ambient motion elements (drops, leaves, chunks)
    const generateParticles = () => {
      const newParticles = [];
      const types: ('drop' | 'leaf' | 'chunk')[] = ['drop', 'leaf', 'chunk', 'drop', 'drop']; // Skew towards drops
      for (let i = 0; i < 25; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100, // percentage x position
          y: Math.random() * 100, // percentage y position
          size: Math.random() * 8 + 4, // size between 4px and 12px
          duration: Math.random() * 25 + 15, // float duration 15-40s
          type: types[Math.floor(Math.random() * types.length)],
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40 mix-blend-overlay">
      {particles.map((p) => {
        let shapeClass = "rounded-full bg-white/70"; // default: milk drop
        if (p.type === 'leaf') shapeClass = "rounded-tl-full rounded-br-full bg-[#A5D6A7]/60"; // minty leaf shape
        if (p.type === 'chunk') shapeClass = "rounded-sm bg-[#5D4037]/40"; // chocolate chunk

        return (
          <motion.div
            key={p.id}
            className={`absolute ${shapeClass} backdrop-blur-sm`}
            style={{
              width: p.size,
              height: p.size * (p.type === 'drop' ? 1.2 : 1),
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [`0vh`, `-100vh`],
              x: [`0vw`, `${Math.random() * 20 - 10}vw`], 
              opacity: [0, 0.9, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        );
      })}
    </div>
  );
}
