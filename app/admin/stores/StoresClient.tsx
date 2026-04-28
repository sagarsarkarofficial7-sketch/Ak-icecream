"use client"
import { useState } from "react"
import { Loader2, Save, Trash2, Plus, MapPin, Clock, ImageIcon, ExternalLink } from "lucide-react"
import Image from "next/image"

type StoreFormState = {
  id: string
  name: string
  address: string
  timing: string
  image: string | null
  mapsLink: string | null
}

type NewStoreState = {
  name: string
  address: string
  timing: string
  image: string
  mapsLink: string
}

export default function StoresClient({ initialStores }: { initialStores: StoreFormState[] }) {
  const [stores, setStores] = useState<StoreFormState[]>(initialStores)
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  
  const [newStore, setNewStore] = useState<NewStoreState>({
    name: "",
    address: "",
    timing: "",
    image: "",
    mapsLink: ""
  })

  const handleUpload = async (file: File, storeId: string | 'new') => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      const imageUrl = typeof data.url === "string" ? data.url : ""
      
      if (storeId === 'new') {
        setNewStore(prev => ({ ...prev, image: imageUrl }))
      } else {
        setStores(prev => prev.map(s => 
          s.id === storeId ? { ...s, image: imageUrl } : s
        ))
      }
    } catch (err) {
      alert("Failed to upload image. Please check your server limits.")
    }
  }

  const handleAddStore = async () => {
    if (!newStore.name || !newStore.address) return alert("Name and Address are required")
    setIsAdding(true)
    try {
      const res = await fetch("/api/admin/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStore)
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to add store")
      }
      const added = await res.json()
      setStores([...stores, added])
      setNewStore({ name: "", address: "", timing: "", image: "", mapsLink: "" })
      alert("Store added successfully!")
    } catch (err: any) {
      alert("Error: " + err.message)
    } finally {
      setIsAdding(false)
    }
  }

  const handleUpdateStore = async (id: string) => {
    const store = stores.find(s => s.id === id)
    if (!store) return
    
    setIsSaving(id)
    try {
      const res = await fetch("/api/admin/stores", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(store)
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to update")
      }
      alert("Store updated successfully!")
    } catch (err: any) {
      alert("Error saving store: " + err.message)
    } finally {
      setIsSaving(null)
    }
  }

  const handleDeleteStore = async (id: string) => {
    if (!confirm("Are you sure you want to delete this store location?")) return
    
    setIsDeleting(id)
    try {
      const res = await fetch(`/api/admin/stores?id=${id}`, {
        method: "DELETE"
      })
      if (!res.ok) throw new Error("Failed to delete")
      setStores(stores.filter(s => s.id !== id))
    } catch (err) {
      alert("Error deleting: " + err)
    } finally {
      setIsDeleting(null)
    }
  }

  const updateLocalStore = (id: string, field: keyof StoreFormState, value: string) => {
    setStores(prev => prev.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ))
  }

  return (
    <div className="space-y-10">
      {/* Add Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 rounded-full" />
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-400" />
          Add New Store Location
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Store Name</label>
              <input 
                value={newStore.name} 
                onChange={e => setNewStore({ ...newStore, name: e.target.value })}
                placeholder="e.g. Downtown Kothi"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-outfit" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Address</label>
              <input 
                value={newStore.address} 
                onChange={e => setNewStore({ ...newStore, address: e.target.value })}
                placeholder="Full address of the store"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Timings</label>
              <input 
                value={newStore.timing} 
                onChange={e => setNewStore({ ...newStore, timing: e.target.value })}
                placeholder="e.g. 10:00 AM - 11:30 PM"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-sm" 
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Store Image</label>
              <div className="flex items-start gap-5">
                <div className="relative w-32 h-32 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center overflow-hidden">
                  {newStore.image ? (
                    <Image src={newStore.image} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="text-center">
                       <ImageIcon className="w-8 h-8 text-neutral-800 mx-auto mb-1" />
                       <span className="text-[10px] text-neutral-700">600x400 opt.</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow space-y-3">
                  <p className="text-xs text-neutral-500">Upload a high-quality photo of the store front or interior.</p>
                  <label className="inline-block cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                     Choose Image
                     <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'new')} />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Google Maps Link (GMB)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input 
                  value={newStore.mapsLink} 
                  onChange={e => setNewStore({ ...newStore, mapsLink: e.target.value })}
                  placeholder="https://maps.google.com/..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-xs font-mono" 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleAddStore}
            disabled={isAdding}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Create Store
          </button>
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest">Configured Locations</h2>
          <span className="text-xs text-neutral-600">{stores.length} Stores Total</span>
        </div>
        
        <div className="grid gap-6">
          {stores.map((store) => (
            <div key={store.id} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col xl:flex-row gap-8 items-start hover:border-neutral-700 transition-all group overflow-hidden relative">
              {/* Image Preview */}
              <div className="relative w-full xl:w-64 h-48 xl:h-48 rounded-2xl bg-black border border-neutral-800 overflow-hidden shrink-0">
                {store.image ? (
                  <Image src={store.image} alt={store.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-neutral-950">
                    <ImageIcon className="w-8 h-8 text-neutral-800" />
                    <span className="text-[10px] text-neutral-700 tracking-wider">NO IMAGE</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-md p-2 flex justify-center border-t border-neutral-800">
                   <label className="cursor-pointer text-[10px] text-emerald-400 font-bold hover:text-white transition-colors uppercase tracking-widest">
                      Change Photo
                      <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], store.id)} />
                   </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex-grow space-y-5 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-widest pl-1">Store Name</label>
                    <input 
                      value={store.name}
                      onChange={e => updateLocalStore(store.id, 'name', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-emerald-500 font-outfit font-bold" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-widest pl-1">Opening Hours</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600" />
                      <input 
                        value={store.timing || ""}
                        onChange={e => updateLocalStore(store.id, 'timing', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:ring-1 focus:ring-emerald-500 text-sm font-poppins" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-widest pl-1">Full Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-3.5 h-3.5 text-neutral-600" />
                    <textarea 
                      value={store.address || ""}
                      onChange={e => updateLocalStore(store.id, 'address', e.target.value)}
                      rows={2}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:ring-1 focus:ring-emerald-500 text-sm font-poppins resize-none" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-widest pl-1">GMB / Maps Link</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600" />
                    <input 
                      value={store.mapsLink || ""}
                      onChange={e => updateLocalStore(store.id, 'mapsLink', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:ring-1 focus:ring-emerald-500 text-[10px] font-mono text-neutral-400 focus:text-white" 
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-3 w-full xl:w-32 shrink-0 self-end xl:self-stretch justify-end">
                <button 
                  onClick={() => handleUpdateStore(store.id)}
                  disabled={isSaving === store.id}
                  className="flex-1 xl:w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-500 transition-all disabled:opacity-50 shadow-lg shadow-emerald-900/20"
                >
                  {isSaving === store.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span className="text-xs font-bold uppercase tracking-widest">Save</span>
                </button>
                <button 
                  onClick={() => handleDeleteStore(store.id)}
                  disabled={isDeleting === store.id}
                  className="flex items-center justify-center bg-neutral-950 text-red-500 border border-neutral-800 p-3 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                >
                  {isDeleting === store.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
