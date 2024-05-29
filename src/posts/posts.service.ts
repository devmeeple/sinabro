import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequest } from './dto/create-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostsResponse } from './dto/posts-response.dto';

// TODO: 2024.05.28 단위 테스트를 작성하자 원본객체 -> 테스트 더블(Mock, Stub, Fake) / Jest Mock 금지
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

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException(`${id}번 게시글을 찾을 수 없습니다`);
    }

    return PostsResponse.of(post);
  }

  async getPosts() {
    const posts = await this.postsRepository.find();
    return posts.map((post) => PostsResponse.of(post));
  }
}
