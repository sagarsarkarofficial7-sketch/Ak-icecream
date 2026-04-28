"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";

const menuLinks = [
  { label: "Home",    href: "/home" },
  { label: "Shop",    href: "/shop" },
  { label: "Blog",    href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-3 flex justify-between items-center bg-transparent">
        {/* Logo */}
        <Link href="/home" className="flex items-center group">
          <Image
            src="/Logo.png"
            alt="Aashutosh Kothi Ice Cream Logo"
            width={120}
            height={120}
            className="group-hover:scale-105 transition-transform drop-shadow-md w-[120px] h-auto"
            priority
          />
        </Link>

        {/* Right side controls: Cart + Menu */}
        <div className="flex items-center gap-4">
          
          {/* View Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:bg-black/80 transition-all shadow-lg"
            aria-label="View Cart"
          >
            <span className="text-white text-xl group-hover:scale-110 transition-transform">🛒</span>
            
            {/* Cart Badge */}
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-pinkCream text-black font-poppins font-black text-xs rounded-full flex items-center justify-center shadow-md border border-white"
                >
                  {cartCount}
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="relative flex items-center gap-2 px-6 py-2.5 rounded-full font-poppins text-sm font-semibold text-white border border-white/20 bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all duration-300 shadow-lg"
            aria-label="Toggle menu"
          >
            {/* Animated hamburger icon */}
            <span className="flex flex-col gap-[5px] w-5">
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className="block h-[2px] w-full bg-white rounded-full origin-center"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="block h-[2px] w-full bg-white rounded-full"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className="block h-[2px] w-full bg-white rounded-full origin-center"
              />
            </span>
            <span>Menu</span>
          </button>

        </div>
      </nav>

      {/* Full-screen dropdown overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl"
            onClick={() => setMenuOpen(false)}
          >
            <nav className="flex flex-col items-center gap-10" onClick={(e) => e.stopPropagation()}>
              {menuLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.07, duration: 0.35, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-5xl md:text-7xl font-outfit font-black text-white hover:text-pinkCream transition-colors duration-300 tracking-tight"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Close hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-10 text-white/40 font-poppins text-sm"
            >
              Click anywhere to close
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
