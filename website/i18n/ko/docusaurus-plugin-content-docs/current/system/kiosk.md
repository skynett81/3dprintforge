---
sidebar_position: 6
title: 키오스크 모드
description: 키오스크 모드 및 자동 순환 기능으로 Bambu Dashboard를 벽면 디스플레이 또는 허브 뷰로 설정합니다
---

# 키오스크 모드

키오스크 모드는 키보드, 마우스 상호작용 또는 브라우저 UI 없이 프린터 상태를 지속적으로 표시하는 벽면 마운트 모니터, TV 또는 전용 디스플레이를 위해 설계되었습니다.

이동: **https://localhost:3443/#settings** → **시스템 → 키오스크**

## 키오스크 모드란

키오스크 모드에서:
- 탐색 메뉴가 숨겨집니다
- 대화형 컨트롤이 표시되지 않습니다
- 대시보드가 자동으로 업데이트됩니다
- 화면이 프린터 간에 순환합니다 (구성된 경우)
- 비활성 타임아웃이 비활성화됩니다

## URL로 키오스크 모드 활성화

설정을 변경하지 않고 키오스크 모드를 활성화하려면 URL에 `?kiosk=true`를 추가합니다:

```
https://localhost:3443/?kiosk=true
https://localhost:3443/#fleet?kiosk=true
```

매개변수를 제거하거나 `?kiosk=false`를 추가하면 키오스크 모드가 비활성화됩니다.

## 키오스크 설정

1. **설정 → 시스템 → 키오스크**로 이동합니다
2. 구성:

| 설정 | 기본값 | 설명 |
|---|---|---|
| 기본 보기 | 플리트 개요 | 표시할 페이지 |
| 순환 간격 | 30초 | 순환 시 프린터당 시간 |
| 순환 모드 | 활성만 | 활성 프린터 간에만 순환 |
| 테마 | 어둡게 | 디스플레이에 권장 |
| 글꼴 크기 | 크게 | 멀리서도 읽을 수 있음 |
| 시계 표시 | 끄기 | 모서리에 시계 표시 |

## 키오스크용 플리트 보기

플리트 개요가 키오스크에 최적화되어 있습니다:

```
https://localhost:3443/#fleet?kiosk=true&cols=3&size=large
```

플리트 보기 매개변수:
- `cols=N` — 열 수 (1–6)
- `size=small|medium|large` — 카드 크기

## 단일 프린터 순환

프린터 간 순환 (한 번에 프린터 하나):

```
https://localhost:3443/?kiosk=true&rotate=true&interval=20
```

- `rotate=true` — 순환 활성화
- `interval=N` — 프린터당 초

## Raspberry Pi / NUC에서 설정

전용 키오스크 하드웨어의 경우:

### Chromium 키오스크 모드 (Linux)

```bash
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --app="https://localhost:3443/?kiosk=true"
```

자동 시작에 명령을 추가합니다 (`~/.config/autostart/bambu-kiosk.desktop`).

### 자동 로그인 및 시작

1. 운영 체제에서 자동 로그인 구성
2. Chromium에 대한 자동 시작 항목 만들기
3. 화면 보호기 및 절전 기능 비활성화:
   ```bash
   xset s off
   xset -dpms
   xset s noblank
   ```

:::tip 전용 사용자 계정
키오스크 장치를 위해 **게스트** 역할의 전용 Bambu Dashboard 사용자 계정을 만드세요. 그러면 장치가 읽기 전용 접근만 가지므로 누군가 화면에 접근하더라도 설정을 변경할 수 없습니다.
:::

## 허브 설정

허브 모드는 모든 프린터와 주요 통계가 있는 개요 페이지를 표시합니다 — 대형 TV용으로 설계:

```
https://localhost:3443/#hub?kiosk=true
```

허브 보기에 포함되는 내용:
- 상태가 있는 프린터 그리드
- 집계된 주요 수치 (활성 프린트, 총 진행률)
- 시계 및 날짜
- 최신 HMS 경고
