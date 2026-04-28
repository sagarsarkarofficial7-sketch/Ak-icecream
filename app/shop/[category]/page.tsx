import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma"
import CategoryClient from "./CategoryClient";

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const cat = await prisma.category.findUnique({
    where: { slug: params.category },
    include: { products: true }
  })

  if (!cat) {
    notFound();
  }

  const categoryData = {
    id: cat.slug,
    title: cat.title,
    desc: cat.description || "",
    img: cat.image || "",
    themeColor: cat.themeColor || "",
    bgImage: cat.bgImage || null,
    products: cat.products.map(p => {
      let parsedPrices = [];
      try { parsedPrices = JSON.parse(p.options || "[]"); } catch(e) {}
      
      let parsedImages = [];
      try { parsedImages = JSON.parse(p.images || "[]"); } catch(e) {}
      
      if (!parsedPrices || parsedPrices.length === 0) {
        parsedPrices = [{ size: "Standard", price: p.price || 0 }];
      }
      return {
        id: p.id,
        name: p.name,
        description: p.description || "",
        images: parsedImages,
        prices: parsedPrices
      };
    })
  };

  const recommendedRaw = await prisma.product.findMany({ 
    where: { isRecommended: true }, 
    take: 3, 
    include: { category: true } 
  });

  const recommendedProducts = recommendedRaw.map(p => {
    let parsedPrices = [];
    try { parsedPrices = JSON.parse(p.options || "[]"); } catch(e) {}
    
    let parsedImages = [];
    try { parsedImages = JSON.parse(p.images || "[]"); } catch(e) {}

    if (!parsedPrices || parsedPrices.length === 0) {
      parsedPrices = [{ size: "Standard", price: p.price || 0 }];
    }
    return {
      id: p.id,
      name: p.name,
      description: p.description || "",
      images: parsedImages,
      prices: parsedPrices,
      categoryTitle: p.category?.title || "AK Signature",
      categoryImage: p.category?.image || "Our Signature product catagory.png"
    };
  });

  return <CategoryClient categoryData={categoryData} recommended={recommendedProducts} />;
}
