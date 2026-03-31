---
sidebar_position: 1
title: API 参考
description: 包含 284+ 端点的 REST API，支持身份验证和速率限制
---

# API 参考

3DPrintForge 提供功能完整的 REST API，包含 284+ 个端点。API 文档可直接在仪表板中查阅。

## 交互式文档

在浏览器中打开 OpenAPI 文档：

```
https://你的服务器:3443/api/docs
```

在这里，您可以找到所有端点、参数、请求/响应模式，并可直接测试 API。

## 身份验证

API 使用 **Bearer token** 身份验证（JWT）：

```bash
# 登录并获取令牌
curl -X POST https://你的服务器:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "你的密码"}'

# 响应
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

在所有后续请求中使用该令牌：

```bash
curl https://你的服务器:3443/api/printers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 速率限制

API 设有速率限制以保护服务器：

| 限制 | 值 |
|--------|-------|
| 每分钟请求数 | 200 |
| 突发（每秒最大值） | 20 |
| 超限时的响应 | `429 Too Many Requests` |

响应中的 `Retry-After` 标头会指明距下次允许请求还有多少秒。

## 端点概览

### 身份验证
| 方法 | 端点 | 说明 |
|--------|-----------|-------------|
| POST | `/api/auth/login` | 登录，获取 JWT |
| POST | `/api/auth/logout` | 登出 |
| GET | `/api/auth/me` | 获取当前登录用户 |

### 打印机
| 方法 | 端点 | 说明 |
|--------|-----------|-------------|
| GET | `/api/printers` | 列出所有打印机 |
| POST | `/api/printers` | 添加打印机 |
| GET | `/api/printers/:id` | 获取打印机 |
| PUT | `/api/printers/:id` | 更新打印机 |
| DELETE | `/api/printers/:id` | 删除打印机 |
| GET | `/api/printers/:id/status` | 实时状态 |
| POST | `/api/printers/:id/command` | 发送命令 |

### 耗材
| 方法 | 端点 | 说明 |
|--------|-----------|-------------|
| GET | `/api/filaments` | 列出所有耗材卷 |
| POST | `/api/filaments` | 添加耗材卷 |
| PUT | `/api/filaments/:id` | 更新耗材卷 |
| DELETE | `/api/filaments/:id` | 删除耗材卷 |
| GET | `/api/filaments/stats` | 消耗统计 |

### 打印历史
| 方法 | 端点 | 说明 |
|--------|-----------|-------------|
| GET | `/api/history` | 列出历史记录（分页） |
| GET | `/api/history/:id` | 获取单次打印 |
| GET | `/api/history/export` | 导出 CSV |
| GET | `/api/history/stats` | 统计数据 |

### 打印队列
| 方法 | 端点 | 说明 |
|--------|-----------|-------------|
| GET | `/api/queue` | 获取队列 |
| POST | `/api/queue` | 添加任务 |
| PUT | `/api/queue/:id` | 更新任务 |
| DELETE | `/api/queue/:id` | 删除任务 |
| POST | `/api/queue/dispatch` | 强制派送 |

## WebSocket API

除 REST API 外，还提供用于实时数据的 WebSocket API：

```javascript
const ws = new WebSocket('wss://你的服务器:3443/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
```

### 消息类型（传入）
- `printer.status` — 打印机状态更新
- `print.progress` — 打印进度更新
- `ams.update` — AMS 状态变化
- `notification` — 通知消息

## 错误代码

| 代码 | 含义 |
|------|-------|
| 200 | 成功 |
| 201 | 已创建 |
| 400 | 无效请求 |
| 401 | 未认证 |
| 403 | 未授权 |
| 404 | 未找到 |
| 429 | 请求过多 |
| 500 | 服务器错误 |
