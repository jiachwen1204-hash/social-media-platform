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
    const { email, username, displayName, password } = await request.json();
    
    const existing = await sql`SELECT id FROM users WHERE email = ${email} OR username = ${username}`;
    if (existing.length > 0) {
      return corsResponse({ message: 'User already exists' }, 400);
    }
    
    const id = crypto.randomUUID();
    const passwordHash = Buffer.from(password).toString('base64');
    await sql`
      INSERT INTO users(id, email, username, "displayName", "passwordHash") 
      VALUES(${id}, ${email}, ${username}, ${displayName}, ${passwordHash})
    `;
    
    const token = Buffer.from(JSON.stringify({ userId: id })).toString('base64');
    return corsResponse({ 
      user: { id, email, username, displayName },
      token 
    }, 201);
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

export async function OPTIONS() {
  return corsResponse({}, 204);
}
