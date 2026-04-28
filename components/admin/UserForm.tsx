"use client"
import { useState, useEffect } from "react"
import { X, Shield, Lock, Info, CheckSquare, Square } from "lucide-react"

const AVAILABLE_PERMISSIONS = [
   { id: 'all', label: 'Maximum SuperAdmin (All Vectors)' },
   { id: 'dashboard', label: 'Dashboard Analytics' },
   { id: 'categories', label: 'Categories' },
   { id: 'products', label: 'Products & Inventory' },
   { id: 'blogs', label: 'Blogs Publishing' },
   { id: 'hero-flavors', label: 'Hero Animations' },
   { id: 'stores', label: 'Store Locations' },
   { id: 'social-posts', label: 'Social Content' },
   { id: 'orders', label: 'E-Commerce Orders' },
   { id: 'inquiries', label: 'Customer Inquiries' },
   { id: 'content', label: 'Web Template Variables' },
   { id: 'settings', label: 'System Settings' }
];

export function UserForm({ isOpen, onClose, initialData, onSuccess }: { isOpen: boolean, onClose: () => void, initialData?: any, onSuccess: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    permissions: ['all']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
       let parsedPerms = ['all'];
       try { parsedPerms = JSON.parse(initialData.permissions || '["all"]'); } catch(e) {}
       
       setFormData({
         name: initialData.name || '',
         email: initialData.email || '',
         password: '', // Blank by default when editing preventing accidental overwrite
         role: initialData.role || 'admin',
         permissions: parsedPerms
       });
    } else {
       setFormData({
         name: '',
         email: '',
         password: '',
         role: 'admin',
         permissions: ['all']
       });
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
       const url = initialData?.id ? `/api/admin/users/${initialData.id}` : '/api/admin/users';
       const method = initialData?.id ? 'PUT' : 'POST';

       const payload = {
          ...formData,
          permissions: JSON.stringify(formData.permissions)
       }

       const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
       });

       const json = await res.json();
       if (!res.ok) throw new Error(json.error || 'Request failed operation');
       
       onSuccess(json);
    } catch (err: any) {
       setError(err.message);
    } finally {
       setLoading(false);
    }
  }

  const togglePermission = (permId: string) => {
     let current = [...formData.permissions];
     
     if (permId === 'all') {
        if (current.includes('all')) {
           current = []; // unchecking all
        } else {
           current = ['all']; // checking all disables others conceptually
        }
     } else {
        if (current.includes('all')) current = current.filter(p => p !== 'all');
        if (current.includes(permId)) current = current.filter(p => p !== permId);
        else current.push(permId);
     }
     
     setFormData({ ...formData, permissions: current });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-neutral-800 sticky top-0 bg-neutral-900/90 backdrop-blur-md z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            {initialData ? 'Update Privileges' : 'Deploy New User'}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-2 hover:bg-neutral-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-start gap-3 flex-wrap">
               <Info className="w-5 h-5 shrink-0" /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-outfit"
                placeholder="Manager Name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Secure Email ID</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono text-sm"
                placeholder="admin@akicecream.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Assignment Level</label>
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-outfit"
              >
                <option value="admin">Admin</option>
                <option value="superadmin">System Superadmin</option>
                <option value="editor">Content Editor</option>
                <option value="logistics">Logistics Lead</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 flex justify-between">
                <span>Passphrase {initialData && <span className="text-neutral-500 font-normal italic">(Leave blank to retain)</span>}</span>
              </label>
              <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                 <input
                   type="password"
                   required={!initialData}
                   value={formData.password}
                   onChange={e => setFormData({ ...formData, password: e.target.value })}
                   className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                   placeholder={initialData ? "••••••••" : "Generate Password"}
                 />
              </div>
            </div>
          </div>

          {/* Granular Permission Toggles */}
          <div className="pt-4 border-t border-neutral-800">
             <h3 className="text-base font-semibold text-white mb-4">Granular Interface Permissions</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {AVAILABLE_PERMISSIONS.map(perm => {
                   const isActive = formData.permissions.includes(perm.id) || (formData.permissions.includes('all'));
                   const isAllModuleDisabled = perm.id !== 'all' && formData.permissions.includes('all');

                   return (
                      <button
                         key={perm.id}
                         type="button"
                         disabled={isAllModuleDisabled}
                         onClick={() => togglePermission(perm.id)}
                         className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all ${
                            isActive 
                            ? (perm.id === 'all' ? 'bg-purple-500/10 border-purple-500/30' : 'bg-emerald-500/10 border-emerald-500/30') 
                            : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                         } ${isAllModuleDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                         <div className="mt-0.5 shrink-0">
                            {isActive ? 
                               <CheckSquare className={`w-4 h-4 ${perm.id==='all' ? 'text-purple-400' : 'text-emerald-500'}`} /> : 
                               <Square className="w-4 h-4 text-neutral-600" />
                            }
                         </div>
                         <span className={`text-sm ${isActive ? 'text-white font-medium' : 'text-neutral-400'}`}>
                            {perm.label}
                         </span>
                      </button>
                   )
                })}
             </div>
          </div>

          <div className="pt-6 border-t border-neutral-800 flex justify-end gap-4 mt-8 sticky bottom-0 bg-neutral-900 py-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-medium text-neutral-300 hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white px-8 py-2.5 rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (initialData ? 'Commit Sync' : 'Provision User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
