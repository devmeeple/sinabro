import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateRequest } from './dto/create-request.dto';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  @Post()
  postPost(@Body() request: CreateRequest) {
    this.logger.log(request);
  }
}
