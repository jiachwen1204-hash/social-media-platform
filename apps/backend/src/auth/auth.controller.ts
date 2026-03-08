import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
@Controller('api/auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('register') register(@Body() b: any) { return this.auth.register(b.email, b.username, b.displayName, b.password); }
  @Post('login') login(@Body() b: any) { return this.auth.login(b.email, b.password); }
}
