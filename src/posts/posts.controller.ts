import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRequest } from './dto/create-request.dto';
import { PostsService } from './posts.service';
import { UpdateRequest } from './dto/update-request.dto';
import { PaginatePost } from './dto/paginate-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  postPost(@Body() request: CreateRequest) {
    return this.postsService.writePost(request);
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Get()
  getPostsWithPagination(@Query() pageNation: PaginatePost) {
    return this.postsService.getPostsWithPagination(pageNation);
  }

  @Patch(':id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateRequest,
  ) {
    return this.postsService.updatePost(id, request);
  }

  @Delete(':id')
  deletePost(@Param('id') id: number) {
    return this.postsService.deletePost(id);
  }
}
