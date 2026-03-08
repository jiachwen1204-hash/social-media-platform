import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, username, displayName, password } = await request.json();
    
    // Mock response for demo
    const user = { id: Date.now().toString(), email, username, displayName };
    const token = 'demo-token-' + Date.now();

    return NextResponse.json({ user, token }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
