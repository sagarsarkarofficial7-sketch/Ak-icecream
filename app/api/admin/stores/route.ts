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
  try {
    const stores = await prisma.storeLocation.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(stores);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  try {
    const data = await req.json();
    
    const store = await prisma.storeLocation.create({
      data: {
        name: data.name,
        address: data.address,
        timing: data.timing,
        image: data.image || null,
        mapsLink: data.mapsLink || null,
      }
    });

    revalidatePath("/")
    revalidatePath("/home")
    revalidatePath("/contact")
    revalidatePath("/admin/stores")

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error("CREATE STORE ERR", error);
    return NextResponse.json({ error: "Failed to create store" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  try {
    const data = await req.json();
    const { id } = data;

    const store = await prisma.storeLocation.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        timing: data.timing,
        image: data.image || null,
        mapsLink: data.mapsLink || null,
      }
    });

    revalidatePath("/")
    revalidatePath("/home")
    revalidatePath("/contact")
    revalidatePath("/admin/stores")

    return NextResponse.json(store);
  } catch (error: any) {
    console.error("UPDATE STORE ERR", error);
    return NextResponse.json({ 
      error: "Failed to update store: " + (error.message || "Unknown error")
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

    await prisma.storeLocation.delete({
      where: { id }
    });

    revalidatePath("/")
    revalidatePath("/home")
    revalidatePath("/contact")
    revalidatePath("/admin/stores")

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE STORE ERR", error);
    return NextResponse.json({ error: "Failed to delete store" }, { status: 500 });
  }
}
