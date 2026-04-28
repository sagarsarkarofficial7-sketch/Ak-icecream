"use client"
import { useState } from "react"
import { Loader2, Save, Trash2, Plus, ImageIcon } from "lucide-react"
import Image from "next/image"

type CategoryFormState = {
  id: string
  title: string
  description: string | null
  themeColor: string | null
  image: string | null
  bgImage: string | null
}

type NewCategoryState = {
  title: string
  description: string
  themeColor: string
  image: string
  bgImage: string
}

export default function CategoriesClient({ initialCategories }: { initialCategories: CategoryFormState[] }) {
  const [categories, setCategories] = useState<CategoryFormState[]>(initialCategories)
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  
  const [newCat, setNewCat] = useState<NewCategoryState>({
    title: "",
    description: "",
    themeColor: "",
    image: "",
    bgImage: ""
  })

  // Unified upload handler
  const handleUpload = async (file: File, catId: string | 'new', field: 'image' | 'bgImage') => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      const imageUrl = typeof data.url === "string" ? data.url : ""
      
      if (catId === 'new') {
        setNewCat(prev => ({ ...prev, [field]: imageUrl }))
      } else {
        setCategories(prev => prev.map(c => 
          c.id === catId ? { ...c, [field]: imageUrl } : c
        ))
      }
    } catch (err) {
      alert("Failed to upload image. Please check your server limits.")
    }
  }

  const handleAddCategory = async () => {
    if (!newCat.title) return alert("Title is required")
    setIsAdding(true)
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCat)
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to add category")
      }
      const added = await res.json()
      setCategories([...categories, added])
      setNewCat({ title: "", description: "", themeColor: "", image: "", bgImage: "" })
      alert("Category added successfully!")
    } catch (err: any) {
      alert("Error: " + err.message)
    } finally {
      setIsAdding(false)
    }
  }

  const handleUpdateCategory = async (id: string) => {
    const cat = categories.find(c => c.id === id)
    if (!cat) return
    
    setIsSaving(id)
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cat)
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to update")
      }
      alert("Changes saved!")
    } catch (err: any) {
      alert("Error saving category: " + err.message)
    } finally {
      setIsSaving(null)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? All associated products might be affected.")) return
    
    setIsDeleting(id)
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE"
      })
      if (!res.ok) throw new Error("Failed to delete")
      setCategories(categories.filter(c => c.id !== id))
    } catch (err) {
      alert("Error deleting: " + err)
    } finally {
      setIsDeleting(null)
    }
  }

  const updateLocalCategory = (id: string, field: keyof CategoryFormState, value: string) => {
    setCategories(prev => prev.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ))
  }

  return (
    <div className="space-y-10">
      {/* Add Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 rounded-full" />
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-400" />
          Add New Category
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Category Title</label>
              <input 
                value={newCat.title} 
                onChange={e => setNewCat({ ...newCat, title: e.target.value })}
                placeholder="e.g. Exotic Specials"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Description</label>
              <textarea 
                value={newCat.description} 
                onChange={e => setNewCat({ ...newCat, description: e.target.value })}
                placeholder="Briefly describe what makes this category special..."
                rows={3}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all" 
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Thumbnail Image</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center overflow-hidden">
                      {newCat.image ? <Image src={newCat.image} alt="Preview" width={48} height={48} className="object-cover" /> : <ImageIcon className="w-5 h-5 text-neutral-700" />}
                    </div>
                    <label className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-[10px] text-white px-3 py-2 rounded-lg transition-colors">
                       Upload
                       <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'new', 'image')} />
                    </label>
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Background Image</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center overflow-hidden">
                      {newCat.bgImage ? <Image src={newCat.bgImage} alt="Preview" width={48} height={48} className="object-cover" /> : <ImageIcon className="w-5 h-5 text-neutral-700" />}
                    </div>
                    <label className="cursor-pointer bg-emerald-900/30 hover:bg-emerald-800/40 text-[10px] text-emerald-400 px-3 py-2 rounded-lg border border-emerald-500/20 transition-colors">
                       Upload
                       <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'new', 'bgImage')} />
                    </label>
                  </div>
               </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Theme (Tailwind Classes)</label>
              <input 
                value={newCat.themeColor} 
                onChange={e => setNewCat({ ...newCat, themeColor: e.target.value })}
                placeholder="e.g. bg-pinkCream hover:bg-cherryRed"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm" 
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleAddCategory}
            disabled={isAdding}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Create Category
          </button>
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-6">
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest pl-2">Existing Categories</h2>
        
        <div className="grid gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col lg:flex-row gap-8 items-start hover:border-neutral-700 transition-all group">
              {/* Image Previews */}
              <div className="flex gap-4 shrink-0">
                <div className="relative w-32 h-32 rounded-2xl bg-black border border-neutral-800 overflow-hidden group-hover:scale-105 transition-transform">
                  {cat.image ? (
                    <Image src={cat.image.startsWith('/') ? cat.image : `/categories/${cat.image}`} alt="Cat" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                      <ImageIcon className="w-6 h-6 text-neutral-800" />
                      <span className="text-[10px] text-neutral-600">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-sm p-1.5 flex justify-center border-t border-neutral-800">
                     <label className="cursor-pointer text-[10px] text-emerald-400 font-bold hover:text-white transition-colors">
                        REPLACE
                        <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], cat.id, 'image')} />
                     </label>
                  </div>
                </div>

                <div className="relative w-32 h-32 rounded-2xl bg-black border border-neutral-800 overflow-hidden group-hover:scale-105 transition-transform flex flex-col items-center justify-center p-2 text-center">
                  {cat.bgImage ? (
                    <Image src={cat.bgImage.startsWith('/') ? cat.bgImage : `/categories/${cat.bgImage}`} alt="BG" fill className="object-cover opacity-60" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-neutral-950">
                      <ImageIcon className="w-6 h-6 text-neutral-800" />
                      <span className="text-[10px] text-neutral-700">No Background</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-sm p-1.5 flex justify-center border-t border-neutral-800">
                     <label className="cursor-pointer text-[10px] text-cyan-400 font-bold hover:text-white transition-colors">
                        SET BACKGROUND
                        <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], cat.id, 'bgImage')} />
                     </label>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex-grow space-y-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-600 uppercase mb-1">Title</label>
                    <input 
                      value={cat.title}
                      onChange={e => updateLocalCategory(cat.id, 'title', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-600 uppercase mb-1">Theme Color/Class</label>
                    <input 
                      value={cat.themeColor || ""}
                      onChange={e => updateLocalCategory(cat.id, 'themeColor', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-sm" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-600 uppercase mb-1">Description</label>
                  <textarea 
                    value={cat.description || ""}
                    onChange={e => updateLocalCategory(cat.id, 'description', e.target.value)}
                    rows={2}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500 text-sm" 
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-3 w-full lg:w-32 shrink-0 self-end lg:self-center">
                <button 
                  onClick={() => handleUpdateCategory(cat.id)}
                  disabled={isSaving === cat.id}
                  className="flex-1 lg:w-full flex items-center justify-center gap-2 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 px-4 py-3 rounded-xl hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50"
                >
                  {isSaving === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span className="text-xs font-bold uppercase tracking-widest">Save</span>
                </button>
                <button 
                  onClick={() => handleDeleteCategory(cat.id)}
                  disabled={isDeleting === cat.id}
                  className="flex items-center justify-center bg-red-950/20 text-red-500 border border-red-950/30 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                >
                  {isDeleting === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
