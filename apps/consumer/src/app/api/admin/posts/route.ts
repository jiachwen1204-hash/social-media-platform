import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

function getUserIdFromToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  try {
    const token = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString();
    return JSON.parse(token).userId;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request.headers.get('authorization'));
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const userResult = await sql`SELECT role FROM users WHERE id = ${userId}`;
    if (userResult.length === 0 || userResult[0].role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden: Admin only' }, { status: 403 });
    }

    const posts = await sql`
      SELECT p.id, p.content, p.published, p."createdAt", p."updatedAt",
             u.id as user_id, u.username, u."displayName", u.role as user_role
      FROM posts p
      JOIN users u ON p."userId" = u.id
      ORDER BY p."createdAt" DESC
      LIMIT 100
    `;

    return NextResponse.json(posts.map((p: any) => ({
      id: p.id, content: p.content, published: p.published, createdAt: p.createdAt, updatedAt: p.updatedAt,
      user: { id: p.user_id, username: p.username, displayName: p.displayName, role: p.user_role }
    })));
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request.headers.get('authorization'));
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const adminResult = await sql`SELECT role FROM users WHERE id = ${userId}`;
    if (adminResult.length === 0 || adminResult[0].role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden: Admin only' }, { status: 403 });
    }

    const { postId } = await request.json();
    await sql`DELETE FROM posts WHERE id = ${postId}`;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request.headers.get('authorization'));
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const adminResult = await sql`SELECT role FROM users WHERE id = ${userId}`;
    if (adminResult.length === 0 || adminResult[0].role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden: Admin only' }, { status: 403 });
    }

    const { postId, published } = await request.json();
    await sql`UPDATE posts SET published = ${published} WHERE id = ${postId}`;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}
