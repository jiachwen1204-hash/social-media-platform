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
      payload = JSON.parse(Buffer.from(token, 'base64').toString());
    } else if (parts.length === 2) {
      payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    } else if (parts.length === 3) {
      payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    }
    return payload?.userId || null;
  } catch (e) {}
  return null;
}

// GET /api/users/:id - Get user profile
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserId(request);
    const targetId = params.id;
    
    const result = await sql`SELECT id, username, "displayName", avatar, bio FROM users WHERE id = ${targetId}`;
    
    if (result.length === 0) {
      return corsResponse({ message: 'User not found' }, 404);
    }
    
    return corsResponse({ user: result[0] });
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

// PUT /api/users/:id - Update user profile
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(request);
  if (!userId) {
    return corsResponse({ message: 'Unauthorized' }, 401);
  }
  
  if (userId !== params.id) {
    return corsResponse({ message: 'Forbidden' }, 403);
  }
  
  try {
    const { avatar, displayName, bio } = await request.json();
    
    // Add avatar column if not exists
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT`;
    } catch (e) {}
    
    if (avatar !== undefined) {
      await sql`UPDATE users SET avatar = ${avatar} WHERE id = ${userId}`;
    }
    if (displayName !== undefined) {
      await sql`UPDATE users SET "displayName" = ${displayName} WHERE id = ${userId}`;
    }
    if (bio !== undefined) {
      await sql`UPDATE users SET bio = ${bio} WHERE id = ${userId}`;
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
