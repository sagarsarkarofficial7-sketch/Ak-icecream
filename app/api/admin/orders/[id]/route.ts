import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json();
    
    if (!status) {
      return NextResponse.json({ error: "Missing status payload" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: { status }
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ error: "Failed to update internal order ledger status" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const deletedOrder = await prisma.order.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true, order: deletedOrder });
  } catch (error) {
    console.error("Order delete error:", error);
    return NextResponse.json({ error: "Failed to securely destroy order ledger" }, { status: 500 });
  }
}
