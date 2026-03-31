---
sidebar_position: 1
title: API 참조
description: 인증 및 속도 제한이 있는 284개 이상의 엔드포인트를 갖춘 REST API
---

# API 참조

3DPrintForge는 284개 이상의 엔드포인트를 갖춘 완전한 REST API를 제공합니다. API 문서는 대시보드 내에서 직접 이용할 수 있습니다.

## 대화형 문서

브라우저에서 OpenAPI 문서를 열려면:

```
https://your-server:3443/api/docs
```

여기서 모든 엔드포인트, 매개변수, 요청/응답 스키마를 찾고 API를 직접 테스트할 수 있습니다.

## 인증

API는 **Bearer 토큰** 인증(JWT)을 사용합니다:

```bash
# 로그인하여 토큰 가져오기
curl -X POST https://your-server:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your-password"}'

# 응답
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

이후 모든 요청에서 토큰을 사용합니다:

```bash
curl https://your-server:3443/api/printers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 속도 제한

API는 서버를 보호하기 위해 속도 제한이 적용됩니다:

| 제한 | 값 |
|--------|-------|
| 분당 요청 수 | 200 |
| 버스트(초당 최대) | 20 |
| 초과 시 응답 | `429 Too Many Requests` |

응답의 `Retry-After` 헤더는 다음 요청이 허용될 때까지의 초 수를 나타냅니다.

## 엔드포인트 개요

### 인증
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|-------------|
| POST | `/api/auth/login` | 로그인, JWT 가져오기 |
| POST | `/api/auth/logout` | 로그아웃 |
| GET | `/api/auth/me` | 로그인한 사용자 가져오기 |

### 프린터
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|-------------|
| GET | `/api/printers` | 모든 프린터 목록 |
| POST | `/api/printers` | 프린터 추가 |
| GET | `/api/printers/:id` | 프린터 가져오기 |
| PUT | `/api/printers/:id` | 프린터 업데이트 |
| DELETE | `/api/printers/:id` | 프린터 삭제 |
| GET | `/api/printers/:id/status` | 실시간 상태 |
| POST | `/api/printers/:id/command` | 명령 보내기 |

### 필라멘트
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|-------------|
| GET | `/api/filaments` | 모든 스풀 목록 |
| POST | `/api/filaments` | 스풀 추가 |
| PUT | `/api/filaments/:id` | 스풀 업데이트 |
| DELETE | `/api/filaments/:id` | 스풀 삭제 |
| GET | `/api/filaments/stats` | 소비 통계 |

### 프린트 기록
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|-------------|
| GET | `/api/history` | 기록 목록(페이지 분할) |
| GET | `/api/history/:id` | 단일 프린트 가져오기 |
| GET | `/api/history/export` | CSV 내보내기 |
| GET | `/api/history/stats` | 통계 |

### 프린트 대기열
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|-------------|
| GET | `/api/queue` | 대기열 가져오기 |
| POST | `/api/queue` | 작업 추가 |
| PUT | `/api/queue/:id` | 작업 업데이트 |
| DELETE | `/api/queue/:id` | 작업 제거 |
| POST | `/api/queue/dispatch` | 강제 디스패치 |

## WebSocket API

REST 외에도 실시간 데이터를 위한 WebSocket API가 있습니다:

```javascript
const ws = new WebSocket('wss://your-server:3443/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
```

### 메시지 유형(수신)
- `printer.status` — 업데이트된 프린터 상태
- `print.progress` — 진행률 업데이트
- `ams.update` — AMS 상태 변경
- `notification` — 알림 메시지

## 오류 코드

| 코드 | 의미 |
|------|-------|
| 200 | 정상 |
| 201 | 생성됨 |
| 400 | 잘못된 요청 |
| 401 | 인증되지 않음 |
| 403 | 권한 없음 |
| 404 | 찾을 수 없음 |
| 429 | 너무 많은 요청 |
| 500 | 서버 오류 |
