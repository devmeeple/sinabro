import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { CreateRequest } from './dto/create-request.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  private readonly logger = new Logger(PostsController.name);

  @Post()
  postPost(@Body() request: CreateRequest) {
    return this.postsService.writePost(request);
  }

  @Get(':id')
  getPostById(@Param('id') id: number) {
    return this.postsService.getPostById(id);
  }
}
