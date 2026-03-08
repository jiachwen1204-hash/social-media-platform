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

async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS user_warnings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" UUID NOT NULL,
      "warningBy" UUID NOT NULL,
      reason TEXT NOT NULL,
      "createdAt" TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request.headers.get('authorization'));
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userResult = await sql`SELECT role FROM users WHERE id = ${userId}`;
    if (userResult.length === 0 || userResult[0].role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden: Admin only' }, { status: 403 });
    }

    await ensureTables();

    const warnings = await sql`
      SELECT w.id::text, w.reason, w."createdAt",
             u.id as "userId", u.username, u."displayName"
      FROM user_warnings w
      JOIN users u ON w."userId" = u.id::uuid
      ORDER BY w."createdAt" DESC
      LIMIT 50
    `;

    return NextResponse.json(warnings);
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request.headers.get('authorization'));
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userResult = await sql`SELECT role FROM users WHERE id = ${userId}`;
    if (userResult.length === 0 || userResult[0].role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden: Admin only' }, { status: 403 });
    }

    await ensureTables();

    const { targetUserId, reason } = await request.json();

    await sql`
      INSERT INTO user_warnings("userId", "warningBy", reason)
      VALUES(${targetUserId}::uuid, ${userId}::uuid, ${reason})
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}
