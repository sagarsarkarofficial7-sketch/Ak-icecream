import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use raw SQL to bypass Prisma Client sync issues on the server
    await prisma.$executeRaw`
      INSERT INTO "Inquiry" ("id", "name", "email", "subject", "message", "createdAt")
      VALUES (gen_random_uuid(), ${name}, ${email}, ${subject}, ${message}, NOW())
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("CONTACT FORM API ERROR:", error);
    return NextResponse.json({ 
      error: "Failed to send message", 
      details: error.message 
    }, { status: 500 });
  }
}
