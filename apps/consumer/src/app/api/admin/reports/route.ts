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

// Create tables if not exist
async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS reports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "reporterId" UUID NOT NULL,
      "reportedUserId" UUID,
      "postId" UUID,
      category VARCHAR(50) NOT NULL,
      description TEXT,
      status VARCHAR(20) DEFAULT 'PENDING',
      "resolvedBy" UUID,
      "resolution" TEXT,
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP DEFAULT NOW()
    )
  `;
  
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

    const reports = await sql`
      SELECT r.id::text, r.category, r.description, r.status, r."createdAt",
             u1.username as "reporterUsername", u1."displayName" as "reporterDisplayName",
             u2.username as "reportedUsername", u2."displayName" as "reportedDisplayName",
             p.content as "postContent"
      FROM reports r
      LEFT JOIN users u1 ON r."reporterId" = u1.id::uuid
      LEFT JOIN users u2 ON r."reportedUserId" = u2.id::uuid
      LEFT JOIN posts p ON r."postId" = p.id::uuid
      ORDER BY r."createdAt" DESC
      LIMIT 50
    `;

    return NextResponse.json(reports);
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

    await ensureTables();

    const { reportedUserId, postId, category, description } = await request.json();

    await sql`
      INSERT INTO reports("reporterId", "reportedUserId", "postId", category, description)
      VALUES(${userId}::uuid, ${reportedUserId}::uuid, ${postId}::uuid, ${category}, ${description})
    `;

    return NextResponse.json({ success: true }, { status: 201 });
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

    const userResult = await sql`SELECT role FROM users WHERE id = ${userId}`;
    if (userResult.length === 0 || userResult[0].role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden: Admin only' }, { status: 403 });
    }

    const { reportId, status, resolution } = await request.json();

    await sql`
      UPDATE reports 
      SET status = ${status}, "resolvedBy" = ${userId}::uuid, "resolution" = ${resolution}, "updatedAt" = NOW()
      WHERE id = ${reportId}::uuid
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}
