import { INestApplication, ValidationPipe } from '@nestjs/common';

/**
 * 공통적으로 사용하는 설정을 정의하는 함수
 * useGlobalPipes: 유효성 검사 파이프를 전역으로 설정
 */
export function setNestApp<T extends INestApplication>(app: T) {
  app.useGlobalPipes(new ValidationPipe());
}
