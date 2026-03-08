import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}
  private users: any[] = [];
  async register(email: string, username: string, displayName: string, password: string) {
    if (this.users.find(u => u.email === email || u.username === username)) throw new ConflictException('exists');
    const user = { id: Date.now().toString(), email, username, displayName, passwordHash: await bcrypt.hash(password, 10) };
    this.users.push(user);
    return { user: { ...user, passwordHash: undefined }, token: this.jwt.sign({ sub: user.id }) };
  }
  async login(email: string, password: string) {
    const user = this.users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new UnauthorizedException('invalid');
    return { user: { ...user, passwordHash: undefined }, token: this.jwt.sign({ sub: user.id }) };
  }
}
