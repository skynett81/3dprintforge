---
sidebar_position: 4
title: OBS 오버레이
description: OBS Studio에서 Bambu Lab 프린터의 투명한 상태 오버레이를 직접 추가합니다
---

# OBS 오버레이

OBS 오버레이를 사용하면 OBS Studio에서 프린터의 실시간 상태를 직접 표시할 수 있습니다 — 3D 프린팅 라이브 스트리밍 또는 녹화에 완벽합니다.

## 오버레이 URL

오버레이는 투명한 배경의 웹 페이지로 사용할 수 있습니다:

```
https://localhost:3443/obs-overlay?printer=PRINTER_ID
```

`PRINTER_ID`를 프린터 ID로 교체합니다(**설정 → 프린터**에서 찾을 수 있음).

### 사용 가능한 매개변수

| 매개변수 | 기본값 | 설명 |
|---|---|---|
| `printer` | 첫 번째 프린터 | 표시할 프린터 ID |
| `theme` | `dark` | `dark`, `light` 또는 `minimal` |
| `scale` | `1.0` | 배율(0.5–2.0) |
| `position` | `bottom-left` | `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `opacity` | `0.9` | 투명도(0.0–1.0) |
| `fields` | 전체 | 쉼표로 구분된 목록: `progress,temp,ams,time` |
| `color` | `#00d4ff` | 강조 색상(hex) |

**매개변수가 있는 예시:**
```
https://localhost:3443/obs-overlay?printer=abc123&theme=minimal&scale=1.2&position=top-right&fields=progress,time
```

## OBS Studio에서 설정

### 1단계: 브라우저 소스 추가

1. OBS Studio 열기
2. **소스** 아래에서 **+** 클릭
3. **브라우저**(Browser Source) 선택
4. 소스 이름 지정, 예: `Bambu Overlay`
5. **확인** 클릭

### 2단계: 브라우저 소스 설정

설정 대화 상자에 다음을 입력합니다:

| 항목 | 값 |
|---|---|
| URL | `https://localhost:3443/obs-overlay?printer=YOUR_ID` |
| 너비 | `400` |
| 높이 | `200` |
| FPS | `30` |
| 사용자 지정 CSS | *(비워 둠)* |

다음을 선택합니다:
- ✅ **소스가 보이지 않을 때 소스 끄기**
- ✅ **장면이 활성화될 때 브라우저 새로 고침**

:::warning HTTPS 및 localhost
OBS는 자체 서명된 인증서에 대해 경고할 수 있습니다. 먼저 Chrome/Firefox에서 `https://localhost:3443`으로 이동하여 인증서를 승인합니다. OBS도 같은 승인을 사용합니다.
:::

### 3단계: 투명한 배경

오버레이는 `background: transparent`로 빌드되었습니다. OBS에서 이것이 작동하려면:

1. 브라우저 소스에서 **사용자 지정 배경 색상** 선택 안 함
2. 오버레이가 불투명한 요소 안에 포함되지 않도록 합니다
3. OBS의 소스에서 **혼합 모드**를 **보통**으로 설정

:::tip 대안: 크로마 키
투명도가 작동하지 않으면 녹색 배경으로 필터 → **크로마 키**를 사용합니다:
URL에 `&bg=green`을 추가하고 소스에 크로마 키 필터를 설정합니다.
:::

## 오버레이에 표시되는 내용

기본 오버레이에는 다음이 포함됩니다:

- **진행률 막대**와 비율 값
- **남은 시간**(예상)
- **노즐 온도** 및 **베드 온도**
- **활성 AMS 슬롯**과 필라멘트 색상 및 이름
- **프린터 모델** 및 이름(끌 수 있음)

## 스트리밍을 위한 미니멀 모드

스트리밍 중 눈에 띄지 않는 오버레이를 위해:

```
https://localhost:3443/obs-overlay?theme=minimal&fields=progress,time&scale=0.8&opacity=0.7
```

이렇게 하면 남은 시간이 있는 작은 진행률 막대만 모서리에 표시됩니다.
