import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: {
          select: { id: true, username: true, displayName: true },
        },
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Decode simple token
    const token = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString();
    const { userId } = JSON.parse(token);

    const { content } = await request.json();

    const post = await prisma.post.create({
      data: { content, userId, published: true },
      include: {
        user: { select: { id: true, username: true, displayName: true } },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating post' }, { status: 500 });
  }
}
