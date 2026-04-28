import { prisma } from "@/lib/prisma"
import StoresClient from "./StoresClient"

export const dynamic = 'force-dynamic'

export default async function AdminStoresPage() {
  const stores = await prisma.storeLocation.findMany({ 
    orderBy: { createdAt: 'asc' } 
  })

  // Format date/prisma objects for client components if needed
  const formattedStores = stores.map(s => ({
    id: s.id,
    name: s.name,
    address: s.address,
    timing: s.timing,
    image: s.image,
    mapsLink: s.mapsLink
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-outfit font-black text-white">Store Locations</h1>
        <p className="text-neutral-400 text-sm mt-1">Manage the physical stores displayed on the main homepage section.</p>
      </div>

      <StoresClient initialStores={formattedStores} />
    </div>
  )
}
