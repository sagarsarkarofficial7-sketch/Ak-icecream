"use client"
import { useState, useEffect } from 'react'
import { Trash2, Mail, User, MessageSquare, Calendar, Loader2 } from 'lucide-react'

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setError(null)
      const res = await fetch('/api/admin/inquiries')
      const data = await res.json()
      
      if (res.ok && Array.isArray(data)) {
        setInquiries(data)
      } else {
        const errorMsg = data.details ? `${data.error} (Error: ${data.details})` : (data.error || "Failed to load inquiries");
        setError(errorMsg)
      }
    } catch (err) {
      setError("A connection error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return
    
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setInquiries(inquiries.filter(i => i.id !== id))
      }
    } catch (err) {
      alert('Failed to delete inquiry')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-12 text-center text-red-500">
          <p className="font-medium mb-4">{error}</p>
          <div className="flex justify-center gap-3">
            <button onClick={fetchInquiries} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
              Retry
            </button>
            <button 
              onClick={async () => {
                const res = await fetch('/api/admin/debug-db')
                const data = await res.json()
                alert(JSON.stringify(data, null, 2))
              }} 
              className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors text-sm"
            >
              Test Connection
            </button>
          </div>
        </div>
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 text-xs text-neutral-500">
          <p><strong>Troubleshooting Tip:</strong> If the table is missing on your live site but exists on your computer, ensure you've added the <code>DATABASE_URL</code> to your cPanel "Setup Node.js App" Environment Variables section.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Customer Inquiries</h1>
        <p className="text-neutral-400 mt-1">Manage and respond to messages from your contact form.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {inquiries.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center">
            <Mail className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-500">No inquiries found yet.</p>
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors group">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-grow">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                      <User className="w-4 h-4" />
                      {inquiry.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
                      <Mail className="w-4 h-4" />
                      {inquiry.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700">
                      <Calendar className="w-4 h-4" />
                      {(() => {
                        try {
                          return new Date(inquiry.createdAt).toLocaleDateString();
                        } catch (e) {
                          return "Unknown date";
                        }
                      })()}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                       <MessageSquare className="w-5 h-5 text-neutral-500" />
                       {inquiry.subject}
                    </h3>
                    <p className="text-neutral-300 whitespace-pre-wrap leading-relaxed bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                      {inquiry.message}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => handleDelete(inquiry.id)}
                    className="p-3 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl border border-transparent hover:border-red-400/20 transition-all"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
