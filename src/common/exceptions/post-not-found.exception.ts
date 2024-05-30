import { HttpException, HttpStatus } from '@nestjs/common';

export class PostNotFoundException extends HttpException {
  constructor(id: number) {
    super(`${id}번 게시글을 찾을 수 없습니다`, HttpStatus.NOT_FOUND);
  }
}
