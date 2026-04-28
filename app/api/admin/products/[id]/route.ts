import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

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
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        categoryId: data.categoryId,
        inStock: data.inStock,
        isRecommended: data.isRecommended ?? false,
        images: JSON.stringify(data.images || []),
        options: data.options || "[]",
      }
    });

    revalidatePath("/")
    revalidatePath("/home")
    revalidatePath("/shop")
    revalidatePath("/admin/products")

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  try {
    await prisma.product.delete({
      where: { id: params.id }
    });

    revalidatePath("/")
    revalidatePath("/home")
    revalidatePath("/shop")
    revalidatePath("/admin/products")

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
