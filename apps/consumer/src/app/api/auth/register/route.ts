import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, username, displayName, password } = await request.json();
    
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });
    
    if (existing) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Simple hash for demo (use bcrypt in production)
    const passwordHash = btoa(password);
    
    const user = await prisma.user.create({
      data: { email, username, displayName, passwordHash, role: 'USER' },
    });

    // Generate simple token
    const token = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');

    return NextResponse.json({ 
      user: { id: user.id, email: user.email, username: user.username, displayName: user.displayName },
      token 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error registering user' }, { status: 500 });
  }
}
