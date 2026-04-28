import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    
    // Check if table exists
    const tables: any[] = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    const inquiryTableExists = tables.some(t => t.table_name.toLowerCase() === 'inquiry')

    return NextResponse.json({
      status: "Connected",
      databaseUrlPrefix: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || "Not Set",
      tables: tables.map(t => t.table_name),
      inquiryTableExists
    })
  } catch (error: any) {
    return NextResponse.json({
      status: "Error",
      message: error.message,
      envSet: !!process.env.DATABASE_URL
    }, { status: 500 })
  }
}
