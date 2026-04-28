import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const name = body.name;
    const email = (body.email || "").toLowerCase().trim();
    const password = (body.password || "").trim();
    const role = body.role;
    const permissions = body.permissions;

    const updateData: any = { name, email, role, permissions };
    
    if (password && password !== '') {
       updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, permissions: true } as any
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("User Update Error:", error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Safety check - optional: block users from deleting themselves 
    // but without full session context here, we just delete
    await prisma.user.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
