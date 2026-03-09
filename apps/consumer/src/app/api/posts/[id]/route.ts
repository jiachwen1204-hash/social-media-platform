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

// POST /api/posts/[id]/like - Toggle like on a post
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = getUserIdFromToken(authHeader);
    
    if (!userId) {
      return corsResponse({ message: 'Unauthorized' }, 401);
    }

    // Get post ID from URL
    const url = new URL(request.url);
    const postId = url.pathname.split('/').filter(Boolean).pop();

    if (!postId) {
      return corsResponse({ message: 'Post ID required' }, 400);
    }

    // Check if like exists
    const existingLike = await sql`
      SELECT id FROM post_likes WHERE "postId" = ${postId} AND "userId" = ${userId}
    `;

    if (existingLike.length > 0) {
      // Unlike - remove the like
      await sql`
        DELETE FROM post_likes WHERE "postId" = ${postId} AND "userId" = ${userId}
      `;
      
      const countResult = await sql`SELECT COUNT(*) as count FROM post_likes WHERE "postId" = ${postId}`;
      const likeCount = parseInt(countResult[0]?.count || '0');
      
      return corsResponse({ liked: false, likes: likeCount });
    } else {
      // Like - add the like
      await sql`
        INSERT INTO post_likes("postId", "userId") VALUES(${postId}, ${userId})
      `;
      
      const countResult = await sql`SELECT COUNT(*) as count FROM post_likes WHERE "postId" = ${postId}`;
      const likeCount = parseInt(countResult[0]?.count || '0');
      
      return corsResponse({ liked: true, likes: likeCount });
    }
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

// GET /api/posts/[id]/like - Check if user liked a post
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = getUserIdFromToken(authHeader);
    
    const url = new URL(request.url);
    const postId = url.pathname.split('/').filter(Boolean).pop();

    if (!postId) {
      return corsResponse({ message: 'Post ID required' }, 400);
    }

    const countResult = await sql`SELECT COUNT(*) as count FROM post_likes WHERE "postId" = ${postId}`;
    const likeCount = parseInt(countResult[0]?.count || '0');

    let liked = false;
    if (userId) {
      const existingLike = await sql`
        SELECT id FROM post_likes WHERE "postId" = ${postId} AND "userId" = ${userId}
      `;
      liked = existingLike.length > 0;
    }

    return corsResponse({ likes: likeCount, liked });
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

export async function OPTIONS() {
  return corsResponse({}, 204);
}
