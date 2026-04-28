import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

const requireAuth = async () => {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const content = await prisma.pageContent.findUnique({ where: { pageSlug: slug } });
    return NextResponse.json(content || { pageSlug: slug, content: "{}" });
  }

  const allContent = await prisma.pageContent.findMany();
  return NextResponse.json(allContent);
}

export async function PUT(req: Request) {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  try {
    const data = await req.json();
    
    if (!data.pageSlug || !data.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const content = await prisma.pageContent.upsert({
      where: { pageSlug: data.pageSlug },
      update: { content: data.content },
      create: { pageSlug: data.pageSlug, content: data.content }
    });
    
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
