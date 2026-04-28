"use client"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ImagePlus, X } from "lucide-react"
import Image from "next/image"

export function BlogForm({ blog }: { blog?: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    slug: blog?.slug || "",
    excerpt: blog?.excerpt || "",
    content: blog?.content || "",
    coverImage: blog?.coverImage || "",
    isPublished: blog?.isPublished ?? false,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    setError("")
    
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      
      setFormData(prev => ({ ...prev, coverImage: data.url }))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const url = blog ? `/api/admin/blogs/${blog.id}` : '/api/admin/blogs'
      const method = blog ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save blog post")
      
      router.push("/admin/blogs")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">{error}</div>}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Blog Title</label>
            <input 
              type="text" required name="title" value={formData.title} onChange={handleChange}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-lg font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-neutral-600"
              placeholder="e.g. The Secret Behind Our Mava Malai"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Content (Markdown supported)</label>
            <textarea 
              rows={15} required name="content" value={formData.content} onChange={handleChange}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-300 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-y placeholder:text-neutral-600"
              placeholder="Write your amazing blog post here..."
            />
          </div>
        </div>

        {/* Sidebar Options Area */}
        <div className="space-y-6">
          
          <div className="bg-neutral-950/50 p-5 rounded-xl border border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-500">Publication Details</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-400">URL Slug (Optional)</label>
              <input 
                type="text" name="slug" value={formData.slug} onChange={handleChange}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-neutral-600"
                placeholder="auto-generated-if-empty"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-400">Short Excerpt (Optional)</label>
              <textarea 
                rows={3} name="excerpt" value={formData.excerpt} onChange={handleChange}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-300 text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-y placeholder:text-neutral-600"
                placeholder="A brief summary for the blog card."
              />
            </div>

            <div className="pt-2 border-t border-neutral-800">
               <label className="flex items-center gap-3 cursor-pointer group">
                 <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} className="w-5 h-5 rounded bg-neutral-900 border-neutral-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-950" />
                 <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">Publish immediately</span>
               </label>
            </div>
          </div>

          <div className="bg-neutral-950/50 p-5 rounded-xl border border-neutral-800 space-y-4">
             <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-500">Cover Media</h3>
             
             {formData.coverImage ? (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-neutral-700 group">
                   <Image src={formData.coverImage} alt="Cover" fill className="object-cover" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button type="button" onClick={() => setFormData(p => ({ ...p, coverImage: "" }))} className="bg-red-500/20 text-red-400 hover:bg-red-500/40 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                         <X className="h-4 w-4" /> Remove
                      </button>
                   </div>
                </div>
             ) : (
                <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="w-full aspect-video border-2 border-dashed border-neutral-700 hover:border-emerald-500/50 bg-neutral-900/50 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-neutral-400 hover:text-emerald-400"
                >
                   {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
                   <span className="text-xs font-medium">{isUploading ? 'Uploading...' : 'Click to Upload Cover Image'}</span>
                </div>
             )}
             <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          </div>

        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-neutral-800">
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 text-sm font-medium text-neutral-400 hover:text-white transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isLoading || isUploading} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg transition-colors text-sm font-medium disabled:opacity-50">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {blog ? 'Save Changes' : 'Publish Blog'}
        </button>
      </div>
    </form>
  )
}
