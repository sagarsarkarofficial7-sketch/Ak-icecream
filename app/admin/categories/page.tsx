import { prisma } from "@/lib/prisma"
import CategoriesClient from "./CategoriesClient"

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ 
    orderBy: { createdAt: 'asc' } 
  })

  // Ensure plain objects for the client component
  const plainCategories = JSON.parse(JSON.stringify(categories))

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
            Category Manager
          </h1>
          <p className="text-neutral-500 text-sm mt-1 max-w-md">
            Manage your product collections, promotional artwork, and dynamic page backgrounds from one place.
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">API Powered</span>
        </div>
      </div>

      <CategoriesClient initialCategories={plainCategories} />
    </div>
  )
}
