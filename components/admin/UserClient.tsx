"use client"
import { useState } from 'react'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import { UserForm } from './UserForm'

export function UserClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any | null>(null)

  const handleCreate = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you heavily certain you want to revoke and delete this Admin account?')) return
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Deletion failed')
      setUsers(users.filter(u => u.id !== id))
    } catch (e) {
      alert('Failed to delete user.')
    }
  }

  const filteredUsers = users.filter((u) => {
    const term = searchQuery.toLowerCase()
    return (
      (u.name || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.role || '').toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Administrators & Staff</h1>
          <p className="text-neutral-400 mt-1">Manage platform access, roles, and granular CMS permissions.</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-lg"
        >
          <Plus className="w-5 h-5" /> Add User
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-sm p-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search accounts specifically by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-neutral-600"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 text-sm">
                <th className="pb-3 pr-4 font-medium uppercase tracking-wider text-xs">Auth Profile</th>
                <th className="pb-3 px-4 font-medium uppercase tracking-wider text-xs hidden sm:table-cell">Privilege Level</th>
                <th className="pb-3 px-4 font-medium uppercase tracking-wider text-xs hidden md:table-cell">Permissions Block</th>
                <th className="pb-3 pl-4 font-medium uppercase tracking-wider text-xs text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredUsers.map((user) => {
                let perms = [];
                try { perms = JSON.parse(user.permissions || "[]"); } catch (e) {}
                
                return (
                  <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold flex items-center justify-center font-outfit uppercase">
                          {(user.name && user.name.length > 0) ? user.name[0] : (user.email ? user.email[0] : "A")}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{user.name || "System Admin"}</div>
                          <div className="text-sm text-neutral-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                        user.role === 'superadmin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {user.role ? user.role.toUpperCase() : 'ADMIN'}
                      </span>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-2 max-w-xs">
                         {perms.includes("all") ? (
                            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">All Access Modules</span>
                         ) : perms.map((p: string) => (
                            <span key={p} className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700 capitalize">
                               {p.replace('-', ' ')}
                            </span>
                         ))}
                      </div>
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors border border-transparent hover:border-neutral-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-neutral-400 hover:text-red-400 bg-neutral-800 hover:bg-red-900/30 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-neutral-500 text-sm">
                    No administrators found explicitly matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingUser}
        onSuccess={(savedUser) => {
          if (editingUser) {
            setUsers(users.map((u) => (u.id === savedUser.id ? savedUser : u)))
          } else {
            setUsers([savedUser, ...users])
          }
          setIsFormOpen(false)
        }}
      />
    </div>
  )
}
