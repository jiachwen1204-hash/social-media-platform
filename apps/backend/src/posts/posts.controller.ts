import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/posts')
export class PostsController {
  constructor(private posts: PostsService) {}

  @Get()
  async feed() {
    return this.posts.feed();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() body: { content: string }) {
    return this.posts.create(req.user.sub, body.content);
  }
}
