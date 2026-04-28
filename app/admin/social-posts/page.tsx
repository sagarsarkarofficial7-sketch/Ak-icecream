import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Trash2, Plus } from "lucide-react"
import cloudinary from "@/lib/cloudinary"
import Image from "next/image"

export default async function AdminSocialPostsPage() {
  const posts = await prisma.socialPost.findMany({ orderBy: { createdAt: 'desc' } })

  async function createPost(formData: FormData) {
    "use server"
    const file = formData.get("file") as File;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "ak-social",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      
      await prisma.socialPost.create({ 
        data: { imageUrl: (uploadResult as any).secure_url }
      })
      revalidatePath("/admin/social-posts")
    }
  }

  async function deletePost(formData: FormData) {
    "use server"
    const id = formData.get("id") as string;
    const post = await prisma.socialPost.findUnique({ where: { id }});
    
    if (post && post.imageUrl.includes('cloudinary.com')) {
       try {
         // Extract public_id from cloudinary URL
         // Example: https://res.cloudinary.com/cloudname/image/upload/v123/ak-social/filename.jpg
         const parts = post.imageUrl.split('/');
         const fileNameWithExt = parts[parts.length - 1];
         const folder = parts[parts.length - 2];
         const publicId = `${folder}/${fileNameWithExt.split('.')[0]}`;
         await cloudinary.uploader.destroy(publicId);
       } catch (e) { 
         console.error("Cloudinary delete failed", e);
       }
    }
    
    await prisma.socialPost.delete({ where: { id } })
    revalidatePath("/admin/social-posts")
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Social Posts</h1>
        <p className="text-neutral-400 text-sm mt-1">Manage the image gallery displayed on the homepage right-side column.</p>
      </div>

      <div className="mb-10">
        <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-widest mb-4">Upload New Post</h2>
        <form action={createPost} className="bg-emerald-900/10 border border-emerald-900/40 rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Select Image (JPG/PNG/WEBP)</label>
              <input type="file" name="file" accept="image/*" required className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white outline-none focus:border-emerald-500 file:bg-neutral-800 file:text-neutral-300 file:border-0 file:px-4 file:py-2 file:mr-4 file:rounded file:cursor-pointer hover:file:bg-neutral-700" />
            </div>
            <button type="submit" className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 h-10 rounded-lg text-sm font-medium transition-colors">
               <Plus className="h-4 w-4" /> Upload
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-widest">Existing Posts Grid</h2>
        {posts.length === 0 && <p className="text-neutral-500 text-sm">No posts uploaded yet. Upload one above.</p>}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map(post => (
            <div key={post.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group">
              <div className="relative aspect-square w-full">
                 <Image src={post.imageUrl} alt="Social Post" fill className="object-cover" />
                 
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <form action={deletePost}>
                       <input type="hidden" name="id" value={post.id} />
                       <button type="submit" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-lg">
                         <Trash2 className="h-4 w-4" /> Delete Post
                       </button>
                    </form>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
