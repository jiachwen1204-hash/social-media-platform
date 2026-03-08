import { NextRequest, NextResponse } from 'next/server';

const users = globalThis as any;
if (!users._demoUsers) users._demoUsers = new Map();
if (!users._demoPosts) users._demoPosts = [];
let userIdCounter = users._demoUserIdCounter || 1;
let postIdCounter = users._demoPostIdCounter || 1;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    const user = [...users._demoUsers.values()].find((u: any) => u.email === email);
    if (!user || user.password !== password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');
    return NextResponse.json({ 
      user: { id: user.id, email: user.email, username: user.username, displayName: user.displayName },
      token 
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
