import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    await prisma.$executeRaw`
      DELETE FROM "Inquiry" WHERE "id" = ${params.id}
    `
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 })
  }
}
