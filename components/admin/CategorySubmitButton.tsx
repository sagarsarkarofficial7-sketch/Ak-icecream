"use client"
import { useFormStatus } from "react-dom"
import { Loader2, Plus, Save } from "lucide-react"

export function AddCategoryButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors h-10 w-full md:w-auto disabled:opacity-50"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      {pending ? 'Adding...' : 'Add Category'}
    </button>
  )
}

export function SaveCategoryButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {pending ? 'Saving...' : 'Save'}
    </button>
  )
}
