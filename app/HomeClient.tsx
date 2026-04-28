"use client";

import { useEffect, useRef, useState } from "react";

// Dynamic prop from Server Component
// Removed static import
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductBottleScroll from "@/components/ProductBottleScroll";
import ProductTextOverlays from "@/components/ProductTextOverlays";
import ConeTextOverlays from "@/components/ConeTextOverlays";
import MasterpieceGallery from "@/components/MasterpieceGallery";
import FloatingParticles from "@/components/FloatingParticles";
import Image from "next/image";
import FAQSection from "@/components/FAQSection";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bike, ShoppingBag } from "lucide-react";
import HomeBannerCarousel from "@/components/HomeBannerCarousel";
import StoresSlider from "@/components/StoresSlider";

export default function HomeClient({ initialProducts, stores, posts, categories = [] }: { initialProducts: any[], stores: any[], posts: any[], categories: any[] }) {
  // Point 1: Keep only the Orange product
  const products = initialProducts.filter(p => p.name.toLowerCase().includes("orange"));
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  // Track scroll progress of the newly added Masterpieces section
  const shopRef = useRef<HTMLElement>(null);
  const { scrollYProgress: shopProgress } = useScroll({
    target: shopRef,
    offset: ["start end", "end start"] // track while in viewport
  });

  // Parallax physics for Masterpieces section
  const glowY1 = useTransform(shopProgress, [0, 1], [-50, 200]);
  const glowY2 = useTransform(shopProgress, [0, 1], [100, -150]);
  const cardsY = useTransform(shopProgress, [0, 1], [50, -50]);

  // Fade out the flavour nav as the hero scroll ends (last 12% of hero)
  const navOpacity = useTransform(heroProgress, [0.88, 1], [1, 0]);
  const navPointerEvents = useTransform(heroProgress, [0.88, 1], ["auto", "none"]);
  
  const currentProduct = products[currentIndex] || {
    id: "empty-state",
    name: "Setup Required",
    subName: "Database Connected",
    themeColor: "#FF9A9E",
    gradient: "linear-gradient(135deg, #FFF8F5 0%, #FFE0B2 100%)",
    folderPath: "",
    totalFrames: 0,
    features: [],
    title1: "DATABASE",
    title2: "CONNECTED",
    description: "Welcome to your new Supabase Cloud Database! Please login to /admin to construct your first hero flavours!"
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const [homeData, setHomeData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/content?slug=home')
      .then(r => r.json())
      .then(data => {
        if (data.content && data.content !== "{}") {
          setHomeData(JSON.parse(data.content));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <main className="relative min-h-screen">
      <FloatingParticles />
      <Navbar />

      {/* Main Scrollytelling Section */}
      <section ref={heroRef} className="relative w-full transition-colors duration-1000" id="flavours" style={{ background: currentProduct.gradient }}>
        <div key={`scroll-${currentIndex}`} className="relative">
          {/* Point 1: Added mobileFolder for Orange section with correct naming convention */}
          <ProductBottleScroll 
            productFolder={currentProduct.folderPath} 
            mobileFolder="/images/Orange_Hero_mobile-view"
            mobileFilenamePrefix="ezgif-frame-"
            mobileZeroPad={3}
            totalFrames={currentProduct.totalFrames} 
            extension="jpg" 
          />
          <ProductTextOverlays product={currentProduct} />
        </div>
      </section>

      {/* Navigation Controls (Fixed Bottom) - Hide if only 1 flavour */}
      {products.length > 1 && (
        <motion.div
          style={{ opacity: navOpacity, pointerEvents: navPointerEvents as any }}
          className="fixed bottom-2 md:bottom-4 left-0 w-full z-40 flex flex-col items-center gap-4 md:gap-6"
        >
          {/* Pill Selectors */}
          <div className="w-full px-4 overflow-x-auto no-scrollbar pb-4 -mb-4 flex justify-start md:justify-center snap-x snap-mandatory [mask-image:linear-gradient(to_right,white_85%,transparent_100%)] md:[mask-image:none]">
            <div className="glass-dark px-2 py-2 rounded-[2rem] flex gap-3 w-max shadow-2xl border border-white/5 pr-8 md:pr-2">
              {products.map((p, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={p.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative flex items-center gap-3 px-5 py-3 rounded-full font-poppins text-xs md:text-sm font-semibold transition-all duration-500 overflow-hidden group ${isActive
                      ? "text-black bg-white shadow-lg scale-105"
                      : "text-white/60 hover:text-white bg-transparent hover:bg-white/10"
                      }`}
                  >
                    {isActive && (
                      <div
                        className="absolute inset-0 opacity-10 transition-opacity"
                        style={{ backgroundColor: p.themeColor }}
                      />
                    )}
                    <div
                      className={`w-3 h-3 rounded-full shadow-sm transition-transform duration-500 ${isActive ? 'scale-110 shadow-md' : 'scale-90 group-hover:scale-100'}`}
                      style={{ backgroundColor: p.themeColor }}
                    />
                    <span className="relative z-10 whitespace-nowrap snap-center">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Detailed Landing Page Sections */}
      <div className="relative z-10 bg-[#FFF8F5]">

        {/* Section 1: Futuristic Product Categories */}
        <MasterpieceGallery categories={categories} />

        {/* Point 2: Updated Cone section to use single image from /images/Cone */}
        <section className="relative w-full h-[400vh] bg-[#FFF8F5]" id="cone-scroll">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
            <div className="relative w-[90%] md:w-[80%] h-[70vh] md:h-[80vh] rounded-[3rem] overflow-hidden shadow-2xl bg-white/50">
              <Image 
                src="/images/Cone/cone-main.jpg" 
                alt="Our Signature Cone" 
                fill 
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 80vw"
                quality={90}
              />
            </div>
          </div>
          <ConeTextOverlays />
        </section>

        {/* Section 2: Why Choose Us */}
        <section className="py-24 bg-gradient-to-br from-[#FFF8F5] to-[#FFECB3]/30">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-pinkCream font-poppins font-semibold uppercase tracking-widest text-sm mb-4 block">The Process</span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-outfit font-black text-black/90 mb-8 leading-tight">
                Premium Ingredients.<br />Unforgettable Taste.
              </h2>
              <ul className="space-y-6">
                {[
                  { title: "Fresh Pure Milk", desc: "Sourced locally every morning for that rich, creamy baseline." },
                  { title: "Handcrafted Batches", desc: "No mass production. We churn in small batches to preserve texture." },
                  { title: "0% Artificial Preservatives", desc: "Real fruit, real nuts, real chocolate. Nothing fake." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-6">
                    <div className="w-12 h-12 rounded-full bg-pinkCream/10 flex-shrink-0 flex items-center justify-center text-pinkCream font-outfit font-bold text-xl">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-outfit font-bold text-black/80 mb-1">{item.title}</h4>
                      <p className="text-black/60 font-poppins leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl flex items-center justify-center p-0">
              <Image 
                src={homeData?.processImage || "/images/process-image.png"} 
                alt="Miniature chefs handcrafting ice cream" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Section 2.5: Season's Best Scoop Banner Carousel */}
        {homeData?.banners && homeData.banners.length > 0 && (
          <HomeBannerCarousel banners={homeData.banners} />
        )}

        {/* Section 3.5: Order Online Delivery */}
        <section className="relative py-24 px-6 overflow-hidden border-t border-b border-black/5">
          {homeData?.orderBg && (
            <div className="absolute inset-0 z-0">
               <Image src={homeData.orderBg} alt="Order Background" fill className="object-cover opacity-40" />
               <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>
            </div>
          )}
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-outfit font-black text-black/90 mb-6 font-outfit">Craving a Scoop Right Now?</h2>
            <p className="text-lg md:text-xl text-black/60 font-poppins mb-12">
              Order directly to your doorstep through our official delivery partners.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <a 
                href={homeData?.zomatoLink || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-64 py-4 rounded-2xl bg-[#E23744] hover:bg-[#Cb202d] text-white font-outfit font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                <ShoppingBag className="w-6 h-6" /> Zomato
              </a>
              <a 
                href={homeData?.swiggyLink || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-64 py-4 rounded-2xl bg-[#FC8019] hover:bg-[#E57317] text-white font-outfit font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                <Bike className="w-6 h-6" /> Swiggy
              </a>
            </div>
          </div>
        </section>

        {/* Section 3.6: FAQ Section */}
        {homeData?.faqs && homeData.faqs.length > 0 && (
          <FAQSection faqs={homeData.faqs} />
        )}

        {/* Section 4 & 5: Locations & Gallery */}
        <section id="contact" className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="glass p-6 md:p-12 rounded-[3rem]">
            <h2 className="text-4xl font-outfit font-black text-black/90 mb-8">Visit Our Stores</h2>
            <StoresSlider stores={stores} />
          </div>

          <div>
            <h2 className="text-4xl font-outfit font-black text-black/90 mb-8">@AKIceCream</h2>
            <div className="grid grid-cols-2 min-h-max gap-4 place-content-start">
              {posts.map((post) => (
                <div key={post.id} className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-inner flex items-center justify-center bg-neutral-100/50 hover:scale-[1.02] transition-transform duration-300">
                  <Image src={post.imageUrl} alt="Social Post" fill className="object-cover" />
                </div>
              ))}
              
              {Array.from({ length: Math.max(0, 4 - (posts?.length || 0)) }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square rounded-2xl bg-gradient-to-tr from-pinkCream/20 to-iceBlue/20 shadow-inner flex items-center justify-center text-black/10 font-outfit font-bold text-3xl">
                  Post { (posts?.length || 0) + i + 1}
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </main>
  );
}
