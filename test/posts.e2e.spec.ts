import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PostsModule } from '../src/posts/posts.module';
import * as request from 'supertest';
import { setNestApp } from '../src/common/global.config';
import { Repository } from 'typeorm';
import { Post } from '../src/posts/entities/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestHelper } from './test.helper';
import { CreateRequest } from '../src/posts/dto/create-request.dto';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let postsRepository: Repository<Post>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [PostsModule, TestHelper.getSQLiteTestConnectionOptions([Post])],
    }).compile();

    app = moduleFixture.createNestApplication();
    postsRepository = moduleFixture.get(getRepositoryToken(Post));
    setNestApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    // 테스트가 끝날 때마다 posts 테이블을 비운다
    await postsRepository.clear();
  });

  describe('[POST] /posts', () => {
    it('게시글을 작성한다', async () => {
      // given
      const createRequest = CreateRequest.of('제목입니다', '내용입니다');

      // when
      const response = await request(app.getHttpServer())
        .post('/posts')
        .send(createRequest);

      const posts = await postsRepository.find();

      // then
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('제목입니다');
      expect(posts[0].content).toBe('내용입니다');
    });

    it('빈 제목이나 내용으로 게시글을 등록할 수 없다', async () => {
      // given
      const badCreateRequest = CreateRequest.of('', '');

      // when
      const response = await request(app.getHttpServer())
        .post('/posts')
        .send(badCreateRequest);

      const posts = await postsRepository.find();

      // then
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message[0]).toEqual('제목은 필수입니다');
      expect(response.body.message[1]).toEqual('내용은 필수입니다');
      expect(posts).toHaveLength(0);
    });
  });

  describe('[GET] /posts/:id', () => {
    it('작성한 게시글 1개를 조회한다', async () => {
      // given
      const post = Post.of('제목입니다', '내용입니다');
      const savedPost = await postsRepository.save(post);

      // when
      const response = await request(app.getHttpServer()).get(
        `/posts/${savedPost.id}`,
      );

      // then
      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body.title).toBe('제목입니다');
      expect(response.body.content).toBe('내용입니다');
    });

    it('없는 게시글을 조회하면 오류가 발생한다', async () => {
      // given
      const notFoundId = 999;

      // when
      const response = await request(app.getHttpServer()).get(
        `/posts/${notFoundId}`,
      );

      // then
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.message).toEqual(
        `${notFoundId}번 게시글을 찾을 수 없습니다`,
      );
    });
  });

  it('[GET] /posts 전체 게시글을 조회한다(페이지네이션)', async () => {
    // given
    const posts = Array(100)
      .fill(0)
      .map((_, index) =>
        Post.of(`제목입니다 ${index + 1}`, `내용입니다 ${index + 1}`),
      );

    await postsRepository.save(posts);

    // when
    const response = await request(app.getHttpServer()).get('/posts');

    // then
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.data).toHaveLength(10);
    expect(response.body.total).toBe(100);

    expect(response.body.data[0].title).toBe('제목입니다 100');
    expect(response.body.data[0].content).toBe('내용입니다 100');
    expect(response.body.data[9].title).toBe('제목입니다 91');
    expect(response.body.data[9].content).toBe('내용입니다 91');
  });

  it('[PATCH] /posts/:id 게시글을 수정한다', async () => {
    // given
    const post = Post.of('제목입니다', '내용입니다');
    const savedPost = await postsRepository.save(post);

    // when
    const response = await request(app.getHttpServer())
      .patch(`/posts/${savedPost.id}`)
      .send({
        title: '수정된 제목입니다',
      });

    // then
    expect(response.status).toBe(HttpStatus.OK);
  });

  it('[DELETE] /posts 게시글 1개를 삭제한다', async () => {
    // given
    const post = Post.of('제목입니다', '내용입니다');
    const savedPost = await postsRepository.save(post);

    // when
    const response = await request(app.getHttpServer()).delete(
      `/posts/${savedPost.id}`,
    );

    // then
    expect(response.status).toBe(HttpStatus.OK);

    expect(await postsRepository.find()).toHaveLength(0);
  });
});
