import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, permissions: true, createdAt: true } as any,
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = body.name;
    const email = (body.email || "").toLowerCase().trim();
    const password = (body.password || "").trim();
    const role = body.role;
    const permissions = body.permissions;
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
       return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'admin',
        permissions: permissions || '["all"]'
      } as any,
      select: { id: true, name: true, email: true, role: true, permissions: true } as any
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("User Creation Error:", error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
