"use client"
import { motion } from "framer-motion"
import { MapPin, Clock, Navigation } from "lucide-react"
import Image from "next/image"

type Store = {
  id: string
  name: string
  address: string
  timing: string
  image: string | null
  mapsLink: string | null
}

export default function StoresSlider({ stores }: { stores: Store[] }) {
  if (!stores || stores.length === 0) return null

  return (
    <div className="w-full">
      <div className="flex overflow-x-auto no-scrollbar gap-6 px-6 sm:px-12 pb-12 snap-x snap-mandatory">
        {stores.map((store, i) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="relative shrink-0 w-[85vw] sm:w-[350px] md:w-[400px] h-[480px] sm:h-[500px] rounded-[2.5rem] overflow-hidden group bg-white shadow-2xl snap-center"
          >
            {/* Background Image */}
            {store.image ? (
              <Image 
                src={store.image} 
                alt={store.name} 
                fill 
                className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-blue-50 flex items-center justify-center">
                 <MapPin className="w-12 h-12 text-pinkCream/20" />
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

            {/* Content Container */}
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                
                {/* Timing Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 scale-90 origin-left">
                  <Clock className="w-3.5 h-3.5 text-pink-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">{store.timing}</span>
                </div>

                {/* Store Name & Address */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-outfit font-black text-white mb-2 leading-tight">
                  {store.name}
                </h3>
                <div className="flex gap-2 mb-8">
                  <MapPin className="w-4 h-4 text-pinkCream shrink-0 mt-1" />
                  <p className="text-white/70 font-poppins text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {store.address}
                  </p>
                </div>

                {/* Direction Button */}
                {store.mapsLink && (
                  <motion.a
                    href={store.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-white text-black font-outfit font-bold text-base shadow-xl transition-all"
                  >
                    <Navigation className="w-5 h-5 fill-black" />
                    Click for Direction
                  </motion.a>
                )}
              </div>
            </div>

            {/* Decorative Corner Element */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 backdrop-blur-xl -mr-12 -mt-12 rounded-full border border-white/20 transition-transform duration-700 group-hover:scale-150"></div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
