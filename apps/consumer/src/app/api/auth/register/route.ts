import { NextRequest, NextResponse } from 'next/server';

// Shared in-memory storage
const users = globalThis as any;
if (!users._demoUsers) users._demoUsers = new Map();
if (!users._demoPosts) users._demoPosts = [];
let userIdCounter = users._demoUserIdCounter || 1;
let postIdCounter = users._demoPostIdCounter || 1;

export async function POST(request: NextRequest) {
  try {
    const { email, username, displayName, password } = await request.json();
    
    // Check existing
    const existingEmail = [...users._demoUsers.values()].find((u: any) => u.email === email);
    const existingUser = [...users._demoUsers.values()].find((u: any) => u.username === username);
    if (existingEmail || existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }
    
    const user = { id: String(userIdCounter++), email, username, displayName, password };
    users._demoUsers.set(user.id, user);
    
    const token = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');
    users._demoUserIdCounter = userIdCounter;
    return NextResponse.json({ 
      user: { id: user.id, email, username, displayName },
      token 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
