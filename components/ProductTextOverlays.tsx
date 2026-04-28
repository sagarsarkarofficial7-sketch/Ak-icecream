"use client"
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { Product } from "@/data/products";

export default function ProductTextOverlays({ product }: { product: Product }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Slide 1: Hero Section (Visible from 0 to 0.2)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.25], [1, 1, 0, 0]);
  const leftX = useTransform(scrollYProgress, [0, 0.15], [0, -100]);
  const rightX = useTransform(scrollYProgress, [0, 0.15], [0, 100]);

  // Slide 3: Final CTA / Conclusion (Visible from 0.7 to 1.0)
  const ctaOpacity = useTransform(scrollYProgress, [0.65, 0.75, 1, 1], [0, 1, 1, 1]);
  const ctaY = useTransform(scrollYProgress, [0.65, 0.75], [100, 0]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden z-10 px-6">

        {/* Slide 1: 3-Column Hero */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between items-center max-w-7xl mx-auto px-4 md:px-12 w-full"
        >
          {/* Left: Text Hierarchy */}
          <motion.div style={{ x: leftX }} className="flex-1 max-w-sm">
            <div className="backdrop-blur-md bg-white/20 border border-white/30 p-6 md:p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
              <span
                className="block text-sm sm:text-base md:text-lg font-poppins font-semibold tracking-widest uppercase mb-3 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]"
                style={{ color: product.themeColor }}
              >
                Introducing
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-[72px] font-outfit font-black text-black/90 drop-shadow-lg leading-[1.1] tracking-tight">
                {product.name}
              </h1>
              <p className="mt-2 md:mt-4 text-lg sm:text-2xl md:text-[30px] font-poppins font-light text-black/80 drop-shadow-sm leading-snug">
                {product.subName}
              </p>
            </div>
          </motion.div>

          {/* Center: Open Space for the Canvas Product */}
          <div className="flex-1 hidden lg:block"></div>

          {/* Right: Ingredient Visuals / Features */}
          <motion.div style={{ x: rightX }} className="flex-1 max-w-sm hidden md:flex flex-col items-end gap-6">
            {product.features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-4 backdrop-blur-md bg-white/20 border border-white/30 p-4 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] w-max"
              >
                <div
                  className="w-10 h-10 rounded-full shadow-inner flex items-center justify-center font-outfit font-bold text-white text-lg"
                  style={{ backgroundColor: product.themeColor }}
                >
                  {i + 1}
                </div>
                <span className="font-poppins text-xl font-medium text-black/80 pr-4">
                  {feature}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Slide 3: Final CTA */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute bottom-24 md:bottom-32 flex flex-col items-center justify-center pointer-events-auto px-4 w-full"
        >
          <div className="backdrop-blur-md bg-white/20 border border-white/30 p-8 md:p-16 rounded-[3rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] text-center w-full max-w-4xl">
            <h2 className="text-4xl sm:text-5xl md:text-[64px] font-outfit font-black text-black/90 mb-8 md:mb-12 leading-tight drop-shadow-md">
              Ready to taste <span style={{ color: product.themeColor }}>perfection?</span>
            </h2>
            <button
              className="px-8 py-4 sm:px-12 sm:py-5 rounded-full text-white text-lg sm:text-xl md:text-2xl font-poppins font-bold shadow-2xl hover:scale-105 transition-transform duration-300"
              style={{ backgroundColor: product.themeColor, boxShadow: `0 20px 40px -10px ${product.themeColor}80` }}
            >
              Order {product.name} Now
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
