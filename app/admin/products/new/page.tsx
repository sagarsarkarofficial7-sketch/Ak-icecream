import { ProductForm } from "@/components/admin/ProductForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { title: 'asc' }})
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Product</h1>
          <p className="text-neutral-400 text-sm mt-1">Fill in the details below to create a new product.</p>
        </div>
      </div>
      
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-sm p-6 overflow-hidden">
        <ProductForm categories={categories} />
      </div>
    </div>
  )
}
