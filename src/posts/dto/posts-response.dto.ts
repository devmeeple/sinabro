import { Post } from '../entities/post.entity';

/**
 * 서비스 정책에 맞는 응답 클래스
 */
export class PostsResponse {
  id: number;
  title: string;
  content: string;

  // 엔티티의 값을 DTO로 변환
  static of(post: Post) {
    const dto = new PostsResponse();
    dto.id = post.id;
    dto.title = post.title;
    dto.content = post.content;

    return dto;
  }
}
