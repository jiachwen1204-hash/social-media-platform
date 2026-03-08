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

    const users = await sql`
      SELECT id, email, username, "displayName", role, "createdAt"
      FROM users
      ORDER BY "createdAt" DESC
      LIMIT 100
    `;

    return NextResponse.json(users);
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

    const { targetUserId, role, banned } = await request.json();
    
    if (role) {
      await sql`UPDATE users SET role = ${role} WHERE id = ${targetUserId}`;
    }
    
    if (typeof banned === 'boolean') {
      // For now, ban is stored in role field
      const newRole = banned ? 'BANNED' : 'USER';
      await sql`UPDATE users SET role = ${newRole} WHERE id = ${targetUserId}`;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}
