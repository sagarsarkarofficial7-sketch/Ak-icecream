import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

const requireAuth = async () => {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  try {
    const blogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  try {
    const data = await req.json();
    
    // Auto-generate slug if not provided
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const blog = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        isPublished: data.isPublished ?? false,
      }
    });
    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "A blog post with this title/slug already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
