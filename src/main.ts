import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setNestApp } from './common/global.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setNestApp(app); // 전반적인 공통 설정을 정의하는 함수
  await app.listen(3000);
}

bootstrap();
