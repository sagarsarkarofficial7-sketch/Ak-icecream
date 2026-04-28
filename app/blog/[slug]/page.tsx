import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Footer from "@/components/Footer"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, isPublished: true }
  })
  
  if (!post) {
    return notFound()
  }

  return (
    <main className="relative min-h-screen bg-[#FFF8F5]">
       {/* Background ambient light */}
       <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-pinkCream/10 to-transparent z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-pinkCream/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
       </div>

       <div className="relative z-10 pt-40 pb-24 px-6 max-w-4xl mx-auto space-y-12">
          
          <div className="space-y-6 text-center">
             <h1 className="text-4xl md:text-5xl lg:text-[64px] font-outfit font-black text-black/90 drop-shadow-sm tracking-tight leading-tight">
               {post.title}
             </h1>
             <div className="flex items-center justify-center gap-4 text-black/50 font-poppins mb-4 text-sm font-medium">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
             </div>
          </div>
          
          {post.coverImage && (
             <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border border-black/5 bg-black/5">
               <Image src={post.coverImage} fill alt={post.title} className="object-cover" />
             </div>
          )}

          <div className="pt-8 prose prose-lg md:prose-xl max-w-none text-black/70 font-poppins leading-loose whitespace-pre-wrap">
             {post.content}
          </div>

       </div>
       <Footer />
    </main>
  )
}
