import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma"
import ShopClientLayout from "./ShopClientLayout"

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const categories = await prisma.category.findMany({ orderBy: { createdAt: 'asc' }})
  const shopContent = await prisma.pageContent.findUnique({ where: { pageSlug: 'shop' }})
  const parsedShopData = JSON.parse(shopContent?.content || "{}")
  const shopData = {
    ...parsedShopData,
    bgImage: parsedShopData.bgImage ?? parsedShopData.backgroundImage ?? "",
  }

  return (
    <main className="relative min-h-screen bg-[#FFF8F5] text-black selection:bg-pinkCream/10">
      {/* Background Section */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        {shopData.bgImage ? (
          <div 
            className="fixed inset-0 z-0 bg-cover bg-center bg-fixed"
            style={{ 
              backgroundImage: `url(${shopData.bgImage})`,
              filter: 'brightness(0.9) contrast(1.1)' 
            }}
          >
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>
          </div>
        ) : (
          <>
            <div className="fixed top-0 left-1/4 w-[50vw] h-[50vw] bg-pinkCream/10 rounded-full blur-[150px] -translate-y-1/2 opacity-70"></div>
            <div className="fixed bottom-0 right-1/4 w-[40vw] h-[40vw] bg-iceBlue/10 rounded-full blur-[150px] translate-y-1/2 opacity-70"></div>
          </>
        )}
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 pt-40 pb-24 px-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-24">
          <span className="text-pinkCream tracking-widest uppercase font-poppins font-semibold text-sm mb-4 block">
            The Collection
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-outfit font-black text-black/90 drop-shadow-2xl tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            Order <span className="text-transparent bg-clip-text bg-gradient-to-r from-pinkCream via-[#E91E63] to-iceBlue">Masterpieces</span>
          </h1>
          <p className="text-lg md:text-xl font-poppins text-black/60 max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 fill-mode-both">
            Explore our futuristic realm of taste, select your category, and order directly to your door.
          </p>
        </div>

        {/* Categories Grid (Client Mount for Motion Stagger mapping) */}
        <ShopClientLayout categories={categories} />

      </div>
      
      {/* Dark matching footer divider */}
      <div className="w-full border-t border-white/5 relative z-10">
        <Footer />
      </div>
    </main>
  );
}
