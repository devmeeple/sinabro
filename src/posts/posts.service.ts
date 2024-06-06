import { Injectable } from '@nestjs/common';
import { CreateRequest } from './dto/create-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostsResponse } from './dto/posts-response.dto';
import { UpdateRequest } from './dto/update-request.dto';
import { PostNotFoundException } from '../common/exceptions/post-not-found.exception';
import { PaginatePost } from './dto/paginate-post.dto';
import { Order } from './enum/Order.enum';

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

    this.validatePostExits(post, id);

    return PostsResponse.of(post);
  }

  async getPosts() {
    const posts = await this.postsRepository.find();
    return posts.map((post) => PostsResponse.of(post));
  }

  async getPostsWithPagination(pageNation: PaginatePost) {
    const [posts, totalCount] = await this.postsRepository.findAndCount({
      // ORDER BY, LIMIT, OFFSET
      /**
       * take: 몇 개의 데이터를 가져올 것인가
       * skip: 몇 페이지에서 가져올 것인가
       */
      order: {
        id: Order.DESC,
      },
      take: pageNation.limit,
      skip: pageNation.offset,
    });

    /**
     * data: Data[], 데이터
     * total: number, 총 데이터의 개수
     */
    return {
      data: posts.map((post) => PostsResponse.of(post)),
      total: totalCount,
    };
  }

  async updatePost(id: number, request: UpdateRequest) {
    const post = await this.postsRepository.findOne({ where: { id } });
    this.validatePostExits(post, id);
    await this.postsRepository.update(id, request);
  }

  async deletePost(id: number) {
    const post = await this.postsRepository.findOne({ where: { id } });
    this.validatePostExits(post, id);
    return this.postsRepository.delete(id);
  }

  private validatePostExits(post: Post, id: number) {
    if (!post) {
      throw new PostNotFoundException(id);
    }
  }
}
