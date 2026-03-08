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

    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    const postCount = await sql`SELECT COUNT(*) as count FROM posts`;
    const publishedPostCount = await sql`SELECT COUNT(*) as count FROM posts WHERE published = true`;

    const userGrowth = await sql`
      SELECT DATE("createdAt") as date, COUNT(*) as count 
      FROM users 
      WHERE "createdAt" >= NOW() - INTERVAL '7 days'
      GROUP BY DATE("createdAt")
      ORDER BY date
    `;

    const postGrowth = await sql`
      SELECT DATE("createdAt") as date, COUNT(*) as count 
      FROM posts 
      WHERE "createdAt" >= NOW() - INTERVAL '7 days'
      GROUP BY DATE("createdAt")
      ORDER BY date
    `;

    const roleDistribution = await sql`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `;

    return corsResponse({
      totalUsers: parseInt(userCount[0]?.count || '0'),
      totalPosts: parseInt(postCount[0]?.count || '0'),
      publishedPosts: parseInt(publishedPostCount[0]?.count || '0'),
      userGrowth: userGrowth.map((r: any) => ({ date: r.date, count: parseInt(r.count) })),
      postGrowth: postGrowth.map((r: any) => ({ date: r.date, count: parseInt(r.count) })),
      roleDistribution: roleDistribution.map((r: any) => ({ role: r.role, count: parseInt(r.count) }))
    });
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

export async function OPTIONS() {
  return corsResponse({}, 204);
}
