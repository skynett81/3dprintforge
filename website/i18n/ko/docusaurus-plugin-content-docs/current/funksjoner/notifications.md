---
sidebar_position: 6
title: 알림
description: 모든 프린터 이벤트에 대해 Telegram, Discord, 이메일, 웹훅, ntfy, Pushover 및 SMS를 통한 알림 구성
---

# 알림

Bambu Dashboard는 다양한 채널을 통한 알림을 지원하여 집에 있든 외출 중이든 항상 프린터 상황을 파악할 수 있습니다.

이동: **https://localhost:3443/#settings** → **알림** 탭

## 사용 가능한 채널

| 채널 | 필요 사항 | 이미지 지원 |
|---|---|---|
| Telegram | 봇 토큰 + 채팅 ID | ✅ |
| Discord | 웹훅 URL | ✅ |
| 이메일 | SMTP 서버 | ✅ |
| 웹훅 | URL + 선택적 키 | ✅ (base64) |
| ntfy | ntfy 서버 + 토픽 | ❌ |
| Pushover | API 토큰 + 사용자 키 | ✅ |
| SMS (Twilio) | 계정 SID + Auth 토큰 | ❌ |
| 브라우저 푸시 | 설정 불필요 | ❌ |

## 채널별 설정

### Telegram

1. [@BotFather](https://t.me/BotFather)를 통해 봇 생성 — `/newbot` 전송
2. **봇 토큰** 복사(형식: `123456789:ABC-def...`)
3. 봇과의 대화를 시작하고 `/start` 전송
4. **채팅 ID** 찾기: `https://api.telegram.org/bot<TOKEN>/getUpdates`로 이동
5. Bambu Dashboard에서: 토큰과 채팅 ID를 붙여넣고 **테스트** 클릭

:::tip 그룹 채널
Telegram 그룹을 수신자로 사용할 수 있습니다. 그룹의 채팅 ID는 `-`로 시작합니다.
:::

### Discord

1. 알림을 보낼 Discord 서버 열기
2. 채널 설정 → **통합 → 웹훅**으로 이동
3. **새 웹훅** 클릭, 이름 지정 및 채널 선택
4. 웹훅 URL 복사
5. Bambu Dashboard에 URL 붙여넣고 **테스트** 클릭

### 이메일

1. SMTP 서버, 포트(TLS의 경우 일반적으로 587) 입력
2. SMTP 계정의 사용자 이름 및 비밀번호
3. **보낸 사람** 주소 및 **받는 사람** 주소(여러 개는 쉼표로 구분)
4. 안전한 전송을 위해 **TLS/STARTTLS** 활성화
5. 테스트 이메일을 보내려면 **테스트** 클릭

:::warning Gmail
Gmail의 경우 일반 비밀번호 대신 **앱 비밀번호**를 사용합니다. 먼저 Google 계정에서 2단계 인증을 활성화하세요.
:::

### ntfy

1. [ntfy.sh](https://ntfy.sh)에서 토픽을 생성하거나 자체 ntfy 서버를 실행
2. 서버 URL(예: `https://ntfy.sh`) 및 토픽 이름 입력
3. 휴대폰에 ntfy 앱을 설치하고 같은 토픽을 구독
4. **테스트** 클릭

### Pushover

1. [pushover.net](https://pushover.net)에서 계정 생성
2. 새 애플리케이션 생성 — **API 토큰** 복사
3. Pushover 대시보드에서 **사용자 키** 찾기
4. Bambu Dashboard에 둘 다 입력하고 **테스트** 클릭

### 웹훅(사용자 지정)

Bambu Dashboard는 JSON 페이로드와 함께 HTTP POST를 전송합니다:

```json
{
  "event": "print_complete",
  "printer": "내 X1C",
  "printer_id": "abc123",
  "timestamp": "2026-03-22T14:30:00Z",
  "data": {
    "file": "benchy.3mf",
    "duration_minutes": 47,
    "filament_used_g": 12.4
  }
}
```

**비밀 키**를 추가하여 `X-Bambu-Signature` 헤더의 HMAC-SHA256 서명으로 요청을 검증합니다.

## 이벤트 필터

채널별로 알림을 트리거할 이벤트를 선택합니다:

| 이벤트 | 설명 |
|---|---|
| 프린트 시작 | 새 출력 시작 |
| 프린트 완료 | 출력 완료(이미지 포함) |
| 프린트 실패 | 오류로 출력 중단 |
| 프린트 일시 정지 | 수동 또는 자동 일시 정지 |
| Print Guard 경고 | XCam 또는 센서가 작업 트리거 |
| 필라멘트 부족 | 스풀이 거의 비어 있음 |
| AMS 오류 | 막힘, 습기 있는 필라멘트 등 |
| 프린터 연결 끊김 | MQTT 연결 끊김 |
| 대기열 작업 디스패치 | 대기열에서 작업 발송 |

각 채널에 대해 개별적으로 원하는 이벤트를 선택합니다.

## 방해 금지 시간

밤에 알림을 받지 않으려면:

1. 알림 설정에서 **방해 금지 시간** 활성화
2. **시작** 및 **종료** 시간 설정(예: 23:00 → 07:00)
3. 타이머의 **시간대** 선택
4. 중요한 알림(Print Guard 오류)은 재정의할 수 있음 — **항상 중요 알림 전송** 선택

## 브라우저 푸시 알림

앱 없이 브라우저에서 직접 알림을 받습니다:

1. **설정 → 알림 → 브라우저 푸시**로 이동
2. **푸시 알림 활성화** 클릭
3. 브라우저의 권한 대화 상자를 승인합니다
4. 대시보드가 최소화되어 있어도 알림이 작동합니다(탭이 열려 있어야 함)

:::info PWA
열린 탭 없이 백그라운드에서 푸시 알림을 받으려면 Bambu Dashboard를 PWA로 설치합니다. [PWA](../system/pwa)를 참조하세요.
:::
