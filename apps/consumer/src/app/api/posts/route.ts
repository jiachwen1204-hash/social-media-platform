import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: { select: { id: true, username: true, displayName: true } },
      },
    });
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString();
    const { userId } = JSON.parse(token);
    const { content } = await request.json();

    const post = await prisma.post.create({
      data: { content, userId, published: true },
      include: { user: { select: { id: true, username: true, displayName: true } } },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}
