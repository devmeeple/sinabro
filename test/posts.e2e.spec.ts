import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PostsModule } from '../src/posts/posts.module';
import * as request from 'supertest';

describe('PostsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [PostsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
});
