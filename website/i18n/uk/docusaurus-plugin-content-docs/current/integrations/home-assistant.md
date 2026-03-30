---
sidebar_position: 1
title: Home Assistant
description: Інтегруйте Bambu Dashboard з Home Assistant через MQTT Discovery, автоматизовані пристрої та приклади автоматизацій
---

# Home Assistant

Інтеграція Home Assistant відкриває всі принтери Bambu Lab як пристрої в Home Assistant через MQTT Discovery — автоматично, без ручного налаштування YAML.

Перейдіть до: **https://localhost:3443/#settings** → вкладка **Інтеграції → Home Assistant**

## Передумови

- Home Assistant працює в мережі
- MQTT-брокер (Mosquitto) встановлений та налаштований в Home Assistant
- Bambu Dashboard та Home Assistant використовують один і той же MQTT-брокер

## Увімкнення MQTT Discovery

1. Перейдіть до **Налаштування → Інтеграції → Home Assistant**
2. Заповніть налаштування MQTT-брокера (якщо ще не налаштовано):
   - **Адреса брокера**: наприклад `192.168.1.100`
   - **Порт**: `1883` (або `8883` для TLS)
   - **Ім'я користувача та пароль**: якщо вимагається брокером
3. Увімкніть **MQTT Discovery**
4. Встановіть **Префікс Discovery**: стандарт `homeassistant`
5. Натисніть **Зберегти та увімкнути**

Bambu Dashboard тепер публікує повідомлення Discovery для всіх зареєстрованих принтерів.

## Пристрої в Home Assistant

Після активації в Home Assistant з'являється новий пристрій на кожний принтер (**Налаштування → Пристрої та служби → MQTT**):

### Шаблон ID сутностей

ID сутностей відповідають шаблону `sensor.{printer_name_slug}_{sensor_id}`, де `printer_name_slug` — назва принтера у нижньому регістрі зі спеціальними символами, заміненими підкресленням. Приклад: принтер з назвою «Мій P1S» дає `sensor.miy_p1s_status`.

### Сенсори (читання)

| ID сенсора | Одиниця | Приклад |
|---|---|---|
| `{slug}_status` | текст | `RUNNING` |
| `{slug}_progress` | % | `47` |
| `{slug}_remaining` | хв | `83` |
| `{slug}_layer` | число | `124` |
| `{slug}_total_layers` | число | `280` |
| `{slug}_nozzle_temp` | °C | `220.5` |
| `{slug}_nozzle_target` | °C | `220.0` |
| `{slug}_bed_temp` | °C | `60.1` |
| `{slug}_bed_target` | °C | `60.0` |
| `{slug}_chamber_temp` | °C | `34.2` |
| `{slug}_current_file` | текст | `benchy.3mf` |
| `{slug}_speed` | % | `100` |
| `{slug}_wifi_signal` | текст | `-65dBm` |

### Бінарні сенсори

| ID сенсора | Стан |
|---|---|
| `{slug}_printing` | `on` / `off` |
| `{slug}_online` | `on` / `off` |

:::info Примітка
Кнопки (пауза/відновлення/зупинка) не публікуються через MQTT Discovery. Використовуйте API Bambu Dashboard для надсилання команд з автоматизацій.
:::

## Приклади автоматизацій

### Сповістити на мобільний, коли друк завершено

Замініть `min_p1s` на slug-назву вашого принтера.

```yaml
automation:
  - alias: "Bambu - Друк завершено"
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
          title: "Друк завершено!"
          message: "{{ states('sensor.min_p1s_current_file') }} готово."
```

### Зменшити освітлення під час друку

```yaml
automation:
  - alias: "Bambu - Приглушити освітлення під час друку"
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

## Моніторинг енергоспоживання

Вимірювання електроенергії через Shelly або Tasmota обробляється окремо і не відкривається безпосередньо через MQTT Discovery в Home Assistant. Дивіться [Вимірювання електроенергії](./power) для налаштування розумної розетки.
