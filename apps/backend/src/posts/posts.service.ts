import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class PostsService {
  async create(userId: string, content: string) {
    return prisma.post.create({
      data: {
        content,
        userId,
        published: true,
      },
      include: {
        user: {
          select: { id: true, username: true, displayName: true },
        },
      },
    });
  }

  async feed(limit = 20) {
    return prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: { id: true, username: true, displayName: true },
        },
      },
    });
  }

  async getByUser(userId: string) {
    return prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
