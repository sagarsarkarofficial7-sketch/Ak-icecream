import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

const requireAuth = async () => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function GET() {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  try {
    const data = await req.json();
    const bgImage = data.bgImage || null;
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const category = await prisma.category.create({
      data: {
        title: data.title,
        slug,
        description: data.description || "",
        themeColor: data.themeColor || "",
        image: data.image || null,
        bgImage,
      }
    });

    revalidatePath("/")
    revalidatePath("/home")
    revalidatePath("/shop")
    revalidatePath("/admin/categories")

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("CREATE CATEGORY ERR", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  try {
    const data = await req.json();
    const { id } = data;
    const bgImage = data.bgImage || null;

    const updateData = {
      title: data.title,
      description: data.description,
      themeColor: data.themeColor,
      image: data.image || null,
      bgImage,
      slug: data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    };

    const category = await prisma.category.update({
      where: { id },
      data: updateData
    });

    revalidatePath("/")
    revalidatePath("/home")
    revalidatePath("/shop")
    revalidatePath("/admin/categories")

    return NextResponse.json(category);
  } catch (error: any) {
    console.error("UPDATE CATEGORY ERR", error);
    return NextResponse.json({ 
      error: "Failed to update category: " + (error.message || "Unknown error")
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.category.delete({
      where: { id }
    });

    revalidatePath("/")
    revalidatePath("/admin/categories")

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE CATEGORY ERR", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
