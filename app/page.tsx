"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Bell, Share, Sparkles, Store, Globe, BookOpen, Phone, MoreVertical, Instagram, MessageCircle } from "lucide-react";

export default function SplashPage() {
  const links = [
    { label: "Place Order", href: "/shop", icon: <Store className="w-5 h-5" />, color: "bg-[#E23744]" },
    { label: "Visit Website", href: "/home", icon: <Globe className="w-5 h-5 text-gray-700" />, color: "bg-white" },
    { label: "Read Blogs", href: "/blog", icon: <BookOpen className="w-5 h-5 text-gray-700" />, color: "bg-white" },
    { label: "Contact Us", href: "/contact", icon: <Phone className="w-5 h-5 text-gray-700" />, color: "bg-white" },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Aashutosh Kothi Ice Cream",
        url: window.location.href
      });
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#FDF9F6] via-[#F8EDE6] to-[#EBD5C8] flex flex-col items-center">
      
      {/* Abstract Background Blur Orbs to mimic the Reference image's soft lighting */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/60 blur-[100px] rounded-full"></div>
         <div className="absolute top-1/2 -right-32 w-96 h-96 bg-[#D7CCC8]/40 blur-[100px] rounded-full"></div>
         <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-t from-black/20 to-transparent blur-3xl"></div>
      </div>

      {/* Top Header Icons */}
      <div className="relative z-10 w-full max-w-lg px-6 py-6 flex justify-between items-center">
        <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center border border-white/40 hover:scale-105 transition-transform">
           <Sparkles className="w-5 h-5 text-black/80" />
        </button>
        <div className="flex items-center gap-3">
           <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center border border-white/40 hover:scale-105 transition-transform">
             <Bell className="w-5 h-5 text-black/80" />
           </button>
           <button onClick={handleShare} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center border border-white/40 hover:scale-105 transition-transform">
             <Share className="w-5 h-5 text-black/80" />
           </button>
        </div>
      </div>

      {/* Core Splash Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-lg px-6 pt-8 pb-32">
        
        {/* Brand Logo & Presentation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center mb-10"
        >
           <div className="w-28 h-28 rounded-full bg-white shadow-xl flex items-center justify-center mb-6 p-4 border border-white/50 relative overflow-hidden group">
              <Image src="/Logo.png" alt="AK IceCream Logo" fill className="object-contain p-2 group-hover:scale-110 transition-transform" priority />
           </div>
           
           <h1 className="text-2xl sm:text-3xl font-outfit font-black text-black/90 tracking-tight mb-3">
             Aashutosh Kothi Ice Cream
           </h1>
           <p className="text-black/70 font-poppins text-sm leading-relaxed max-w-[280px] font-medium mx-auto">
             The Taste of Satisfaction! Real Ingredients. Real Milk. No usage of any Artificial Preservatives!
           </p>

           {/* Social Icon Row */}
           <div className="flex items-center gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full border-2 border-black/80 flex items-center justify-center hover:bg-black/80 hover:text-white transition-colors duration-300">
                 <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border-2 border-black/80 flex items-center justify-center hover:bg-black/80 hover:text-white transition-colors duration-300">
                 <MessageCircle className="w-5 h-5" />
              </a>
           </div>
        </motion.div>

        {/* Linktree Button Stack */}
        <div className="flex flex-col gap-4 w-full">
          {links.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
            >
              <Link 
                href={link.href}
                className="group relative flex items-center justify-between w-full p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Left side Graphic/Icon Box */}
                <div className={"w-12 h-12 rounded-xl flex items-center justify-center shadow-inner " + link.color + " shrink-0"}>
                  {link.label === "Place Order" ? (
                     <div className="text-white font-black text-xs tracking-tighter">ORDER</div>
                  ) : (
                     link.icon
                  )}
                </div>

                {/* Center Title */}
                <span className="flex-1 text-center font-poppins font-semibold text-black/80 text-[15px]">
                  {link.label}
                </span>

                {/* Right Side Dots (as per reference) */}
                <div className="w-10 flex items-center justify-end shrink-0">
                  <MoreVertical className="w-5 h-5 text-black/30 group-hover:text-black/60 transition-colors" />
                </div>
                
                {/* Dynamic Gradient Overlay on Hover */}
                {link.label === "Place Order" && (
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E23744]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

      </div>

    </main>
  );
}
