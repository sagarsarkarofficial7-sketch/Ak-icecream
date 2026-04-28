import { prisma } from "@/lib/prisma"
import { Plus, Edit } from "lucide-react"
import Link from "next/link"
import { DeleteProductButton } from "@/components/admin/DeleteProductButton"

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-neutral-400 text-sm mt-1">Manage your ice cream catalog and pricing.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="text-xs text-neutral-500 uppercase bg-neutral-950 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                    No products found. Click "Add Product" to get started.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                    <td className="px-6 py-4">{product.category?.title || "Uncategorized"}</td>
                    <td className="px-6 py-4">₹{product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {product.inStock ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-500/20">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-3 text-right">
                      <Link href={`/admin/products/${product.id}`} className="text-neutral-400 hover:text-emerald-400 transition-colors">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
