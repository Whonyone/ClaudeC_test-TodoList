# Todo List App

React + json-server 기반의 Todo 관리 애플리케이션입니다.

## 실행 방법

```bash
# json-server (API 서버, 포트 3001)
npm run server

# React 개발 서버 (포트 3000)
npm start
```

> React 앱은 `package.json`의 `proxy` 설정(`http://localhost:3001`)을 통해 API 요청을 json-server로 전달합니다.

---

## API 엔드포인트

베이스 URL: `http://localhost:3001`

---

### 인증 (Users)

#### 1. 로그인

| 항목 | 내용 |
|------|------|
| 메서드 | `GET` |
| 경로 | `/users` |

**요청 쿼리 파라미터**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `username` | string | O | 사용자 아이디 |
| `password` | string | O | 비밀번호 |

**응답**

- 성공 (`200 OK`) — 일치하는 유저 배열 반환. 길이 > 0이면 로그인 성공

```json
[
  {
    "id": 1,
    "username": "alice",
    "password": "1234",
    "createdAt": "2026-03-01T09:00:00.000Z"
  }
]
```

- 실패 — 빈 배열 반환 (아이디/비밀번호 불일치)

```json
[]
```

**curl 예시**

```bash
curl "http://localhost:3001/users?username=alice&password=1234"
```

---

#### 2. 회원가입

| 항목 | 내용 |
|------|------|
| 메서드 | `POST` |
| 경로 | `/users` |

**요청 헤더**

```
Content-Type: application/json
```

**요청 바디**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `username` | string | O | 사용자 아이디 |
| `password` | string | O | 비밀번호 |
| `createdAt` | string (ISO 8601) | O | 가입 일시 |

```json
{
  "username": "alice",
  "password": "1234",
  "createdAt": "2026-03-04T12:00:00.000Z"
}
```

**응답**

- 성공 (`201 Created`)

```json
{
  "id": 1,
  "username": "alice",
  "password": "1234",
  "createdAt": "2026-03-04T12:00:00.000Z"
}
```

- 실패 (`500` 또는 네트워크 오류) — json-server 서버 오류

> 중복 아이디 확인은 클라이언트에서 사전에 `GET /users?username=<username>` 조회로 처리합니다.

**curl 예시**

```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"1234","createdAt":"2026-03-04T12:00:00.000Z"}'
```

---

### Todo

#### 3. Todo 목록 조회

| 항목 | 내용 |
|------|------|
| 메서드 | `GET` |
| 경로 | `/todos` |

**요청 쿼리 파라미터**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `userId` | number | X | 특정 사용자의 Todo만 필터링 |

**응답**

- 성공 (`200 OK`)

```json
[
  {
    "id": 1,
    "userId": 1,
    "title": "React 공부",
    "detail": "Hooks 챕터 복습",
    "completed": false,
    "createdAt": "2026-03-04T12:00:00.000Z",
    "duedate": "2026-03-10",
    "duetime": "18:00",
    "priority": "high",
    "category": "개인"
  }
]
```

- 실패 (`500` 또는 네트워크 오류)

**curl 예시**

```bash
# 전체 조회
curl "http://localhost:3001/todos"

# 특정 유저 조회
curl "http://localhost:3001/todos?userId=1"
```

---

#### 4. Todo 생성

| 항목 | 내용 |
|------|------|
| 메서드 | `POST` |
| 경로 | `/todos` |

**요청 헤더**

```
Content-Type: application/json
```

**요청 바디**

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `userId` | number | O | — | 작성자 ID |
| `title` | string | O | — | 할 일 제목 |
| `detail` | string | X | `""` | 상세 내용 |
| `completed` | boolean | — | `false` | 완료 여부 (자동 설정) |
| `createdAt` | string (ISO 8601) | — | 현재 시각 | 생성 일시 (자동 설정) |
| `duedate` | string (`YYYY-MM-DD`) | X | `null` | 마감 날짜 |
| `duetime` | string (`HH:MM`) | X | `null` | 마감 시각 |
| `priority` | `"high"` \| `"medium"` \| `"low"` | X | `"medium"` | 우선순위 |
| `category` | string | X | `null` | 카테고리 |

