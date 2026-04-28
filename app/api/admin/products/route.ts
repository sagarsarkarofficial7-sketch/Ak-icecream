import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

// Require auth function
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
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  try {
    const data = await req.json();
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description || "",
        price: parseFloat(data.price),
        categoryId: data.categoryId,
        images: JSON.stringify(data.images || []),
        options: data.options || "[]",
        inStock: data.inStock ?? true,
        isRecommended: data.isRecommended ?? false,
      } 
    });

    revalidatePath("/")
    revalidatePath("/home")
    revalidatePath("/shop")
    revalidatePath("/admin/products")

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("CREATE PRODUCT ERR", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
