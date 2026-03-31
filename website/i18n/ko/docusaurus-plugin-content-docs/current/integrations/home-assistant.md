---
sidebar_position: 1
title: Home Assistant
description: MQTT 검색, 자동화된 엔티티 및 자동화 예제를 통해 3DPrintForge를 Home Assistant와 통합합니다
---

# Home Assistant

Home Assistant 통합은 MQTT Discovery를 통해 모든 Bambu Lab 프린터를 Home Assistant의 장치로 노출합니다 — YAML 수동 구성 없이 자동으로 작동합니다.

이동: **https://localhost:3443/#settings** → **통합 → Home Assistant** 탭

## 사전 요구사항

- 네트워크에서 실행 중인 Home Assistant
- Home Assistant에 설치 및 구성된 MQTT 브로커 (Mosquitto)
- 3DPrintForge와 Home Assistant가 동일한 MQTT 브로커 사용

## MQTT Discovery 활성화

1. **설정 → 통합 → Home Assistant**로 이동합니다
2. (아직 구성되지 않은 경우) MQTT 브로커 설정 입력:
   - **브로커 주소**: 예: `192.168.1.100`
   - **포트**: `1883` (또는 TLS의 경우 `8883`)
   - **사용자 이름 및 비밀번호**: 브로커에서 요구하는 경우
3. **MQTT Discovery** 활성화
4. **Discovery 접두사** 설정: 기본값은 `homeassistant`
5. **저장 및 활성화** 클릭

3DPrintForge가 이제 등록된 모든 프린터에 대한 Discovery 메시지를 게시합니다.

## Home Assistant의 장치

활성화 후 프린터당 하나의 새 장치가 Home Assistant에 나타납니다 (**설정 → 장치 및 서비스 → MQTT**):

### 엔티티 ID 패턴

엔티티 ID는 `sensor.{printer_name_slug}_{sensor_id}` 패턴을 따릅니다. 여기서 `printer_name_slug`는 특수 문자가 밑줄로 대체된 소문자 프린터 이름입니다. 예: 「My P1S」라는 프린터는 `sensor.my_p1s_status`가 됩니다.

### 센서 (읽기)

| 센서 ID | 단위 | 예시 |
|---|---|---|
| `{slug}_status` | 텍스트 | `RUNNING` |
| `{slug}_progress` | % | `47` |
| `{slug}_remaining` | 분 | `83` |
| `{slug}_layer` | 숫자 | `124` |
| `{slug}_total_layers` | 숫자 | `280` |
| `{slug}_nozzle_temp` | °C | `220.5` |
| `{slug}_nozzle_target` | °C | `220.0` |
| `{slug}_bed_temp` | °C | `60.1` |
| `{slug}_bed_target` | °C | `60.0` |
| `{slug}_chamber_temp` | °C | `34.2` |
| `{slug}_current_file` | 텍스트 | `benchy.3mf` |
| `{slug}_speed` | % | `100` |
| `{slug}_wifi_signal` | 텍스트 | `-65dBm` |

### 이진 센서

| 센서 ID | 상태 |
|---|---|
| `{slug}_printing` | `on` / `off` |
| `{slug}_online` | `on` / `off` |

:::info 참고
버튼 (일시 정지/재개/정지)은 MQTT Discovery를 통해 게시되지 않습니다. 자동화에서 명령을 보내려면 3DPrintForge API를 사용하세요.
:::

## 자동화 예제

### 프린트 완료 시 모바일 알림

`min_p1s`를 프린터의 이름 슬러그로 교체합니다.

```yaml
automation:
  - alias: "Bambu - 프린트 완료"
    trigger:
      - platform: state
        entity_id: binary_sensor.min_p1s_printing
        from: "on"
        to: "off"
    condition:
      - condition: state
        entity_id: sensor.min_p1s_status
        state: "FINISH"
    action:
      - service: notify.mobile_app_min_telefon
        data:
          title: "프린트 완료!"
          message: "{{ states('sensor.min_p1s_current_file') }} 이(가) 완료되었습니다."
```

### 프린트 시작 시 조명 어둡게

```yaml
automation:
  - alias: "Bambu - 프린팅 중 조명 어둡게"
    trigger:
      - platform: state
        entity_id: binary_sensor.min_p1s_printing
        to: "on"
    action:
      - service: light.turn_on
        target:
          entity_id: light.kjeller
        data:
          brightness_pct: 30
```

## 에너지 모니터링

Shelly 또는 Tasmota를 통한 전력 측정은 별도로 처리되며 MQTT Discovery를 통해 Home Assistant에 직접 노출되지 않습니다. 스마트 플러그 설정은 [전력 측정](./power)을 참조하세요.
