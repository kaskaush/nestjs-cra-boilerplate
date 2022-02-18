import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostsService from '../services/posts.service';
import PostsController from '../controllers/posts.controller';
import Post from '../entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostsService],
  controllers: [PostsController],
})
export default class PostsModule {}
