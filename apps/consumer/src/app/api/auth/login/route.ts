import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Mock response for demo
    const user = { id: '1', email, username: email.split('@')[0], displayName: 'Demo User' };
    const token = 'demo-token-' + Date.now();

    return NextResponse.json({ user, token });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
