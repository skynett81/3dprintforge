---
sidebar_position: 4
title: 플러그인 시스템
description: Bambu Dashboard를 확장하는 플러그인 만들기 및 설치
---

# 플러그인 시스템

Bambu Dashboard는 소스 코드를 변경하지 않고 기능을 확장할 수 있는 플러그인 시스템을 지원합니다.

:::info 실험적 기능
플러그인 시스템은 활발히 개발 중입니다. API는 버전 간에 변경될 수 있습니다.
:::

## 플러그인으로 할 수 있는 것은?

- 새 API 엔드포인트 추가
- 프린터 이벤트 수신 및 반응
- 새 프론트엔드 패널 추가
- 서드파티 서비스 통합
- 알림 채널 확장

## 플러그인 구조

플러그인은 `plugins/` 폴더의 Node.js 모듈입니다:

```
plugins/
└── my-plugin/
    ├── plugin.json    # 메타데이터
    ├── index.js       # 진입점
    └── README.md      # 문서(선택 사항)
```

### plugin.json

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "플러그인 설명",
  "author": "작성자 이름",
  "main": "index.js",
  "hooks": ["onPrintStart", "onPrintEnd", "onPrinterConnect"]
}
```

### index.js

```javascript
module.exports = {
  // 플러그인이 로드될 때 호출됨
  async onLoad(context) {
    const { api, db, logger, events } = context;
    logger.info('내 플러그인이 로드되었습니다');

    // 새 API 경로 등록
    api.get('/plugins/my-plugin/status', (req, res) => {
      res.json({ status: 'active' });
    });
  },

  // 프린트가 시작될 때 호출됨
  async onPrintStart(context, printJob) {
    const { logger } = context;
    logger.info(`프린트 시작: ${printJob.name}`);
  },

  // 프린트가 완료될 때 호출됨
  async onPrintEnd(context, printJob) {
    const { logger, db } = context;
    logger.info(`프린트 완료: ${printJob.name}`);
    // 데이터베이스에 데이터 저장
    await db.run(
      'INSERT INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
      ['my-plugin', 'last-print', printJob.name]
    );
  }
};
```

## 사용 가능한 훅

| 훅 | 트리거 |
|------|---------|
| `onLoad` | 플러그인 로드 |
| `onUnload` | 플러그인 언로드 |
| `onPrinterConnect` | 프린터 연결 |
| `onPrinterDisconnect` | 프린터 연결 해제 |
| `onPrintStart` | 프린트 시작 |
| `onPrintEnd` | 프린트 완료 |
| `onPrintFail` | 프린트 실패 |
| `onFilamentChange` | 필라멘트 변경 |
| `onAmsUpdate` | AMS 상태 업데이트 |

## 플러그인 컨텍스트

모든 훅은 `context` 객체를 받습니다:

| 속성 | 유형 | 설명 |
|----------|------|-------------|
| `api` | Express Router | 사용자 지정 API 경로 추가 |
| `db` | SQLite | 데이터베이스 접근 |
| `logger` | Logger | 로깅 |
| `events` | EventEmitter | 이벤트 수신 |
| `config` | Object | 대시보드 설정 |
| `printers` | Map | 연결된 모든 프린터 |

## 플러그인 설치

```bash
# 플러그인 폴더 복사
cp -r my-plugin/ plugins/

# 대시보드 재시작
npm start
```

플러그인은 `plugins/` 폴더에 있으면 시작 시 자동으로 활성화됩니다.

## 플러그인 비활성화

`plugin.json`에 `"disabled": true`를 추가하거나 폴더를 제거합니다.

## 예시 플러그인: Slack 알림

```javascript
const { IncomingWebhook } = require('@slack/webhook');

module.exports = {
  async onLoad(context) {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  },

  async onPrintEnd(context, job) {
    await this.webhook.send({
      text: `프린트 완료! *${job.name}* 소요 시간: ${job.duration}`
    });
  }
};
```
