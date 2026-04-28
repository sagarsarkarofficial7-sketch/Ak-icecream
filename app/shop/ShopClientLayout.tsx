"use client"
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ShopClientLayout({ categories }: { categories: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
      {categories.map((cat, i) => (
        <motion.div 
          key={cat.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + (i * 0.1), duration: 0.6, ease: "easeOut" }}
        >
          <Link href={`/shop/${cat.slug}`} className="group relative flex flex-col h-full rounded-[2.5rem] p-[1px] overflow-hidden bg-gradient-to-b from-black/5 to-black/10 shadow-xl hover:-translate-y-2 transition-all duration-500 block border border-black/5">
            <div className={`absolute inset-0 rounded-[2.5rem] bg-white backdrop-blur-xl z-0 transition-opacity duration-500 opacity-60 group-hover:opacity-100`}></div>
            
            <div className="relative z-10 flex flex-col h-full p-8">
              
              {/* Category Image */}
              <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-8 shadow-inner bg-neutral-100 flex items-center justify-center border border-black/5">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
                  {cat.image ? (
                    <Image 
                      src={cat.image?.startsWith('/') ? cat.image : `/categories/${cat.image}`}
                      alt={cat.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-black/20 font-bold font-outfit text-3xl uppercase tracking-widest px-8 text-center bg-neutral-200">
                       {cat.title}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-outfit font-black text-black/90 mb-3 tracking-wide group-hover:text-pinkCream transition-colors">
                    {cat.title}
                  </h2>
                  <p className="text-black/50 font-poppins text-sm leading-relaxed mb-8 group-hover:text-black/70 transition-colors">
                    {cat.description || "Explore our selection of premium ice creams."}
                  </p>
                </div>
                
                {/* Unified Premium Order Button */}
                <div className="w-full py-4 rounded-full font-poppins font-bold text-center text-white shadow-lg transition-all duration-300 bg-black hover:bg-pinkCream hover:shadow-pinkCream/50 hover:-translate-y-1">
                  Order Now
                </div>
              </div>

            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
