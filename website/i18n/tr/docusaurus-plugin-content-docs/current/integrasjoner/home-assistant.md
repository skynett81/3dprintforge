---
sidebar_position: 1
title: Home Assistant
description: MQTT keşfi, otomatik varlıklar ve otomasyon örnekleriyle Bambu Dashboard'u Home Assistant ile entegre edin
---

# Home Assistant

Home Assistant entegrasyonu, tüm Bambu Lab yazıcılarını MQTT Discovery aracılığıyla Home Assistant'ta varlık olarak gösterir — YAML'ın manuel yapılandırması olmadan otomatik olarak.

Gidin: **https://localhost:3443/#settings** → **Entegrasyonlar → Home Assistant** sekmesi

## Ön Koşullar

- Ağda çalışan Home Assistant
- Home Assistant'ta kurulu ve yapılandırılmış MQTT aracısı (Mosquitto)
- Bambu Dashboard ve Home Assistant aynı MQTT aracısını kullanıyor

## MQTT Discovery'yi Etkinleştirme

1. **Ayarlar → Entegrasyonlar → Home Assistant**'a gidin
2. MQTT aracısı ayarlarını doldurun (henüz yapılandırılmamışsa):
   - **Aracı adresi**: örn. `192.168.1.100`
   - **Port**: `1883` (veya TLS için `8883`)
   - **Kullanıcı adı ve şifre**: aracı tarafından gerekliyse
3. **MQTT Discovery**'yi etkinleştirin
4. **Discovery ön ekini** ayarlayın: varsayılan `homeassistant`'tır
5. **Kaydet ve Etkinleştir**'e tıklayın

Bambu Dashboard artık tüm kayıtlı yazıcılar için discovery mesajları yayınlar.

## Home Assistant'taki Varlıklar

Aktivasyondan sonra Home Assistant'ta yazıcı başına yeni bir varlık görünür (**Ayarlar → Cihazlar ve Hizmetler → MQTT**):

### Varlık Kimliği Deseni

Varlık kimlikleri `sensor.{printer_name_slug}_{sensor_id}` desenini izler; burada `printer_name_slug`, özel karakterlerin alt çizgiyle değiştirildiği küçük harfli yazıcı adıdır. Örnek: «Min P1S» adlı bir yazıcı `sensor.min_p1s_status` verir.

### Sensörler (okuma)

| Sensör Kimliği | Birim | Örnek |
|---|---|---|
| `{slug}_status` | metin | `RUNNING` |
| `{slug}_progress` | % | `47` |
| `{slug}_remaining` | dk | `83` |
| `{slug}_layer` | sayı | `124` |
| `{slug}_total_layers` | sayı | `280` |
| `{slug}_nozzle_temp` | °C | `220.5` |
| `{slug}_nozzle_target` | °C | `220.0` |
| `{slug}_bed_temp` | °C | `60.1` |
| `{slug}_bed_target` | °C | `60.0` |
| `{slug}_chamber_temp` | °C | `34.2` |
| `{slug}_current_file` | metin | `benchy.3mf` |
| `{slug}_speed` | % | `100` |
| `{slug}_wifi_signal` | metin | `-65dBm` |

### İkili Sensörler

| Sensör Kimliği | Durum |
|---|---|
| `{slug}_printing` | `on` / `off` |
| `{slug}_online` | `on` / `off` |

:::info Not
Düğmeler (duraklat/devam et/durdur) MQTT Discovery aracılığıyla yayınlanmaz. Otomasyonlardan komut göndermek için Bambu Dashboard API'sini kullanın.
:::

## Otomasyon Örnekleri

### Baskı Bittiğinde Mobilde Bildir

`min_p1s`'i yazıcınızın ad kısa adıyla değiştirin.

```yaml
automation:
  - alias: "Bambu - Baskı bitti"
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
          title: "Baskı bitti!"
          message: "{{ states('sensor.min_p1s_current_file') }} tamamlandı."
```

### Baskı Başladığında Işıkları Kapat

```yaml
automation:
  - alias: "Bambu - Yazdırma sırasında ışıkları kıs"
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

## Enerji İzleme

Shelly veya Tasmota aracılığıyla güç ölçümü ayrı olarak yönetilir ve MQTT Discovery aracılığıyla doğrudan Home Assistant'a gösterilmez. Akıllı fiş kurulumu için [Güç Ölçümü](./power) sayfasına bakın.
