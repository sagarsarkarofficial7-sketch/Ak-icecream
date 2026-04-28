import { prisma } from "@/lib/prisma"
import { Plus, Edit } from "lucide-react"
import Link from "next/link"
import { DeleteBlogButton } from "@/components/admin/DeleteBlogButton"

export default async function AdminBlogsPage() {
  const blogs = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Blog Posts</h1>
          <p className="text-neutral-400 text-sm mt-1">Manage all your promotional pieces and published stories.</p>
        </div>
        <Link 
          href="/admin/blogs/new" 
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Write Blog
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="text-xs text-neutral-500 uppercase bg-neutral-950 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date Created</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                    No blog posts written yet. Click "Write Blog" to start authorizing.
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{blog.title}</td>
                    <td className="px-6 py-4">
                      {blog.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-500/10 px-2 py-1 text-xs font-medium text-neutral-400 ring-1 ring-inset ring-neutral-500/20">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 flex justify-end gap-3 text-right">
                      <Link href={`/admin/blogs/${blog.id}`} className="text-neutral-400 hover:text-emerald-400 transition-colors">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DeleteBlogButton id={blog.id} />
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
