import { Injectable } from '@nestjs/common';
import { CreateRequest } from './dto/create-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    readonly postsRepository: Repository<Post>,
  ) {}

  async writePost(request: CreateRequest) {
    const post = this.postsRepository.create(request);
    await this.postsRepository.save(post);
  }
}
