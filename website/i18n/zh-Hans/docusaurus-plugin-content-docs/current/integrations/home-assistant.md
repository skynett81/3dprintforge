---
sidebar_position: 1
title: Home Assistant
description: 通过 MQTT 自动发现、自动化实体和自动化示例将 Bambu Dashboard 与 Home Assistant 集成
---

# Home Assistant

Home Assistant 集成通过 MQTT 自动发现将所有拓竹打印机作为实体暴露给 Home Assistant——全自动，无需手动配置 YAML。

访问地址：**https://localhost:3443/#settings** → **集成 → Home Assistant**标签

## 前提条件

- Home Assistant 在网络中运行
- MQTT 代理（Mosquitto）已在 Home Assistant 中安装和配置
- Bambu Dashboard 和 Home Assistant 使用同一个 MQTT 代理

## 启用 MQTT 自动发现

1. 进入**设置 → 集成 → Home Assistant**
2. 填写 MQTT 代理设置（如果尚未配置）：
   - **代理地址**：例如 `192.168.1.100`
   - **端口**：`1883`（或 `8883` 用于 TLS）
   - **用户名和密码**：如果代理需要
3. 启用 **MQTT 自动发现**
4. 设置**发现前缀**：默认为 `homeassistant`
5. 点击**保存并激活**

Bambu Dashboard 现在将为所有已注册的打印机发布自动发现消息。

## Home Assistant 中的设备

激活后，每台打印机在 Home Assistant 中显示为一个新设备（**设置 → 设备和服务 → MQTT**）：

### 实体 ID 规则

实体 ID 遵循 `sensor.{printer_name_slug}_{sensor_id}` 格式，其中 `printer_name_slug` 是打印机名称的小写形式，特殊字符替换为下划线。示例：名为"我的 P1S"的打印机将生成 `sensor.wo_de_p1s_status`。

### 传感器（只读）

| 传感器 ID | 单位 | 示例 |
|---|---|---|
| `{slug}_status` | 文本 | `RUNNING` |
| `{slug}_progress` | % | `47` |
| `{slug}_remaining` | 分钟 | `83` |
| `{slug}_layer` | 数字 | `124` |
| `{slug}_total_layers` | 数字 | `280` |
| `{slug}_nozzle_temp` | °C | `220.5` |
| `{slug}_nozzle_target` | °C | `220.0` |
| `{slug}_bed_temp` | °C | `60.1` |
| `{slug}_bed_target` | °C | `60.0` |
| `{slug}_chamber_temp` | °C | `34.2` |
| `{slug}_current_file` | 文本 | `benchy.3mf` |
| `{slug}_speed` | % | `100` |
| `{slug}_wifi_signal` | 文本 | `-65dBm` |

### 二元传感器

| 传感器 ID | 状态 |
|---|---|
| `{slug}_printing` | `on` / `off` |
| `{slug}_online` | `on` / `off` |

:::info 注意
按钮（暂停/继续/停止）不通过 MQTT 自动发现发布。请使用 Bambu Dashboard API 从自动化中发送命令。
:::

## 自动化示例

### 打印完成时在手机上通知

将 `min_p1s` 替换为您打印机的名称简写。

```yaml
automation:
  - alias: "Bambu - 打印完成"
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
          title: "打印完成！"
          message: "{{ states('sensor.min_p1s_current_file') }} 已完成。"
```

### 打印开始时调暗灯光

```yaml
automation:
  - alias: "Bambu - 打印时调暗灯光"
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

## 能耗监控

通过 Shelly 或 Tasmota 的电量测量单独处理，不直接通过 MQTT 自动发现暴露给 Home Assistant。有关智能插座设置，请参见[智能插座](./power)。
