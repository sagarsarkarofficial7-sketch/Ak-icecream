import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ 
    message: "Seeding is currently disabled because data files were not found. Since the database is already populated, the site will function correctly." 
  })
}
