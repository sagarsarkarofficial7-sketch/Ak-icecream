"use client"
import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error("Failed to delete")
      router.refresh()
    } catch (error) {
      alert("Error deleting product")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-neutral-400 hover:text-red-400 transition-colors disabled:opacity-50"
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  )
}
