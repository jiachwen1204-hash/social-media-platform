import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Mock posts for demo
  const posts = [
    { id: '1', content: 'Welcome to SocialHub! This is a demo post.', createdAt: new Date().toISOString(), user: { id: '1', username: 'demo', displayName: 'Demo User' } },
    { id: '2', content: 'Connect with friends and share moments.', createdAt: new Date().toISOString(), user: { id: '2', username: 'admin', displayName: 'Admin' } },
  ];
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const { content } = await request.json();
    
    const post = { 
      id: Date.now().toString(), 
      content, 
      createdAt: new Date().toISOString(), 
      user: { id: '1', username: 'user', displayName: 'User' } 
    };
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating post' }, { status: 500 });
  }
}
