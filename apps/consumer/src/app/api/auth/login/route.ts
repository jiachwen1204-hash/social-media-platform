import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    const result = await sql`SELECT id, email, username, "displayName", "passwordHash" FROM users WHERE email = ${email}`;
    if (result.length === 0) {
      return corsResponse({ message: 'Invalid credentials' }, 401);
    }
    
    const user = result[0];
    if (Buffer.from(user.passwordHash, 'base64').toString() !== password) {
      return corsResponse({ message: 'Invalid credentials' }, 401);
    }

    const token = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');
    return corsResponse({ 
      user: { id: user.id, email: user.email, username: user.username, displayName: user.displayName },
      token 
    });
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

export async function OPTIONS() {
  return corsResponse({}, 204);
}
