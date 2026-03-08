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

    // Get total counts
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    const postCount = await sql`SELECT COUNT(*) as count FROM posts`;
    const publishedPostCount = await sql`SELECT COUNT(*) as count FROM posts WHERE published = true`;

    // Get user growth (last 7 days)
    const userGrowth = await sql`
      SELECT DATE("createdAt") as date, COUNT(*) as count 
      FROM users 
      WHERE "createdAt" >= NOW() - INTERVAL '7 days'
      GROUP BY DATE("createdAt")
      ORDER BY date
    `;

    // Get post growth (last 7 days)
    const postGrowth = await sql`
      SELECT DATE("createdAt") as date, COUNT(*) as count 
      FROM posts 
      WHERE "createdAt" >= NOW() - INTERVAL '7 days'
      GROUP BY DATE("createdAt")
      ORDER BY date
    `;

    // Get role distribution
    const roleDistribution = await sql`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `;

    return NextResponse.json({
      totalUsers: parseInt(userCount[0]?.count || '0'),
      totalPosts: parseInt(postCount[0]?.count || '0'),
      publishedPosts: parseInt(publishedPostCount[0]?.count || '0'),
      userGrowth: userGrowth.map((r: any) => ({ date: r.date, count: parseInt(r.count) })),
      postGrowth: postGrowth.map((r: any) => ({ date: r.date, count: parseInt(r.count) })),
      roleDistribution: roleDistribution.map((r: any) => ({ role: r.role, count: parseInt(r.count) }))
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}
