import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    const result = await sql`SELECT id, email, username, "displayName", "passwordHash" FROM users WHERE email = ${email}`;
    if (result.length === 0) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    
    const user = result[0];
    if (Buffer.from(user.passwordHash, 'base64').toString() !== password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');
    return NextResponse.json({ 
      user: { id: user.id, email: user.email, username: user.username, displayName: user.displayName },
      token 
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}
