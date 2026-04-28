"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { IceCreamProduct, CategoryData } from "@/data/productsData";
import { useCart } from "@/components/CartContext";
import Footer from "@/components/Footer";

// Create a component for individual product cards to manage their own quantity/size state cleanly
function ProductCard({ product, themeColor, categoryTitle, categoryImage }: { product: any, themeColor: string, categoryTitle: string, categoryImage: string }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.prices?.[0]?.size || "Standard");
  const [quantity, setQuantity] = useState(1);

  const currentPriceObj = product.prices.find((p: any) => p.size === selectedSize) || product.prices[0] || { size: "Standard", price: 0 };

  const productImage = (product.images && product.images.length > 0) 
    ? product.images[0] 
    : (categoryImage?.startsWith('/') ? categoryImage : `/categories/${categoryImage}`);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      category: categoryTitle,
      size: selectedSize,
      price: currentPriceObj.price,
      quantity: quantity,
      image: productImage
    });
    setQuantity(1);
  };

  // Get button background color as a plain hex string — always rendered via inline style
  // so Tailwind's build step never strips it.
  const getButtonColor = (): string => {
    const title = categoryTitle.toLowerCase();
    if (title.includes('chocolate')) return '#6D4C41';
    if (title.includes('fruit'))     return '#E91E63';
    if (title.includes('ayurved'))   return '#2E7D32';
    if (title.includes('signature')) return '#E91E63';
    return '#E91E63'; // Default brand PinkCream
  };

  const buttonBgColor = getButtonColor();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-black/5 rounded-2xl overflow-hidden group hover:shadow-xl transition-all flex flex-col h-full"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <Image 
          src={productImage} 
          alt={product.name} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        {/* Price Tag Overlay */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg border border-black/5 shadow-sm">
          <p className="text-black font-outfit font-bold text-sm">₹{currentPriceObj.price}</p>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base md:text-lg font-outfit font-bold text-black/90 mb-2 line-clamp-1">{product.name}</h3>
        
        {product.description && (
          <p className="text-xs text-black/50 font-poppins mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        
        {/* Size Selection */}
        <div className="mb-4">
          <select 
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full bg-neutral-50 border border-black/10 rounded-lg px-2 py-1.5 text-xs text-black outline-none focus:ring-1 focus:ring-pink-400/30"
          >
            {product.prices.map((p: any) => (
              <option key={p.size} value={p.size}>{p.size} - ₹{p.price}</option>
            ))}
          </select>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between bg-neutral-100 rounded-xl border border-black/5 p-1">
             <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-black/40 hover:bg-black/5 hover:text-black font-bold">-</button>
             <span className="text-xs font-bold text-black/80 px-2">{quantity}</span>
             <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-black/40 hover:bg-black/5 hover:text-black font-bold">+</button>
          </div>
          
          {/* Add to Cart — color applied via inline style, never purged by Tailwind build */}
          <button 
            onClick={handleAddToCart}
            style={{ backgroundColor: buttonBgColor, color: '#ffffff' }}
            className="w-full py-3.5 rounded-xl font-outfit font-bold text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function CategoryClient({ categoryData, recommended = [] }: { categoryData: any, recommended?: any[] }) {
  return (
    <main className="relative min-h-screen bg-[#FFF8F5] text-black selection:bg-pink-500/10">
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        {categoryData.bgImage ? (
          <div 
            className="fixed inset-0 z-0 bg-cover bg-center bg-fixed"
            style={{ 
              backgroundImage: `url(${categoryData.bgImage?.startsWith('/') ? categoryData.bgImage : `/categories/${categoryData.bgImage}`})`,
              filter: 'brightness(0.9) contrast(1.1)' 
            }}
          >
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>
          </div>
        ) : (
          <div className="fixed top-0 left-1/4 w-[50vw] h-[50vw] bg-pink-500/5 rounded-full blur-[150px] -translate-y-1/2 opacity-20"></div>
        )}
      </div>

      <div className="relative z-10 pt-28 pb-24 px-4 max-w-7xl mx-auto">
        <Link href="/shop" className="inline-flex items-center gap-2 text-black/40 hover:text-black font-poppins text-xs mb-8 transition-colors">
          <span>←</span> BROWSE CATEGORIES
        </Link>
        
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-center mb-12 bg-white/60 p-6 rounded-[2rem] border border-black/5 backdrop-blur-md shadow-sm">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-xl bg-white shrink-0 border border-black/5">
            <Image src={categoryData.img?.startsWith('/') ? categoryData.img : `/categories/${categoryData.img}`} alt={categoryData.title} fill className="object-cover" />
          </div>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl md:text-5xl font-outfit font-black text-black/90 mb-2 uppercase tracking-tight">
              {categoryData.title}
            </h1>
            <p className="text-black/50 font-poppins text-sm md:text-base max-w-2xl">
              {categoryData.desc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categoryData.products.length === 0 ? (
             <div className="col-span-full text-center text-black/40 italic py-12">No items currently stocked in this category.</div>
          ) : (
             categoryData.products.map((product: any) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  themeColor={categoryData.themeColor} 
                  categoryTitle={categoryData.title}
                  categoryImage={categoryData.img}
                />
             ))
          )}
        </div>

        {/* Recommended Upsell Injection */}
        {recommended && recommended.length > 0 && (
           <div className="mt-24 pt-16 border-t border-black/5 relative">
              <span className="text-pinkCream tracking-widest uppercase font-poppins font-bold text-xs mb-3 block text-center md:text-left">
                Chef's Specials
              </span>
              <h2 className="text-3xl md:text-4xl font-outfit font-black text-black/95 mb-10 text-center md:text-left">
                Recommended Pairings
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {recommended.map((prod: any) => (
                  <ProductCard 
                    key={`rec-${prod.id}`} 
                    product={prod} 
                    themeColor="bg-orange-500 hover:bg-orange-400" 
                    categoryTitle={prod.categoryTitle}
                    categoryImage={prod.categoryImage}
                  />
                ))}
              </div>
           </div>
        )}

      </div>

      <div className="w-full border-t border-black/5 relative z-10">
        <Footer />
      </div>
    </main>
  );
}
