import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  async register(email: string, username: string, displayName: string, password: string) {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });
    
    if (existing) {
      throw new ConflictException('User with this email or username already exists');
    }

    const user = await prisma.user.create({
      data: {
        email,
        username,
        displayName,
        passwordHash: await bcrypt.hash(password, 10),
      },
    });

    return {
      user: { id: user.id, email: user.email, username: user.username, displayName: user.displayName },
      token: this.jwt.sign({ sub: user.id }),
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: { id: user.id, email: user.email, username: user.username, displayName: user.displayName },
      token: this.jwt.sign({ sub: user.id }),
    };
  }
}
