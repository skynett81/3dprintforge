---
sidebar_position: 6
title: 通知
description: 通过 Telegram、Discord、邮件、webhook、ntfy、Pushover 和 SMS 配置所有打印机事件的通知
---

# 通知

3DPrintForge 支持通过多种渠道发送通知，让您无论在家还是外出都能随时了解打印机动态。

访问地址：**https://localhost:3443/#settings** → **通知**标签

## 可用渠道

| 渠道 | 需要 | 支持图片 |
|---|---|---|
| Telegram | Bot 令牌 + Chat-ID | ✅ |
| Discord | Webhook URL | ✅ |
| 邮件 | SMTP 服务器 | ✅ |
| Webhook | URL + 可选密钥 | ✅（base64） |
| ntfy | ntfy 服务器 + topic | ❌ |
| Pushover | API 令牌 + User-key | ✅ |
| SMS（Twilio） | Account SID + Auth token | ❌ |
| 浏览器推送 | 无需配置 | ❌ |

## 各渠道设置

### Telegram

1. 通过 [@BotFather](https://t.me/BotFather) 创建 bot — 发送 `/newbot`
2. 复制 **bot 令牌**（格式：`123456789:ABC-def...`）
3. 与 bot 开始对话并发送 `/start`
4. 找到您的 **Chat-ID**：访问 `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. 在 3DPrintForge 中：粘贴令牌和 Chat-ID，点击**测试**

:::tip 群组频道
您可以使用 Telegram 群组作为接收者。群组的 Chat-ID 以 `-` 开头。
:::

### Discord

1. 打开要接收通知的 Discord 服务器
2. 进入频道设置 → **集成 → Webhooks**
3. 点击**新建 Webhook**，命名并选择频道
4. 复制 Webhook URL
5. 在 3DPrintForge 中粘贴 URL 并点击**测试**

### 邮件

1. 填写 SMTP 服务器、端口（TLS 通常为 587）
2. SMTP 账户的用户名和密码
3. **发件人**地址和**收件人**地址（多个用逗号分隔）
4. 启用 **TLS/STARTTLS** 以安全发送
5. 点击**测试**发送测试邮件

:::warning Gmail
对于 Gmail，请使用**应用专用密码**，而非普通密码。请先在 Google 账户中启用两步验证。
:::

### ntfy

1. 在 [ntfy.sh](https://ntfy.sh) 创建 topic，或运行自己的 ntfy 服务器
2. 填写服务器 URL（例如 `https://ntfy.sh`）和 topic 名称
3. 在手机上安装 ntfy 应用并订阅同一 topic
4. 点击**测试**

### Pushover

1. 在 [pushover.net](https://pushover.net) 注册账户
2. 创建新应用 — 复制 **API Token**
3. 在 Pushover 仪表板找到您的 **User Key**
4. 在 3DPrintForge 中填写两者并点击**测试**

### Webhook（自定义）

3DPrintForge 发送带有 JSON 负载的 HTTP POST 请求：

```json
{
  "event": "print_complete",
  "printer": "我的 X1C",
  "printer_id": "abc123",
  "timestamp": "2026-03-22T14:30:00Z",
  "data": {
    "file": "benchy.3mf",
    "duration_minutes": 47,
    "filament_used_g": 12.4
  }
}
```

添加**密钥**以使用标头 `X-Bambu-Signature` 中的 HMAC-SHA256 签名验证请求。

## 事件筛选

为每个渠道选择哪些事件应触发通知：

| 事件 | 说明 |
|---|---|
| 打印已开始 | 新打印开始 |
| 打印已完成 | 打印完成（含图片） |
| 打印已失败 | 打印因错误中断 |
| 打印已暂停 | 手动或自动暂停 |
| 打印守护报警 | XCam 或传感器触发操作 |
| 耗材不足 | 耗材卷接近用完 |
| AMS 错误 | 堵塞、耗材受潮等 |
| 打印机已断开 | MQTT 连接丢失 |
| 队列任务已派送 | 任务从队列派送 |

为每个渠道单独勾选所需的事件。

## 免打扰时段

避免夜间收到通知：

1. 在通知设置下启用**免打扰时段**
2. 设置**开始**和**结束**时间（例如 23:00 → 07:00）
3. 为计时器选择**时区**
4. 严重通知（打印守护错误）可以覆盖此设置 — 勾选**始终发送严重通知**

## 浏览器推送通知

直接在浏览器中接收通知，无需应用：

1. 进入**设置 → 通知 → 浏览器推送**
2. 点击**启用推送通知**
3. 在浏览器权限对话框中接受
4. 即使仪表板已最小化，通知也能正常工作（需要标签页保持打开）

:::info PWA
将 3DPrintForge 安装为 PWA，可在无需打开标签页的情况下在后台接收推送通知。请参见 [PWA](../system/pwa)。
:::
