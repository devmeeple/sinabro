import { IsOptional } from 'class-validator';

export class UpdateRequest {
  @IsOptional()
  title?: string;

  @IsOptional()
  content?: string;

  static of(title: string, content: string) {
    const dto = new UpdateRequest();
    dto.title = title;
    dto.content = content;

    return dto;
  }
}
