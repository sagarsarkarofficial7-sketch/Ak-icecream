"use client"
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function BlogClientLayout({ blogs }: { blogs: any[] }) {
  return (
    <main className="relative min-h-screen bg-[#FFF8F5]">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-[80vh] bg-gradient-to-b from-iceBlue/20 to-transparent z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-pinkCream/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/4"></div>
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-iceBlue/20 rounded-full blur-[120px] translate-x-1/4"></div>
      </div>

      <div className="relative z-10 pt-40 pb-24 px-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-pinkCream tracking-widest uppercase font-poppins font-semibold text-sm mb-4 block"
          >
            Insights & Stories
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-[80px] font-outfit font-black text-black/90 drop-shadow-sm tracking-tight mb-6"
          >
            The Sweet <span className="text-transparent bg-clip-text bg-gradient-to-r from-iceBlue to-blue-500">Chronicles</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl font-poppins text-black/60 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Dive deeper into the world of Aashutosh Kothi Ice Cream. From ingredient sourcing secrets to behind-the-scenes magic.
          </motion.p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {blogs.length === 0 ? (
             <div className="col-span-full py-20 text-center text-black/40 font-poppins italic">
                Our writers are brewing something special. Come back soon!
             </div>
          ) : blogs.map((post, i) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1), duration: 0.5, ease: "easeOut" }}
              className="group cursor-pointer"
            >
              <Link href={`/blog/${post.slug}`} className="block h-full">
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8 shadow-xl bg-black/5">
                  <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                    <Image 
                      src={post.coverImage || '/images/process-image.png'}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-4 text-black/50 font-poppins text-sm mb-4">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-3xl font-outfit font-bold text-black/90 mb-4 group-hover:text-pinkCream transition-colors duration-300 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-black/60 font-poppins leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt || post.content.substring(0, 150) + "..."}
                  </p>
                  
                  {/* Read More link */}
                  <div className="flex items-center gap-2 font-poppins font-semibold text-black/80 group-hover:text-iceBlue transition-colors duration-300">
                    Read Article 
                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
