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

export async function GET() {
  try {
    const posts = await sql`
      SELECT p.id, p.content, p.published, p."createdAt", p."updatedAt",
             u.id as user_id, u.username, u."displayName"
      FROM posts p
      JOIN users u ON p."userId" = u.id
      WHERE p.published = true
      ORDER BY p."createdAt" DESC
      LIMIT 20
    `;
    return NextResponse.json(posts.map((p: any) => ({
      id: p.id, content: p.content, published: p.published, createdAt: p.createdAt, updatedAt: p.updatedAt,
      user: { id: p.user_id, username: p.username, displayName: p.displayName }
    })));
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString();
    const { userId } = JSON.parse(token);
    const { content } = await request.json();

    const id = generateId();
    const now = new Date().toISOString();
    await sql`INSERT INTO posts(id, content, "userId", published, "createdAt", "updatedAt") VALUES(${id}, ${content}, ${userId}, true, ${now}, ${now})`;
    
    const userResult = await sql`SELECT id, username, "displayName" FROM users WHERE id = ${userId}`;
    const user = userResult[0];
    
    return NextResponse.json({ 
      id, content, userId, published: true, createdAt: now, updatedAt: now,
      user: { id: user.id, username: user.username, displayName: user.displayName }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}
