import { NextRequest, NextResponse } from 'next/server';

// Shared in-memory storage
const users = globalThis as any;
if (!users._demoUsers) users._demoUsers = new Map();
if (!users._demoPosts) users._demoPosts = [];
let userIdCounter = users._demoUserIdCounter || 1;
let postIdCounter = users._demoPostIdCounter || 1;

export async function GET() {
  return NextResponse.json(users._demoPosts);
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString();
    const { userId } = JSON.parse(token);
    const { content } = await request.json();

    const post = { 
      id: String(postIdCounter++), 
      content, 
      userId,
      createdAt: new Date().toISOString(),
      user: { id: userId, username: 'user', displayName: 'User' }
    };
    users._demoPosts.unshift(post);
    users._demoUserIdCounter = userIdCounter;
    users._demoPostIdCounter = postIdCounter;

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
