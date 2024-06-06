import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginatePost {
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  @IsNumber()
  pageNo?: number = 1;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  pageSize?: number = 10;

  get limit() {
    return this.pageSize;
  }

  get offset() {
    return (this.pageNo - 1) * this.pageSize;
  }
}
