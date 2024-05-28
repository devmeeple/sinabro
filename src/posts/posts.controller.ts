import { Body, Controller, Logger, Post } from '@nestjs/common';
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
}
