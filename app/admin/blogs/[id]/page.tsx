import { BlogForm } from "@/components/admin/BlogForm"
import { prisma } from "@/lib/prisma"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const blog = await prisma.blogPost.findUnique({
    where: { id: params.id }
  })

  if (!blog) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs" className="p-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Blog</h1>
          <p className="text-neutral-400 text-sm mt-1">Update the content, cover, or status of your post.</p>
        </div>
      </div>
      
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-sm p-6 overflow-hidden">
        <BlogForm blog={blog} />
      </div>
    </div>
  )
}
