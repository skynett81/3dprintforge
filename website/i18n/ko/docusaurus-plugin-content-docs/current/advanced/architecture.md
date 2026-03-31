---
sidebar_position: 2
title: 기술 아키텍처
description: 3DPrintForge의 아키텍처 개요 — 스택, 모듈, 데이터베이스 및 WebSocket
---

# 기술 아키텍처

## 시스템 다이어그램

```
Browser <──WebSocket──> Node.js <──MQTTS:8883──> Printer
Browser <──WS:9001+──> ffmpeg  <──RTSPS:322───> Camera
```

대시보드는 TLS를 통한 MQTT(포트 8883)로 프린터와, RTSPS(포트 322)로 카메라와 통신합니다. 브라우저는 HTTPS 및 WebSocket을 통해 대시보드에 연결됩니다.

## 기술 스택

| 레이어 | 기술 |
|-----|-----------|
| 프론트엔드 | Vanilla HTML/CSS/JS — 76개 컴포넌트 모듈, 빌드 단계 없음, 프레임워크 없음 |
| 백엔드 | Node.js 22, npm 패키지 3개: `mqtt`, `ws`, `basic-ftp` |
| 데이터베이스 | SQLite (Node.js 22의 `--experimental-sqlite`를 통해 내장) |
| 카메라 | ffmpeg이 RTSPS를 MPEG1으로 트랜스코딩, jsmpeg이 브라우저에서 렌더링 |
| 실시간 | WebSocket 허브가 연결된 모든 클라이언트에게 프린터 상태 브로드캐스트 |
| 프로토콜 | 프린터의 LAN Access Code가 포함된 TLS를 통한 MQTT(포트 8883) |

## 포트

| 포트 | 프로토콜 | 방향 | 설명 |
|------|-----------|---------|-------------|
| 3000 | HTTP + WS | 수신 | 대시보드(HTTPS로 리디렉션) |
| 3443 | HTTPS + WSS | 수신 | 보안 대시보드(기본값) |
| 9001+ | WS | 수신 | 카메라 스트림(프린터당 하나) |
| 8883 | MQTTS | 송신 | 프린터 연결 |
| 322 | RTSPS | 송신 | 프린터의 카메라 |

## 서버 모듈(44개)

