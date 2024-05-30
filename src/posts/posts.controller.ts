import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRequest } from './dto/create-request.dto';
import { PostsService } from './posts.service';
import { UpdateRequest } from './dto/update-request.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  postPost(@Body() request: CreateRequest) {
    return this.postsService.writePost(request);
  }

  @Get(':id')
  getPostById(@Param('id') id: number) {
    return this.postsService.getPostById(id);
  }

  @Get()
  getPosts() {
    return this.postsService.getPosts();
  }

  @Patch(':id')
  updatePost(@Param('id') id: number, @Body() request: UpdateRequest) {
    return this.postsService.updatePost(id, request);
  }

  @Delete(':id')
  deletePost(@Param('id') id: number) {
    return this.postsService.deletePost(id);
  }
}
