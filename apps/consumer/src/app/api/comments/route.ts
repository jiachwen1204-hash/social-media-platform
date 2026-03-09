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

function getUserIdFromToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  try {
    const token = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString();
    return JSON.parse(token).userId;
  } catch {
    return null;
  }
}

// GET /api/comments?postId=xxx - Get comments for a post
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');
    
    if (!postId) {
      return corsResponse({ message: 'postId required' }, 400);
    }

    // Create comments table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS post_comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "postId" UUID NOT NULL,
        "userId" UUID NOT NULL,
        content TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW()
      )
    `;

    const comments = await sql`
      SELECT c.id::text as id, c.content, c."createdAt"::text as "createdAt",
             u.id::text as user_id, u.username, u."displayName"
      FROM post_comments c
      JOIN users u ON c."userId" = u.id::uuid
      WHERE c."postId"::text = ${postId}
      ORDER BY c."createdAt" DESC
      LIMIT 50
    `;

    return corsResponse(comments.map((c: any) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      user: { id: c.user_id, username: c.username, displayName: c.displayName }
    })));
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

// POST /api/comments - Add comment to a post
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = getUserIdFromToken(authHeader);
    
    if (!userId) {
      return corsResponse({ message: 'Unauthorized' }, 401);
    }

    const { postId, content } = await request.json();
    
    if (!postId || !content?.trim()) {
      return corsResponse({ message: 'postId and content required' }, 400);
    }

    // Create comments table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS post_comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "postId" UUID NOT NULL,
        "userId" UUID NOT NULL,
        content TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW()
      )
    `;

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await sql`INSERT INTO post_comments(id, "postId", "userId", content, "createdAt") VALUES(${id}::uuid, ${postId}::uuid, ${userId}::uuid, ${content}, ${now}::timestamp)`;
    
    const userResult = await sql`SELECT id::text as id, username, "displayName" FROM users WHERE id = ${userId}::uuid`;
    const user = userResult[0];
    
    return corsResponse({ 
      id, content, postId, createdAt: now,
      user: { id: user.id, username: user.username, displayName: user.displayName }
    }, 201);
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

export async function OPTIONS() {
  return corsResponse({}, 204);
}
