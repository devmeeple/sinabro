import { IsNotEmpty } from 'class-validator';

// TODO: 2024.05.27
//  1. 유효성 검사를 추가했다. 단위 테스트로 검증할 수 없을까?
//  2. 에러 메시지를 공통으로 사용한다. 공통 파일을 정의해서 관리할 수 없을까?
export class CreateRequest {
  @IsNotEmpty({
    message: '제목은 필수입니다',
  })
  title: string;

  @IsNotEmpty({
    message: '내용은 필수입니다',
  })
  content: string;
}
