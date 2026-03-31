---
sidebar_position: 2
title: 技术架构
description: 3DPrintForge 的架构概述——技术栈、模块、数据库和 WebSocket
---

# 技术架构

## 系统架构图

```
浏览器 <──WebSocket──> Node.js <──MQTTS:8883──> 打印机
浏览器 <──WS:9001+──> ffmpeg  <──RTSPS:322───> 摄像头
```

仪表板通过 MQTT over TLS（端口 8883）与打印机通信，通过 RTSPS（端口 322）与摄像头通信。浏览器通过 HTTPS 和 WebSocket 连接到仪表板。

## 技术栈

| 层级 | 技术 |
|-----|-----------|
| 前端 | 原生 HTML/CSS/JS — 76 个组件模块，无需构建步骤，无框架 |
| 后端 | Node.js 22，仅依赖 3 个 npm 包：`mqtt`、`ws`、`basic-ftp` |
| 数据库 | SQLite（通过 `--experimental-sqlite` 内置于 Node.js 22） |
| 摄像头 | ffmpeg 将 RTSPS 转码为 MPEG1，jsmpeg 在浏览器中渲染 |
| 实时通信 | WebSocket 集线器将打印机状态推送给所有已连接的客户端 |
| 协议 | MQTT over TLS（端口 8883），使用打印机的 LAN Access Code |

## 端口

| 端口 | 协议 | 方向 | 说明 |
|------|-----------|---------|-------------|
| 3000 | HTTP + WS | 入 | 仪表板（重定向到 HTTPS） |
| 3443 | HTTPS + WSS | 入 | 安全仪表板（默认） |
| 9001+ | WS | 入 | 摄像头流（每台打印机一个） |
| 8883 | MQTTS | 出 | 连接到打印机 |
| 322 | RTSPS | 出 | 来自打印机的摄像头 |

## 服务器模块（44 个）

| 模块 | 功能 |
|-------|--------|
| `index.js` | HTTP/HTTPS 服务器，自动 SSL，CSP/HSTS 标头，静态文件，演示模式 |
| `config.js` | 配置加载、默认值、环境变量覆盖和迁移 |
| `database.js` | SQLite 模式，105 次迁移，CRUD 操作 |
| `api-routes.js` | REST API（284+ 个端点） |
| `auth.js` | 身份验证和会话管理 |
| `backup.js` | 备份和还原 |
| `printer-manager.js` | 打印机生命周期，MQTT 连接管理 |
| `mqtt-client.js` | 连接到拓竹打印机的 MQTT 客户端 |
| `mqtt-commands.js` | MQTT 命令构建（暂停、继续、停止等） |
| `websocket-hub.js` | WebSocket 广播给所有浏览器客户端 |
| `camera-stream.js` | 摄像头流的 ffmpeg 进程管理 |
| `print-tracker.js` | 打印任务追踪、状态转换、历史记录日志 |
| `print-guard.js` | 通过 xcam + 传感器监控进行打印保护 |
| `queue-manager.js` | 带有多打印机派送和负载均衡的打印队列 |
| `slicer-service.js` | 本地切片器 CLI 桥接，文件上传，FTPS 上传 |
| `telemetry.js` | 遥测数据处理 |
| `telemetry-sampler.js` | 时间序列数据采样 |
| `thumbnail-service.js` | 通过 FTPS 从打印机 SD 卡获取缩略图 |
| `timelapse-service.js` | 延时摄影录制和管理 |
| `notifications.js` | 7 通道通知系统（Telegram、Discord、邮件、Webhook、ntfy、Pushover、SMS） |
| `updater.js` | GitHub Releases 自动更新（含备份） |
| `setup-wizard.js` | 首次使用的基于网页的设置向导 |
| `ecom-license.js` | 许可证管理 |
| `failure-detection.js` | 故障检测和分析 |
| `bambu-cloud.js` | 拓竹云 API 集成 |
| `bambu-rfid-data.js` | 来自 AMS 的 RFID 耗材数据 |
| `circuit-breaker.js` | 服务稳定性的断路器模式 |
| `energy-service.js` | 能源和电价计算 |
| `error-pattern-analyzer.js` | HMS 错误的模式分析 |
| `file-parser.js` | 3MF/GCode 文件解析 |
| `logger.js` | 结构化日志记录 |
| `material-recommender.js` | 材料推荐 |
| `milestone-service.js` | 里程碑和成就追踪 |
| `plugin-manager.js` | 扩展插件系统 |
| `power-monitor.js` | 智能插座集成（Shelly/Tasmota） |
| `price-checker.js` | 电价获取（Tibber/Nordpool） |
| `printer-discovery.js` | LAN 上的自动打印机发现 |
| `remote-nodes.js` | 多节点管理 |
| `report-service.js` | 报告生成 |
| `seed-filament-db.js` | 耗材数据库数据填充 |
| `spoolease-data.js` | SpoolEase 集成 |
| `validate.js` | 输入验证 |
| `wear-prediction.js` | 组件磨损预测 |

## 前端组件（76 个）

所有组件均为原生 JavaScript 模块，无需构建步骤。通过 `<script type="module">` 直接在浏览器中加载。

| 组件 | 功能 |
|-----------|--------|
| `print-preview.js` | 3D 模型查看器 + MakerWorld 图片获取 |
| `model-viewer.js` | WebGL 3D 渲染，带层动画 |
| `temperature-gauge.js` | 动画 SVG 环形仪表 |
| `sparkline-stats.js` | Grafana 风格的统计面板 |
| `ams-panel.js` | AMS 耗材可视化 |
| `camera-view.js` | jsmpeg 视频播放器，支持全屏 |
| `controls-panel.js` | 打印机控制 UI |
| `history-table.js` | 打印历史，含搜索、筛选、CSV 导出 |
| `filament-tracker.js` | 耗材库存，含收藏、颜色筛选 |
| `queue-panel.js` | 打印队列管理 |
| `knowledge-panel.js` | 知识库阅读器和编辑器 |

## 数据库

SQLite 数据库内置于 Node.js 22，无需外部安装。模式由 `db/migrations.js` 中的 105 次迁移管理。

主要数据表：

- `printers` — 打印机配置
- `print_history` — 所有打印任务
- `filaments` — 耗材库存
- `ams_slots` — AMS 槽位绑定
- `queue` — 打印队列
- `notifications_config` — 通知设置
- `maintenance_log` — 维护日志

## 安全性

- HTTPS，使用自动生成的证书（或您自己的证书）
- 基于 JWT 的身份验证
- CSP 和 HSTS 标头
- 速率限制（200 请求/分钟）
- 核心功能不依赖任何外部云服务
