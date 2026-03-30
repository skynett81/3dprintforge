---
sidebar_position: 1
title: 설치
description: 서버 또는 로컬 컴퓨터에 Bambu Dashboard를 설치합니다
---

# 설치

## 요구사항

| 요구사항 | 최소 | 권장 |
|------|---------|---------|
| Node.js | 22.x | 22.x LTS |
| RAM | 512 MB | 1 GB+ |
| 디스크 | 500 MB | 2 GB+ |
| OS | Linux, macOS, Windows | Linux (Ubuntu/Debian) |

:::warning Node.js 22 필수
Bambu Dashboard는 Node.js 22에 내장된 `--experimental-sqlite`를 사용합니다. 이전 버전은 지원되지 않습니다.
:::

## install.sh를 사용한 설치 (권장)

가장 간단한 방법은 대화형 설치 스크립트를 사용하는 것입니다:

```bash
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard
./install.sh
```

스크립트가 브라우저에서 설정을 안내합니다. systemd 지원과 함께 터미널 기반 설치:

```bash
./install.sh --cli
```

## 수동 설치

```bash
# 1. 저장소 복제
git clone https://github.com/skynett81/bambu-dashboard.git
cd bambu-dashboard

# 2. 종속성 설치
npm install

# 3. 대시보드 시작
npm start
```

브라우저에서 `https://localhost:3443`으로 접속합니다 (`http://localhost:3000`은 리디렉션됨).

:::info 자체 서명 SSL 인증서
첫 시작 시 대시보드가 자체 서명 SSL 인증서를 생성합니다. 브라우저에서 경고가 표시됩니다 — 이는 정상입니다. 자체 인증서 설치는 [HTTPS 인증서](./setup#https-인증서)를 참조하세요.
:::

## Docker

```bash
docker-compose up -d
```

전체 구성은 [Docker 설정](../advanced/docker)을 참조하세요.

## Systemd 서비스

백그라운드 서비스로 대시보드를 실행하려면:

```bash
./install.sh --cli
# systemd 서비스에 대해 물으면 "예" 선택
```

또는 수동으로:

```bash
sudo systemctl enable --now bambu-dashboard
sudo systemctl status bambu-dashboard
```

## 업데이트

Bambu Dashboard는 GitHub Releases를 통해 내장 자동 업데이트를 제공합니다. **설정 → 업데이트**에서 대시보드를 통해 업데이트하거나 수동으로:

```bash
git pull
npm install
npm start
```

## 제거

```bash
./uninstall.sh
```

스크립트가 서비스, 구성 및 데이터를 제거합니다 (무엇을 삭제할지 선택 가능).
