import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

export class TestHelper {
  static getTypeOrmPgsqlModule(entities: TypeOrmModuleOptions['entities']) {
    return TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'test',
      username: 'test',
      password: 'test',
      entities,
      synchronize: true,
      logging: true,
    });
  }
}
