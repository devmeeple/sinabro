import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PostsModule } from '../src/posts/posts.module';
import * as request from 'supertest';
import { setNestApp } from '../src/common/global.config';

describe('PostsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [PostsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setNestApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/posts 게시물을 등록한다', async () => {
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
});
