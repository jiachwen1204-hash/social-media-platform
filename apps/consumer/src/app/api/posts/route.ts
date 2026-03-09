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

// GET /api/posts - List all posts with like count and user like status
export async function GET(request: NextRequest) {
  try {
    // Create likes table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS post_likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "postId" UUID NOT NULL,
        "userId" UUID NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        UNIQUE("postId", "userId")
      )
    `;

    const userId = getUserIdFromToken(request.headers.get('authorization'));
    
    const posts = await sql`
      SELECT p.id, p.content, p.published, p."createdAt", p."updatedAt",
             u.id as user_id, u.username, u."displayName"
      FROM posts p
      JOIN users u ON p."userId" = u.id
      WHERE p.published = true
      ORDER BY p."createdAt" DESC
      LIMIT 20
    `;
    
    // Get like counts and user likes separately
    const postsWithLikes = await Promise.all(posts.map(async (p: any) => {
      const countResult = await sql`SELECT COUNT(*) as count FROM post_likes WHERE "postId" = ${p.id}`;
      const likeCount = parseInt(countResult[0]?.count || '0');
      
      let liked = false;
      if (userId) {
        const likedResult = await sql`SELECT id FROM post_likes WHERE "postId" = ${p.id} AND "userId" = ${userId}`;
        liked = likedResult.length > 0;
      }
      
      return {
        id: p.id,
        content: p.content,
        published: p.published,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        likes: likeCount,
        liked,
        user: { id: p.user_id, username: p.username, displayName: p.displayName }
      };
    }));
    
    return corsResponse(postsWithLikes);
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

// POST /api/posts - Create new post OR like a post (based on action query param)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = getUserIdFromToken(authHeader);
    
    if (!userId) {
      return corsResponse({ message: 'Unauthorized' }, 401);
    }

    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const postId = url.searchParams.get('postId');

    // Like action
    if (action === 'like' && postId) {
      // Check if like exists
      const existingLike = await sql`
        SELECT id FROM post_likes WHERE "postId" = ${postId} AND "userId" = ${userId}
      `;

      if (existingLike.length > 0) {
        // Unlike
        await sql`DELETE FROM post_likes WHERE "postId" = ${postId} AND "userId" = ${userId}`;
        const countResult = await sql`SELECT COUNT(*) as count FROM post_likes WHERE "postId" = ${postId}`;
        return corsResponse({ liked: false, likes: parseInt(countResult[0]?.count || '0') });
      } else {
        // Like
        await sql`INSERT INTO post_likes("postId", "userId") VALUES(${postId}, ${userId})`;
        const countResult = await sql`SELECT COUNT(*) as count FROM post_likes WHERE "postId" = ${postId}`;
        return corsResponse({ liked: true, likes: parseInt(countResult[0]?.count || '0') });
      }
    }

    // Create post action (default)
    const { content } = await request.json();
    if (!content?.trim()) {
      return corsResponse({ message: 'Content is required' }, 400);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await sql`INSERT INTO posts(id, content, "userId", published, "createdAt", "updatedAt") VALUES(${id}, ${content}, ${userId}, true, ${now}, ${now})`;
    
    const userResult = await sql`SELECT id, username, "displayName" FROM users WHERE id = ${userId}`;
    const user = userResult[0];
    
    return corsResponse({ 
      id, content, userId, published: true, createdAt: now, updatedAt: now, likes: 0, liked: false,
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
