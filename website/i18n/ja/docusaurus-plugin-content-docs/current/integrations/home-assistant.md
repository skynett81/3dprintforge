---
sidebar_position: 1
title: Home Assistant
description: MQTTディスカバリー、自動エンティティ、自動化サンプルを使用してBambu DashboardをHome Assistantと統合する
---

# Home Assistant

Home Assistant統合では、MQTT Discoveryを通じてすべてのBambu Labプリンターを自動的にHome Assistantのエンティティとして公開します — YAMLの手動設定なしに。

アクセス先：**https://localhost:3443/#settings** → タブ **統合 → Home Assistant**

## 前提条件

- ネットワーク上でHome Assistantが稼働している
- Home AssistantにMQTTブローカー（Mosquitto）がインストール・設定されている
- Bambu DashboardとHome Assistantが同じMQTTブローカーを使用している

## MQTT Discoveryを有効にする

1. **設定 → 統合 → Home Assistant**に移動します
2. MQTTブローカーの設定を入力します（まだ設定していない場合）：
   - **ブローカーアドレス**：例 `192.168.1.100`
   - **ポート**：`1883`（またはTLSの場合は`8883`）
   - **ユーザー名とパスワード**：ブローカーで必要な場合
3. **MQTT Discovery**を有効にします
4. **Discoveryプレフィックス**を設定：標準は`homeassistant`
5. **保存して有効化**をクリックします

Bambu Dashboardが登録済みプリンターすべてのDiscoveryメッセージを公開します。

## Home Assistantのエンティティ

有効化後、Home Assistantにプリンターごとに新しいデバイスが表示されます（**設定 → デバイスとサービス → MQTT**）：

### エンティティIDパターン

エンティティIDは`sensor.{printer_name_slug}_{sensor_id}`のパターンに従います。`printer_name_slug`はプリンター名を小文字にして特殊文字をアンダースコアに置換したものです。例：「Min P1S」という名前のプリンターは`sensor.min_p1s_status`になります。

### センサー（読み取り）

| センサーID | 単位 | 例 |
|---|---|---|
| `{slug}_status` | テキスト | `RUNNING` |
| `{slug}_progress` | % | `47` |
| `{slug}_remaining` | 分 | `83` |
| `{slug}_layer` | 数値 | `124` |
| `{slug}_total_layers` | 数値 | `280` |
| `{slug}_nozzle_temp` | °C | `220.5` |
| `{slug}_nozzle_target` | °C | `220.0` |
| `{slug}_bed_temp` | °C | `60.1` |
| `{slug}_bed_target` | °C | `60.0` |
| `{slug}_chamber_temp` | °C | `34.2` |
| `{slug}_current_file` | テキスト | `benchy.3mf` |
| `{slug}_speed` | % | `100` |
| `{slug}_wifi_signal` | テキスト | `-65dBm` |

### バイナリセンサー

| センサーID | 状態 |
|---|---|
| `{slug}_printing` | `on` / `off` |
| `{slug}_online` | `on` / `off` |

:::info 注意
ボタン（一時停止/再開/停止）はMQTT Discovery経由では公開されません。自動化からコマンドを送信するにはBambu Dashboard APIを使用してください。
:::

## 自動化の例

### プリント完了時にモバイルに通知

`min_p1s`をお使いのプリンターの名前スラグに置き換えてください。

```yaml
automation:
  - alias: "Bambu - プリント完了"
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
          title: "プリント完了！"
          message: "{{ states('sensor.min_p1s_current_file') }} が完了しました。"
```

### プリント開始時に照明を暗くする

```yaml
automation:
  - alias: "Bambu - プリント中は照明を調光"
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

## エネルギー監視

ShellyまたはTasmotaによる電力測定は別途処理され、MQTT Discovery経由でHome Assistantに直接公開されません。スマートプラグの設定については[電力測定](./power)を参照してください。
