import { prisma } from "@/lib/prisma"
import HomeClient from "../HomeClient"

export const dynamic = 'force-dynamic'

export default async function Page() {
  const flavors = await prisma.heroFlavor.findMany()
  const stores = await prisma.storeLocation.findMany({ orderBy: { createdAt: 'asc' } })
  const posts = await prisma.socialPost.findMany({ orderBy: { createdAt: 'asc' } })
  const categories = await prisma.category.findMany({ orderBy: { createdAt: 'asc' } })

  // Format the DB records to match the frontend expectations
  const parsedFlavors = flavors.map(f => ({
    id: f.slug,
    name: f.name,
    subName: f.subName,
    description: f.description,
    folderPath: f.folderPath,
    themeColor: f.themeColor,
    gradient: f.gradient,
    features: JSON.parse(f.features || "[]"),
    totalFrames: f.totalFrames
  }))

  // Auto-seed initial stores to match the user's previous hardcoded view seamlessly
  if (stores.length === 0) {
     await prisma.storeLocation.createMany({
       data: [
         { name: "Downtown Kothi", address: "123 Sweet Tooth Lane, Kothi District", timing: "10:00 AM - 11:30 PM" },
         { name: "Riverside Promenade", address: "45 River View Road, Kothi North", timing: "11:00 AM - 10:00 PM" }
       ]
     })
     const freshStores = await prisma.storeLocation.findMany({ orderBy: { createdAt: 'asc' } })
     return <HomeClient initialProducts={parsedFlavors} stores={freshStores} posts={posts} categories={categories} />
  }

  return <HomeClient initialProducts={parsedFlavors} stores={stores} posts={posts} categories={categories} />
}
