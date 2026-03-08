import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const { email, password } = await request.json();
    
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || Buffer.from(user.passwordHash, 'base64').toString() !== password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');

    return NextResponse.json({ 
      user: { id: user.id, email: user.email, username: user.username, displayName: user.displayName },
      token 
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}
