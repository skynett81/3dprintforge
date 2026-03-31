---
sidebar_position: 4
title: API 试验场
description: 直接在浏览器中测试所有 177 个 API 端点，内置 OpenAPI 文档和身份验证
---

# API 试验场

API 试验场让您直接在浏览器中探索和测试 3DPrintForge 的所有 177 个 API 端点——无需编写代码。

访问地址：**https://localhost:3443/api/docs**

## 什么是 API 试验场

试验场是 OpenAPI 文档（Swagger UI）的交互式版本，与仪表板完全集成。登录后即已通过身份验证，可以直接测试端点。

## 浏览文档

端点按类别组织：

| 类别 | 端点数量 | 说明 |
|---|---|---|
| 打印机 | 24 | 获取状态、控制、配置 |
| 打印 / 历史 | 18 | 获取、搜索、导出历史 |
| 耗材 | 22 | 库存、线卷、配置文件 |
| 队列 | 12 | 管理打印队列 |
| 统计数据 | 15 | 聚合统计和导出 |
| 通知 | 8 | 配置和测试通知渠道 |
| 用户 | 10 | 用户、角色、API 密钥 |
| 设置 | 14 | 读取和修改配置 |
| 维护 | 12 | 维护任务和日志 |
| 集成 | 18 | HA、Tibber、Webhook 等 |
| 文件库 | 14 | 上传、分析、管理 |
| 系统 | 10 | 备份、健康状态、日志 |

点击某个类别展开并查看所有端点。

## 测试端点

1. 点击某个端点（例如 `GET /api/printers`）
2. 点击 **Try it out**（试用）
3. 填写所需参数（筛选、分页、打印机 ID 等）
4. 点击 **Execute**（执行）
5. 查看下方响应：HTTP 状态码、响应头和 JSON 正文

### 示例：获取所有打印机

```
GET /api/printers
```
返回所有已注册打印机的列表及其实时状态。

### 示例：向打印机发送命令

```
POST /api/printers/{id}/command
Body: {"command": "pause"}
```

:::warning 生产环境
API 试验场连接到实际系统。命令将发送到真实的打印机。操作 `DELETE` 和 `POST /command` 等具有破坏性的操作时请谨慎。
:::

## 身份验证

### 会话验证（已登录用户）
登录仪表板后，试验场已通过 session cookie 自动完成身份验证。无需额外配置。

### API 密钥验证

用于外部访问：

1. 点击 **Authorize**（试验场顶部的锁图标）
2. 在 **ApiKeyAuth** 字段中填写您的 API 密钥：`Bearer 您的密钥`
3. 点击 **Authorize**

在**设置 → API 密钥**中生成 API 密钥（参见[身份验证](../system/auth)）。

## 速率限制

API 对每个用户/密钥设有**每分钟 200 次请求**的速率限制。试验场在响应头 `X-RateLimit-Remaining` 中显示剩余请求次数。

:::info OpenAPI 规范
以 YAML 或 JSON 格式下载完整的 OpenAPI 规范：
- `https://localhost:3443/api/docs/openapi.yaml`
- `https://localhost:3443/api/docs/openapi.json`

使用该规范在 Python、TypeScript、Go 等语言中生成客户端库。
:::

## Webhook 测试

直接测试 Webhook 集成：

1. 进入 `POST /api/webhooks/test`
2. 从下拉列表中选择事件类型
3. 系统向已配置的 Webhook URL 发送测试事件
4. 在试验场中查看请求/响应
