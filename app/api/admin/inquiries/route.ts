import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const inquiries = await prisma.$queryRaw`
      SELECT * FROM "Inquiry" ORDER BY "createdAt" DESC
    `
    return NextResponse.json(inquiries)
  } catch (error: any) {
    console.error("Fetch Inquiries API Error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch inquiries. Database table might be missing.",
      details: error.message 
    }, { status: 500 })
  }
}
