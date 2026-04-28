"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Banner {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export default function HomeBannerCarousel({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  return (
    <section className="relative w-full py-12 px-6 bg-[#FFF8F5]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-outfit font-black text-black/90 mb-10 ml-2">
          The season's best scoop
        </h2>
        
        <div className="relative aspect-[4/5] md:aspect-[25/9] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-neutral-200">
          <AnimatePresence mode="wait">
            <motion.div
              key={banners[current].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Image 
                src={banners[current].image || "/images/placeholder-banner.png"} 
                alt={banners[current].title} 
                fill 
                className="object-cover"
                priority
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex flex-col justify-center px-6 md:px-20">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl md:text-5xl lg:text-6xl font-outfit font-black text-white mb-3 md:mb-4 leading-tight max-w-[240px] md:max-w-2xl"
                >
                  {banners[current].title}
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm md:text-xl text-white/90 font-poppins font-light mb-6 md:mb-8 max-w-[260px] md:max-w-md"
                >
                  {banners[current].description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link 
                    href={banners[current].buttonLink || "/shop"} 
                    className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-outfit font-bold text-sm md:text-base hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 group"
                  >
                    {banners[current].buttonText}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="absolute bottom-6 left-0 w-full flex justify-center gap-3">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${idx === current ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