```json
{
  "userId": 1,
  "title": "React 공부",
  "detail": "Hooks 챕터 복습",
  "completed": false,
  "createdAt": "2026-03-04T12:00:00.000Z",
  "duedate": "2026-03-10",
  "duetime": "18:00",
  "priority": "high",
  "category": "개인"
}
```

**응답**

- 성공 (`201 Created`) — 생성된 Todo 객체 반환

```json
{
  "id": 1,
  "userId": 1,
  "title": "React 공부",
  "detail": "Hooks 챕터 복습",
  "completed": false,
  "createdAt": "2026-03-04T12:00:00.000Z",
  "duedate": "2026-03-10",
  "duetime": "18:00",
  "priority": "high",
  "category": "개인"
}
```

- 실패 (`500` 또는 네트워크 오류)

**curl 예시**

```bash
curl -X POST http://localhost:3001/todos \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "title": "React 공부",
    "detail": "Hooks 챕터 복습",
    "completed": false,
    "createdAt": "2026-03-04T12:00:00.000Z",
    "duedate": "2026-03-10",
    "duetime": "18:00",
    "priority": "high",
    "category": "개인"
  }'
```

---

#### 5. Todo 완료 상태 변경 (토글)

| 항목 | 내용 |
|------|------|
| 메서드 | `PATCH` |
| 경로 | `/todos/:id` |

**경로 파라미터**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | number | 변경할 Todo의 ID |

**요청 헤더**

```
Content-Type: application/json
```

**요청 바디**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `completed` | boolean | O | 변경할 완료 상태 |

```json
{
  "completed": true
}
```

**응답**

- 성공 (`200 OK`) — 업데이트된 Todo 객체 반환

```json
{
  "id": 1,
  "userId": 1,
  "title": "React 공부",
  "detail": "Hooks 챕터 복습",
  "completed": true,
  "createdAt": "2026-03-04T12:00:00.000Z",
  "duedate": "2026-03-10",
  "duetime": "18:00",
  "priority": "high",
  "category": "개인"
}
```

- 실패 (`404 Not Found`) — 해당 ID의 Todo 없음

```json
{}
```

**curl 예시**

```bash
# 완료로 변경
curl -X PATCH http://localhost:3001/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# 미완료로 되돌리기
curl -X PATCH http://localhost:3001/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": false}'
```

---

#### 6. Todo 삭제

| 항목 | 내용 |
|------|------|
| 메서드 | `DELETE` |
| 경로 | `/todos/:id` |

**경로 파라미터**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | number | 삭제할 Todo의 ID |

**응답**

- 성공 (`200 OK`) — 빈 객체 반환

```json
{}
```

- 실패 (`404 Not Found`) — 해당 ID의 Todo 없음

```json
{}
```

**curl 예시**

```bash
curl -X DELETE http://localhost:3001/todos/1
```

---

## 데이터 모델

### User

```json
{
  "id": 1,
  "username": "alice",
  "password": "1234",
  "createdAt": "2026-03-01T09:00:00.000Z"
}
```

### Todo

```json
{
  "id": 1,
  "userId": 1,
  "title": "할 일 제목",
  "detail": "상세 내용",
  "completed": false,
  "createdAt": "2026-03-04T12:00:00.000Z",
  "duedate": "2026-03-10",
  "duetime": "18:00",
  "priority": "high",
  "category": "개인"
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | number | 자동 생성 고유 ID |
| `userId` | number | 작성자 User ID |
| `title` | string | 할 일 제목 |
| `detail` | string | 상세 내용 |
| `completed` | boolean | 완료 여부 |
| `createdAt` | string (ISO 8601) | 생성 일시 |
| `duedate` | string \| null | 마감 날짜 (`YYYY-MM-DD`) |
| `duetime` | string \| null | 마감 시각 (`HH:MM`) |
| `priority` | `"high"` \| `"medium"` \| `"low"` | 우선순위 |
| `category` | string \| null | 카테고리 |
