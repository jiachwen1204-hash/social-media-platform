import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const { email, username, displayName, password } = await request.json();
    
    const passwordHash = Buffer.from(password).toString('base64');
    
    const user = await prisma.user.create({
      data: { email, username, displayName, passwordHash, role: 'USER' },
    });

    const token = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');

    return NextResponse.json({ 
      user: { id: user.id, email: user.email, username: user.username, displayName: user.displayName },
      token 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}
