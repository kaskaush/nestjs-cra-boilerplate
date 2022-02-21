import { Controller, Get, Logger } from '@nestjs/common';
import PostsService from '../services/posts.service';
import { ApiTags } from '@nestjs/swagger';
import Post from '../entities/post.entity';

@Controller('/v1/posts')
@ApiTags('posts')
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  private readonly logger = new Logger(PostsController.name);

  @Get()
  async getAllPosts(): Promise<Post[]> {
    this.logger.log('Received request to get all posts.');
    const posts = await this.postsService.findAll();
    return posts;
  }
}
