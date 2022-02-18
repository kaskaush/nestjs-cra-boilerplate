import { Controller, Get } from '@nestjs/common';
import PostsService from '../services/posts.service';
import { ApiTags } from '@nestjs/swagger';
import Post from '../entities/post.entity';

@Controller('/v1/posts')
@ApiTags('posts')
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAllPosts(): Promise<Post[]> {
    const posts = await this.postsService.findAll();
    return posts;
  }
}
