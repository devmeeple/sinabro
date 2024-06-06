# 시나브로

## 구현기능

- [ ] 프로젝트 설정
    - [x] 데이터베이스(TypeORM, Postgresql)
- [x] 회고 쓰기
- [ ] 회고 읽기
    - [ ] 회고 리스트
    - [ ] 페이징 처리
    - [x] 회고 상세
    - [x] 응답 클래스 분리
- [x] 회고 수정
- [x] 회고 삭제
- [ ] 예외 처리

## 실행방법

dokcer-compose를 통해 Postgresql를 실행

```shell
docker-compose up -d
```

```shell
yarn start:dev
```

개발 서버 실행

## 주소

## 테스트

# 응답 클래스 분리

엔티티 클래스를 반환하지 않고 서비스 정책에 맞는 응답 클래스를 반환한다. 클라이언트가 필요로 하는 필드만 반환한다.

## 요청 클래스(Request)

요청과 유효성 검증을 담당한다.

## 응답 클래스(Response)

클라이언트에게 필요한 필드를 반환한다. 서비스 정책을 따른다.

# 페이징

- 정렬: 기본 오름차순(ASC) / 내림차순(DESC)
- LIMIT: 한 페이지에 보여줄 데이터의 개수 제한하기
- OFFSET: 위치 지정, 시작할 행 - 1
