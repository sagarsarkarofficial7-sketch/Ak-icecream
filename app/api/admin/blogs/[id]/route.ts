import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

const requireAuth = async () => {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  try {
    const data = await req.json();
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const blog = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug: slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        isPublished: data.isPublished,
      }
    });
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  try {
    await prisma.blogPost.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
