import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email, username, displayName, password } = await request.json();
    
    // Check existing
    const existing = await sql`SELECT id FROM users WHERE email = ${email} OR username = ${username}`;
    if (existing.length > 0) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }
    
    const id = generateId();
    const passwordHash = Buffer.from(password).toString('base64');
    await sql`
      INSERT INTO users(id, email, username, "displayName", "passwordHash") 
      VALUES(${id}, ${email}, ${username}, ${displayName}, ${passwordHash})
    `;
    
    const token = Buffer.from(JSON.stringify({ userId: id })).toString('base64');
    return NextResponse.json({ 
      user: { id, email, username, displayName },
      token 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}
