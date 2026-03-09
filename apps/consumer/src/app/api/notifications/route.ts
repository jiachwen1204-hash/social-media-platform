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

async function ensureNotificationsTable() {
  await sql`CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    type TEXT NOT NULL,
    from_user_id TEXT,
    post_id TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
  )`;
}

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return corsResponse({ message: 'Unauthorized' }, 401);
  }
  
  try {
    await ensureNotificationsTable();
    
    const notifications = await sql`
      SELECT n.*, u.username as "fromUsername", u."displayName" as "fromDisplayName"
      FROM notifications n
      LEFT JOIN users u ON n.from_user_id = u.id
      WHERE n.user_id = ${userId}
      ORDER BY n.created_at DESC
      LIMIT 50
    `;
    
    const unreadResult = await sql`SELECT COUNT(*) as count FROM notifications WHERE user_id = ${userId} AND read = false`;
    const unreadCount = parseInt(unreadResult[0]?.count || '0');
    
    return corsResponse({ notifications, unreadCount });
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

// POST /api/notifications - Create notification (called by other actions)
export async function POST(request: NextRequest) {
  try {
    await ensureNotificationsTable();
    
    const { userId, type, fromUserId, postId } = await request.json();
    
    if (!userId || !type) {
      return corsResponse({ message: 'userId and type required' }, 400);
    }
    
    const id = crypto.randomUUID();
    await sql`
      INSERT INTO notifications(id, user_id, type, from_user_id, post_id, read)
      VALUES(${id}, ${userId}, ${type}, ${fromUserId || null}, ${postId || null}, false)
    `;
    
    return corsResponse({ success: true, id });
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

// PUT /api/notifications - Mark as read
export async function PUT(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return corsResponse({ message: 'Unauthorized' }, 401);
  }
  
  try {
    const { notificationId, markAllRead } = await request.json();
    
    if (markAllRead) {
      await sql`UPDATE notifications SET read = true WHERE user_id = ${userId}`;
      return corsResponse({ success: true });
    }
    
    if (notificationId) {
      await sql`UPDATE notifications SET read = true WHERE id = ${notificationId} AND user_id = ${userId}`;
      return corsResponse({ success: true });
    }
    
    return corsResponse({ message: 'notificationId or markAllRead required' }, 400);
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

export async function OPTIONS() {
  return corsResponse({}, 204);
}
