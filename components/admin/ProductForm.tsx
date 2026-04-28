"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, X, ImageIcon, UploadCloud } from "lucide-react"
import Image from "next/image"

export function ProductForm({ product, categories = [] }: { product?: any, categories: any[] }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  let initialImages = [];
  try {
    initialImages = typeof product?.images === 'string' ? JSON.parse(product.images) : (product?.images || []);
  } catch (e) {
    initialImages = [];
  }
  
  let initialOptions = [];
  try {
    initialOptions = typeof product?.options === 'string' ? JSON.parse(product.options) : (product?.options || []);
  } catch(e) {}
  
  const initialScoopPrice = initialOptions.find((o: any) => o.size === 'Scoop')?.price || product?.price || "";
  const initialKgPrice = initialOptions.find((o: any) => o.size === '1 Kg')?.price || "";

  const initial250gPrice = initialOptions.find((o: any) => o.size === '250 Gm')?.price || "";
  const initial400gPrice = initialOptions.find((o: any) => o.size === '400 Gm')?.price || "";

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    scoopPrice: initialScoopPrice.toString(),
    kgPrice: initialKgPrice.toString(),
    price250g: initial250gPrice.toString(),
    price400g: initial400gPrice.toString(),
    categoryId: product?.categoryId || categories?.[0]?.id || "",
    inStock: product?.inStock ?? true,
    isRecommended: product?.isRecommended ?? false,
    images: initialImages
  })

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return;

    setIsUploading(true);
    const payload = new FormData();
    payload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: payload
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, data.url]
      }));
    } catch (err: any) {
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  }

  const removeImage = (urlToRemove: string) => {
    setFormData(prev => ({
       ...prev,
       images: prev.images.filter((img: string) => img !== urlToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
      const method = product ? 'PUT' : 'POST'
      
      const optionsArray = [];
      if (formData.scoopPrice) optionsArray.push({ size: 'Scoop', price: parseFloat(formData.scoopPrice) });
      if (formData.price250g) optionsArray.push({ size: '250 Gm', price: parseFloat(formData.price250g) });
      if (formData.price400g) optionsArray.push({ size: '400 Gm', price: parseFloat(formData.price400g) });
      if (formData.kgPrice) optionsArray.push({ size: '1 Kg', price: parseFloat(formData.kgPrice) });

      const payload = {
        ...formData,
        price: formData.scoopPrice ? parseFloat(formData.scoopPrice) : (formData.price250g ? parseFloat(formData.price250g) : (formData.price400g ? parseFloat(formData.price400g) : (formData.kgPrice ? parseFloat(formData.kgPrice) : 0))),
        options: JSON.stringify(optionsArray)
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error("Failed to save product")
      
      router.push("/admin/products")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">Name</label>
          <input 
            type="text" required name="name" value={formData.name} onChange={handleChange}
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. Midnight Chocolate Tub"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">Category</label>
          <select 
            name="categoryId" value={formData.categoryId} onChange={handleChange}
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          >
            {categories.map((c: any) => (
               <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">Scoop Price (₹)</label>
          <input 
            type="number" step="0.01" required name="scoopPrice" value={formData.scoopPrice} onChange={handleChange}
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. 50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">250 Gm Price (₹) - Optional</label>
          <input 
            type="number" step="0.01" name="price250g" value={formData.price250g} onChange={handleChange}
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. 150"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">400 Gm Price (₹) - Optional</label>
          <input 
            type="number" step="0.01" name="price400g" value={formData.price400g} onChange={handleChange}
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. 250"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">1 Kg Price (₹) - Optional</label>
          <input 
            type="number" step="0.01" name="kgPrice" value={formData.kgPrice} onChange={handleChange}
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. 350"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-300">Description</label>
        <textarea 
          rows={4} name="description" value={formData.description} onChange={handleChange}
          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-y"
          placeholder="Rich dark chocolate with fudge swirls..."
        />
      </div>

      {/* --- Image Gallery Upload Section --- */}
      <div className="space-y-4 pt-4 border-t border-white/5">
         <div className="flex items-center gap-2">
           <ImageIcon className="w-5 h-5 text-emerald-500" />
           <h3 className="text-sm font-medium text-neutral-200 uppercase tracking-widest">Product Imagery</h3>
         </div>
         
         <div className="flex flex-wrap gap-4">
            {formData.images.map((img: string, idx: number) => (
               <div key={idx} className="relative w-28 h-28 rounded-xl overflow-hidden border border-neutral-800 group bg-neutral-900">
                  <Image src={img} alt="Product view" fill className="object-cover" />
                  <button type="button" onClick={() => removeImage(img)} className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 p-1.5 rounded-full text-white backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100">
                     <X className="w-4 h-4" />
                  </button>
               </div>
            ))}
            
            <label className="w-28 h-28 rounded-xl border-2 border-dashed border-neutral-800 hover:border-emerald-500 bg-neutral-950 flex flex-col items-center justify-center cursor-pointer transition-colors text-neutral-500 hover:text-emerald-500">
               {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6 mb-2" />}
               <span className="text-xs font-medium">{isUploading ? 'Sending...' : 'Upload'}</span>
               <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
            </label>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
         <div className="flex items-center gap-3 bg-neutral-950 p-4 border border-neutral-800 rounded-lg">
           <input 
             type="checkbox" id="inStock" name="inStock" checked={formData.inStock} onChange={handleChange}
             className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-emerald-600 focus:ring-emerald-600 focus:ring-offset-neutral-950"
           />
           <label htmlFor="inStock" className="text-sm font-medium text-neutral-300 cursor-pointer flex-1">
             In Stock Availability
           </label>
         </div>

         <div className="flex items-center gap-3 bg-neutral-950 p-4 border border-neutral-800 rounded-lg border-l-4 border-l-orange-500">
           <input 
             type="checkbox" id="isRecommended" name="isRecommended" checked={formData.isRecommended} onChange={handleChange}
             className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-orange-500 focus:ring-orange-500 focus:ring-offset-neutral-950"
           />
           <label htmlFor="isRecommended" className="text-sm font-medium text-orange-200 cursor-pointer flex-1">
             Mark as "Recommended" Product
           </label>
         </div>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-neutral-800">
        <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {product ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}
