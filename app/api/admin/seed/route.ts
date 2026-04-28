import { prisma } from "@/lib/prisma"
import { products } from "@/data/products"
import { productCategories } from "@/data/productsData"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log('Seeding data...')
    
    // Clear existing
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.heroFlavor.deleteMany()

    // Seed Hero Flavors
    for (const p of products) {
      await prisma.heroFlavor.create({
        data: {
          slug: p.id,
          name: p.name,
          subName: p.subName,
          description: p.description,
          folderPath: p.folderPath,
          themeColor: p.themeColor,
          gradient: p.gradient,
          features: JSON.stringify(p.features),
          totalFrames: p.totalFrames
        }
      })
    }

    // Seed Categories & Products
    for (const cat of productCategories) {
      const createdCat = await prisma.category.create({
        data: {
          slug: cat.id,
          title: cat.title,
          description: cat.desc,
          image: cat.img,
          themeColor: cat.themeColor,
          bgImage: cat.bgImage ?? null
        }
      })

      for (const prod of cat.products) {
        await prisma.product.create({
          data: {
            name: prod.name,
            categoryId: createdCat.id,
            price: prod.prices[0]?.price || 0,
            options: JSON.stringify(prod.prices),
          }
        })
      }
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully!" })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
