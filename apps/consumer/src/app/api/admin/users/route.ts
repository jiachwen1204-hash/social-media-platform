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

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request.headers.get('authorization'));
    if (!userId) {
      return corsResponse({ message: 'Unauthorized' }, 401);
    }

    const userResult = await sql`SELECT role FROM users WHERE id = ${userId}`;
    if (userResult.length === 0 || userResult[0].role !== 'ADMIN') {
      return corsResponse({ message: 'Forbidden: Admin only' }, 403);
    }

    const users = await sql`
      SELECT id, email, username, "displayName", role, "createdAt"
      FROM users
      ORDER BY "createdAt" DESC
      LIMIT 100
    `;

    return corsResponse(users);
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request.headers.get('authorization'));
    if (!userId) {
      return corsResponse({ message: 'Unauthorized' }, 401);
    }

    const adminResult = await sql`SELECT role FROM users WHERE id = ${userId}`;
    if (adminResult.length === 0 || adminResult[0].role !== 'ADMIN') {
      return corsResponse({ message: 'Forbidden: Admin only' }, 403);
    }

    const { targetUserId, role, banned } = await request.json();
    
    if (role) {
      await sql`UPDATE users SET role = ${role} WHERE id = ${targetUserId}`;
    }
    
    if (typeof banned === 'boolean') {
      const newRole = banned ? 'BANNED' : 'USER';
      await sql`UPDATE users SET role = ${newRole} WHERE id = ${targetUserId}`;
    }

    return corsResponse({ success: true });
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

export async function OPTIONS() {
  return corsResponse({}, 204);
}
