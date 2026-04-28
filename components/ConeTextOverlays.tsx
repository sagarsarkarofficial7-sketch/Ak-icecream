"use client"
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ConeTextOverlays() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the cone section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Start fading in even later (at 20% scroll) and finish by 40%
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 0, 1]);

  // Rise from the bottom even slower: start at 20%, finish at 50%, and stop significantly lower (y: 150)
  const textY = useTransform(scrollYProgress, [0, 0.2, 0.5, 1], [350, 350, 150, 150]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-10 px-6 md:px-16 lg:px-24">

        {/* Floating Text Box Overlay */}
        <motion.div
          style={{
            opacity: textOpacity,
            y: textY
          }}
          className="max-w-3xl text-center backdrop-blur-xl bg-white/20 border border-white/30 pt-8 pb-6 md:pt-10 md:pb-8 px-8 md:px-12 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] relative"
        >
          {/* Subtle accent glow behind the text box */}
          <div className="absolute inset-0 bg-gradient-to-br from-pinkCream/10 to-transparent rounded-[2.5rem] -z-10"></div>

          <span className="block text-sm md:text-base font-poppins font-semibold tracking-widest uppercase mb-4 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)] text-chocolateBrown">
            Premium Quality
          </span>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-outfit font-black text-black/90 drop-shadow-md leading-[1.1] tracking-tight mb-4">
            Real Ingredients<br className="hidden lg:block" /> in Every Scoop
          </h2>

          <p className="text-lg md:text-xl font-poppins font-light text-black/70 drop-shadow-sm leading-relaxed mb-2">
            We've scoured the globe to handpick premium ingredients for your delight—think cocoa all the way from Madagascar and strawberries straight from Mahabaleshwar. We go the distance to bring you the best.
          </p>

        </motion.div>

      </div>
    </div>
  );
}