| 모듈 | 용도 |
|-------|--------|
| `index.js` | HTTP/HTTPS 서버, 자동 SSL, CSP/HSTS 헤더, 정적 파일, 데모 모드 |
| `config.js` | 설정 로딩, 기본값, 환경 변수 재정의 및 마이그레이션 |
| `database.js` | SQLite 스키마, 105개 마이그레이션, CRUD 작업 |
| `api-routes.js` | REST API(284개 이상 엔드포인트) |
| `auth.js` | 인증 및 세션 관리 |
| `backup.js` | 백업 및 복원 |
| `printer-manager.js` | 프린터 수명 주기, MQTT 연결 관리 |
| `mqtt-client.js` | Bambu 프린터에 대한 MQTT 연결 |
| `mqtt-commands.js` | MQTT 명령 빌드(일시 정지, 재개, 중지 등) |
| `websocket-hub.js` | 모든 브라우저 클라이언트에 WebSocket 브로드캐스트 |
| `camera-stream.js` | 카메라 스트림용 ffmpeg 프로세스 관리 |
| `print-tracker.js` | 프린트 작업 추적, 상태 전환, 기록 로깅 |
| `print-guard.js` | xcam + 센서 모니터링을 통한 프린트 보호 |
| `queue-manager.js` | 다중 프린터 디스패치 및 부하 분산이 있는 프린트 대기열 |
| `slicer-service.js` | 로컬 슬라이서 CLI 브리지, 파일 업로드, FTPS 업로드 |
| `telemetry.js` | 텔레메트리 데이터 처리 |
| `telemetry-sampler.js` | 시계열 데이터 샘플링 |
| `thumbnail-service.js` | 프린터 SD에서 FTPS를 통한 썸네일 가져오기 |
| `timelapse-service.js` | 타임랩스 녹화 및 관리 |
| `notifications.js` | 7채널 알림 시스템(Telegram, Discord, 이메일, Webhook, ntfy, Pushover, SMS) |
| `updater.js` | 백업이 포함된 GitHub Releases 자동 업데이트 |
| `setup-wizard.js` | 초기 사용을 위한 웹 기반 설정 마법사 |
| `ecom-license.js` | 라이선스 관리 |
| `failure-detection.js` | 오류 감지 및 분석 |
| `bambu-cloud.js` | Bambu Cloud API 통합 |
| `bambu-rfid-data.js` | AMS의 RFID 필라멘트 데이터 |
| `circuit-breaker.js` | 서비스 안정성을 위한 회로 차단기 패턴 |
| `energy-service.js` | 에너지 및 전력 요금 계산 |
| `error-pattern-analyzer.js` | HMS 오류의 패턴 분석 |
| `file-parser.js` | 3MF/GCode 파일 파싱 |
| `logger.js` | 구조화된 로깅 |
| `material-recommender.js` | 재료 추천 |
| `milestone-service.js` | 마일스톤 및 업적 추적 |
| `plugin-manager.js` | 확장을 위한 플러그인 시스템 |
| `power-monitor.js` | 전력 측정 통합(Shelly/Tasmota) |
| `price-checker.js` | 전력 가격 가져오기(Tibber/Nordpool) |
| `printer-discovery.js` | LAN에서 자동 프린터 검색 |
| `remote-nodes.js` | 다중 노드 관리 |
| `report-service.js` | 보고서 생성 |
| `seed-filament-db.js` | 필라멘트 데이터베이스 시딩 |
| `spoolease-data.js` | SpoolEase 통합 |
| `validate.js` | 입력 유효성 검사 |
| `wear-prediction.js` | 구성 요소 마모 예측 |

## 프론트엔드 컴포넌트(76개)

모든 컴포넌트는 빌드 단계 없는 Vanilla JavaScript 모듈입니다. `<script type="module">`을 통해 브라우저에서 직접 로드됩니다.

| 컴포넌트 | 용도 |
|-----------|--------|
| `print-preview.js` | 3D 모델 뷰어 + MakerWorld 이미지 해석 |
| `model-viewer.js` | 레이어 애니메이션이 있는 WebGL 3D 렌더링 |
| `temperature-gauge.js` | 애니메이션 SVG 링 게이지 |
| `sparkline-stats.js` | Grafana 스타일 통계 패널 |
| `ams-panel.js` | AMS 필라멘트 시각화 |
| `camera-view.js` | 전체 화면이 있는 jsmpeg 비디오 플레이어 |
| `controls-panel.js` | 프린터 제어 UI |
| `history-table.js` | 검색, 필터, CSV 내보내기가 있는 프린트 기록 |
| `filament-tracker.js` | 즐겨찾기, 색상 필터링이 있는 필라멘트 재고 |
| `queue-panel.js` | 프린트 대기열 관리 |
| `knowledge-panel.js` | 지식 베이스 리더 및 편집기 |

## 데이터베이스

SQLite 데이터베이스는 Node.js 22에 내장되어 있으며 외부 설치가 필요하지 않습니다. 스키마는 `db/migrations.js`의 105개 마이그레이션에 의해 처리됩니다.

주요 데이터베이스 테이블:

- `printers` — 프린터 설정
- `print_history` — 모든 프린트 작업
- `filaments` — 필라멘트 재고
- `ams_slots` — AMS 슬롯 연결
- `queue` — 프린트 대기열
- `notifications_config` — 알림 설정
- `maintenance_log` — 유지 관리 로그

## 보안

- 자동 생성된 인증서(또는 직접 제공) HTTPS
- JWT 기반 인증
- CSP 및 HSTS 헤더
- 속도 제한(분당 200개 요청)
- 핵심 기능에 외부 클라우드 의존성 없음
