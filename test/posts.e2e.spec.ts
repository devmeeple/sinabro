import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PostsModule } from '../src/posts/posts.module';
import * as request from 'supertest';
import { setNestApp } from '../src/common/global.config';
import { Repository } from 'typeorm';
import { Post } from '../src/posts/entities/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestHelper } from './test.helper';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let postsRepository: Repository<Post>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [PostsModule, TestHelper.getTypeOrmPgsqlModule([Post])],
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

  it('/posts 회고를 작성한다', async () => {
    // given
    const expectedRequest = {
      title: '제목입니다',
      content: '내용입니다',
    };

    // when
    const response = await request(app.getHttpServer())
      .post('/posts')
      .send(expectedRequest);

    // then
    expect(response.status).toBe(HttpStatus.CREATED);

    // 데이터베이스에 정상적으로 저장되었는지 확인한다
    const posts = await postsRepository.find();

    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('제목입니다');
    expect(posts[0].content).toBe('내용입니다');
  });

  it('/posts 빈 제목이나 내용으로 게시글을 등록할 수 없다', async () => {
    // given
    const invalidRequest = {
      title: '',
      content: '',
    };

    // when
    const response = await request(app.getHttpServer())
      .post('/posts')
      .send(invalidRequest);

    // then
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message[0]).toEqual('제목은 필수입니다');
    expect(response.body.message[1]).toEqual('내용은 필수입니다');
  });

  it('/posts/:id 게시글 단건조회', async () => {
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

  it('/posts/:id 게시글 단건조회 없는 게시글을 조회하면 오류가 발생한다', async () => {
    // given
    const badId = 999;

    // when
    const response = await request(app.getHttpServer()).get(`/posts/${badId}`);

    // then
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(response.body.message).toEqual(
      `${badId}번 게시글을 찾을 수 없습니다`,
    );
  });

  it('/posts 전체 게시글을 조회한다', async () => {
    // given
    const post1 = Post.of('제목입니다1', '내용입니다1');
    const post2 = Post.of('제목입니다2', '내용입니다2');

    await postsRepository.save([post1, post2]);

    // when
    const response = await request(app.getHttpServer()).get('/posts');

    // then
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveLength(2);

    expect(response.body[0].title).toBe('제목입니다1');
    expect(response.body[0].content).toBe('내용입니다1');

    expect(response.body[1].title).toBe('제목입니다2');
    expect(response.body[1].content).toBe('내용입니다2');
  });

  it('/posts/:id 회고를 수정한다', async () => {
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
});
