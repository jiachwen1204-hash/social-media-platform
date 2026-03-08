import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Simple check (use bcrypt in production)
    const passwordMatch = atob(user.passwordHash) === password;
    if (!passwordMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');

    return NextResponse.json({ 
      user: { id: user.id, email: user.email, username: user.username, displayName: user.displayName },
      token 
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error logging in' }, { status: 500 });
  }
}
