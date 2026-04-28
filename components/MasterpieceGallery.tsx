"use client"
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useLayoutEffect } from "react";
import Image from "next/image";

const fallbackCategories = [
  { title: "Pure Milk", desc: "Silky, unadulterated dairy bases sourced fresh daily.", img: "Pure Milk Product catagory.png" },
  { title: "Ayurved", desc: "Ancient healing herbs blended into futuristic frozen delights.", img: "Ayurved Product catagory.png" },
  { title: "Our Signature", desc: "The legendary AK Icecream classics that started it all.", img: "Our Signature product catagory.png" },
  { title: "Chocolate", desc: "Deep, rich cocoa imported for maximum decadence.", img: "Chocolate Product catagory.png" },
  { title: "Fruits", desc: "Real, vibrant fruits infused into creamy perfection.", img: "Fruits Product catagory.png" },
  { title: "Hot Brownie", desc: "Warm, molten chocolate fudge colliding with frozen ice cream.", img: "Hot Brownie catagory.png" }
];

export default function MasterpieceGallery({ categories = [] }: { categories?: any[] }) {
  const displayData = categories.length > 0 ? categories : fallbackCategories;
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  // Measure the total width of the horizontal track
  useLayoutEffect(() => {
    const updateRange = () => {
      if (trackRef.current) {
        // The distance we need to scroll is the total width of the track minus the viewport width.
        // This ensures the last item stops perfectly at the screen's right edge.
        setScrollRange(trackRef.current.scrollWidth - window.innerWidth);
      }
    };
    
    updateRange();
    window.addEventListener("resize", updateRange);
    return () => window.removeEventListener("resize", updateRange);
  }, []);
  
  // Track scroll position over a 300vh tall container to create a long horizontal scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Apply a smooth spring with inertia so the scroll never feels sudden or jittery
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // We dynamically translate the track negatively by the exact scroll range we calculated above.
  const x = useTransform(smoothProgress, [0, 1], [0, -scrollRange]);

  return (
    <section ref={containerRef} className="relative md:h-[400vh] bg-[#FFF8F5]">
      <div className="md:sticky top-0 md:h-screen w-full flex flex-col justify-center overflow-hidden py-12 md:py-24">
        
        {/* Background ambient glow matching the site's neon aesthetic */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-pinkCream/20 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 z-0"></div>
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-iceBlue/20 rounded-full blur-[150px] pointer-events-none translate-y-1/2 z-0"></div>

        {/* Gallery Header */}
        <div className="z-20 px-6 md:px-16 lg:px-32 mb-8 md:mb-12">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-pinkCream tracking-widest uppercase font-poppins font-semibold text-xs md:text-sm mb-2 md:mb-4 block"
          >
            Explore Perfection
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl lg:text-8xl font-outfit font-black text-black/90"
          >
            Our Masterpieces
          </motion.h2>
        </div>

        {/* Horizontal Scrolling Gallery Track */}
        <div className="md:hidden overflow-x-auto no-scrollbar flex gap-4 px-6 pb-8">
          {displayData.map((cat, i) => (
             <div 
               key={i} 
               className="relative shrink-0 w-[260px] h-[350px] rounded-[2rem] overflow-hidden bg-white/5 border border-white/10"
             >
               <Image 
                 src={cat.image?.startsWith('/') ? cat.image : `/categories/${cat.image || cat.img}`} 
                 alt={cat.title} 
                 fill 
                 className="object-cover opacity-80"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
               <div className="absolute bottom-0 left-0 p-6 w-full">
                 <h3 className="text-2xl font-outfit font-black text-white mb-2">{cat.title}</h3>
                 <p className="text-white/60 font-poppins text-xs line-clamp-2">{cat.description || cat.desc}</p>
               </div>
             </div>
          ))}
        </div>

        <motion.div 
          ref={trackRef}
          style={{ x }} 
          className="hidden md:flex gap-6 md:gap-12 items-center h-[50vh] md:h-[60vh] z-10 w-max pl-[10vw] pr-[10vw] md:pl-24 md:pr-24"
        >
          {displayData.map((cat, i) => (
            <div 
              key={i} 
              className="group relative shrink-0 w-[280px] sm:w-[350px] md:w-[450px] h-full rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
            >
              <Image 
                src={cat.image?.startsWith('/') ? cat.image : `/categories/${cat.image || cat.img}`} 
                alt={cat.title} 
                fill 
                className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col justify-end translate-y-6 group-hover:translate-y-0 transition-transform duration-[0.8s] ease-out">
                <div className="mb-2 w-12 h-1 bg-pink-500 rounded-full mb-6 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[0.8s] delay-100 ease-out"></div>
                <h3 className="text-3xl md:text-5xl font-outfit font-black text-white mb-3 text-shadow-sm">{cat.title}</h3>
                <p className="text-white/80 font-poppins text-sm md:text-base mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  {cat.description || cat.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
