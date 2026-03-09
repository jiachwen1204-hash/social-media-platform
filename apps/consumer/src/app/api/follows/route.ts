import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

function corsResponse(data: any, status: number = 200) {
  const response = NextResponse.json(data, { status });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

function getUserId(request: NextRequest): string | null {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  
  try {
    const token = auth.replace('Bearer ', '');
    const parts = token.split('.');
    // Handle both JWT (3 parts) and simple token (1 part base64)
    let payload;
    if (parts.length === 1) {
      // Simple token - just decode the whole thing
      payload = JSON.parse(Buffer.from(token, 'base64').toString());
    } else if (parts.length === 2) {
      // Our simple JWT format
      payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    } else if (parts.length === 3) {
      // Standard JWT
      payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    }
    return payload?.userId || null;
  } catch (e) {
    console.error('Token parse error:', e);
  }
  return null;
}

// Create follows table if not exists
async function ensureFollowsTable() {
  await sql`CREATE TABLE IF NOT EXISTS follows (
    follower_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    following_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
  )`;
}

// POST /api/follows - Follow a user
export async function POST(request: NextRequest) {
  const auth = request.headers.get('Authorization');
  console.log('Auth header:', auth);
  
  const userId = getUserId(request);
  console.log('UserId:', userId);
  
  if (!userId) {
    return corsResponse({ message: 'Unauthorized', debug: auth }, 401);
  }
  
  try {
    await ensureFollowsTable();
    
    const { userId: targetUserId } = await request.json();
    
    if (!targetUserId) {
      return corsResponse({ message: 'User ID required' }, 400);
    }
    
    if (userId === targetUserId) {
      return corsResponse({ message: 'Cannot follow yourself' }, 400);
    }
    
    // Check if already following
    const existing = await sql`SELECT * FROM follows WHERE follower_id = ${userId} AND following_id = ${targetUserId}`;
    
    if (existing.length > 0) {
      return corsResponse({ message: 'Already following' }, 400);
    }
    
    await sql`INSERT INTO follows(follower_id, following_id) VALUES(${userId}, ${targetUserId})`;
    
    return corsResponse({ success: true, following: true });
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

// DELETE /api/follows - Unfollow a user
export async function DELETE(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return corsResponse({ message: 'Unauthorized' }, 401);
  }
  
  try {
    const { userId: targetUserId } = await request.json();
    
    if (!targetUserId) {
      return corsResponse({ message: 'User ID required' }, 400);
    }
    
    await sql`DELETE FROM follows WHERE follower_id = ${userId} AND following_id = ${targetUserId}`;
    
    return corsResponse({ success: true, following: false });
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

// GET /api/follows?userId=xxx - Get follow status
export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  const targetUserId = request.nextUrl.searchParams.get('userId');
  
  if (!targetUserId) {
    return corsResponse({ message: 'User ID required' }, 400);
  }
  
  try {
    await ensureFollowsTable();
    
    let following = false;
    let followersCount = 0;
    let followingCount = 0;
    
    if (userId) {
      const existing = await sql`SELECT * FROM follows WHERE follower_id = ${userId} AND following_id = ${targetUserId}`;
      following = existing.length > 0;
    }
    
    // Get counts
    const followers = await sql`SELECT COUNT(*) as count FROM follows WHERE following_id = ${targetUserId}`;
    const following_ = await sql`SELECT COUNT(*) as count FROM follows WHERE follower_id = ${targetUserId}`;
    followersCount = parseInt(followers[0]?.count || '0');
    followingCount = parseInt(following_[0]?.count || '0');
    
    return corsResponse({ 
      following, 
      followersCount, 
      followingCount 
    });
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

export async function OPTIONS() {
  return corsResponse({}, 204);
}
