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

async function ensureTables() {
  await sql`CREATE TABLE IF NOT EXISTS conversations (id TEXT PRIMARY KEY, created_at TIMESTAMP DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS conversation_participants (conversation_id TEXT, user_id TEXT, PRIMARY KEY (conversation_id, user_id))`;
  await sql`CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, conversation_id TEXT, sender_id TEXT, content TEXT, created_at TIMESTAMP DEFAULT NOW())`;
}

// GET /api/messages - Get conversations OR messages in a conversation
export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return corsResponse({ message: 'Unauthorized' }, 401);
  }
  
  const conversationId = request.nextUrl.searchParams.get('conversationId');
  
  try {
    await ensureTables();
    
    // Get messages in a conversation
    if (conversationId) {
      const participant = await sql`SELECT * FROM conversation_participants WHERE conversation_id = ${conversationId} AND user_id = ${userId}`;
      if (participant.length === 0) {
        return corsResponse({ message: 'Not a participant' }, 403);
      }
      
      const messages = await sql`
        SELECT m.*, u.username, u."displayName"
        FROM messages m
        LEFT JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = ${conversationId}
        ORDER BY m.created_at ASC
        LIMIT 100
      `;
      
      return corsResponse({ messages });
    }
    
    // Get user's conversations
    const conversations = await sql`
      SELECT c.id, c.created_at, 
             cp.user_id as "otherUserId", u.username as "otherUsername", u."displayName" as "otherDisplayName"
      FROM conversations c
      JOIN conversation_participants cp ON c.id = cp.conversation_id AND cp.user_id != ${userId}
      LEFT JOIN users u ON cp.user_id = u.id
      WHERE c.id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = ${userId})
      ORDER BY c.created_at DESC
    `;
    
    return corsResponse({ conversations });
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

// POST /api/messages - Start conversation or send message
export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return corsResponse({ message: 'Unauthorized' }, 401);
  }
  
  try {
    await ensureTables();
    
    const { recipientId, conversationId, content } = await request.json();
    
    // Start new conversation
    if (recipientId && !conversationId) {
      const convId = crypto.randomUUID();
      await sql`INSERT INTO conversations(id) VALUES(${convId})`;
      await sql`INSERT INTO conversation_participants(conversation_id, user_id) VALUES(${convId}, ${userId})`;
      await sql`INSERT INTO conversation_participants(conversation_id, user_id) VALUES(${convId}, ${recipientId})`;
      
      if (content) {
        const msgId = crypto.randomUUID();
        await sql`INSERT INTO messages(id, conversation_id, sender_id, content) VALUES(${msgId}, ${convId}, ${userId}, ${content})`;
      }
      
      return corsResponse({ conversationId: convId });
    }
    
    // Send message to existing conversation
    if (conversationId && content) {
      const msgId = crypto.randomUUID();
      await sql`INSERT INTO messages(id, conversation_id, sender_id, content) VALUES(${msgId}, ${conversationId}, ${userId}, ${content})`;
      return corsResponse({ messageId: msgId });
    }
    
    return corsResponse({ message: 'recipientId or conversationId required' }, 400);
  } catch (error: any) {
    console.error('Error:', error);
    return corsResponse({ message: error.message || 'Error' }, 500);
  }
}

export async function OPTIONS() {
  return corsResponse({}, 204);
}
