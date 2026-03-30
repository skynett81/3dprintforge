---
sidebar_position: 1
title: 欢迎使用 Bambu Dashboard
description: 适用于 Bambu Lab 3D 打印机的强大自托管仪表板
---

# 欢迎使用 Bambu Dashboard

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V21NRKM7)

**Bambu Dashboard** 是一款适用于 Bambu Lab 3D 打印机的自托管全功能控制面板。它让您从单个浏览器标签页就能全面了解和控制打印机、耗材库存、打印历史记录等所有内容。

## 什么是 Bambu Dashboard？

Bambu Dashboard 通过局域网 MQTT 直接连接到您的打印机，无需依赖 Bambu Lab 的服务器。您也可以连接 Bambu Cloud 以同步模型和打印历史记录。

### 主要功能

- **实时仪表板** — 实时温度、进度、摄像头、带 LIVE 指示器的 AMS 状态
- **耗材库存** — 通过 AMS 同步、EXT 料盘支持、材料信息、打印板兼容性和干燥指南管理所有料卷
- **耗材追踪** — 四级回退精准追踪（AMS 传感器 → EXT 估算 → 云端 → 时长）
- **材料指南** — 15 种材料的温度、打印板兼容性、干燥、特性和使用建议
- **打印历史** — 完整日志，包含模型名称、MakerWorld 链接、耗材用量和费用
- **打印计划** — 日历视图、带负载均衡和耗材检查的打印队列
- **打印机控制** — 温度、速度、风扇、G-code 控制台
- **Print Guard** — 基于 xcam + 5 个传感器监视器的自动保护
- **成本估算** — 材料、电力、人工、损耗、利润率及销售价格建议
- **维护** — 基于 KB 的间隔、喷嘴寿命、打印板寿命和指南追踪
- **声音警报** — 9 个可配置事件，支持自定义声音上传和打印机扬声器（M300）
- **活动日志** — 所有事件（打印、错误、维护、耗材）的持久时间轴
- **通知** — 7 个渠道（Telegram、Discord、电子邮件、ntfy、Pushover、短信、webhook）
- **多打印机** — 支持完整的 Bambu Lab 系列
- **17 种语言** — 挪威语、英语、德语、法语、西班牙语、意大利语、日语、韩语、荷兰语、波兰语、葡萄牙语、瑞典语、土耳其语、乌克兰语、中文、捷克语、匈牙利语
- **自托管** — 无云依赖，您的数据在您自己的设备上

### v1.1.14 新功能

- **AdminLTE 4 集成** — 完整的 HTML 重构，包含树形视图侧边栏、现代布局和 CDN 的 CSP 支持
- **CRM 系统** — 完整的客户管理，包含 4 个面板：客户、订单、发票和带历史记录集成的公司设置
- **现代 UI** — teal 强调色、渐变标题、悬停发光、浮动球体和改进的深色主题
- **成就：18 个地标** — 维京船、自由女神像、Eiffel Tower、Big Ben、勃兰登堡门、Sagrada Familia、Colosseum、Tokyo Tower、Gyeongbokgung、荷兰风车、Wawel 龙、Cristo Redentor、Turning Torso、Hagia Sophia、祖国母亲、万里长城、布拉格天文钟、布达佩斯议会大厦 — 附带详情弹窗、XP 和稀有度
- **AMS 湿度/温度** — 5 级评估，附带存储和干燥建议
- **实时耗材追踪** — 通过云端估算回退在打印过程中实时更新
- **耗材区域重新设计** — 大型料卷，包含完整信息（品牌、重量、温度、RFID、颜色），水平布局，点击查看详情
- **EXT 料盘内联** — 外部料盘与 AMS 料盘并排显示，更好地利用空间
- **仪表板布局优化** — 24–27" 显示器默认 2 列，大型 3D/摄像头，紧凑型耗材/AMS
- **耗材更换时间** 在成本估算器中显示，附带可见的更换计数器
- **全局警报系统** — 带有右下角 toast 通知的警报栏，不阻挡导航栏
- **导览 i18n** — 所有 14 个导览键翻译成 17 种语言
- **5 个新 KB 页面** — 兼容性矩阵和新耗材指南翻译成 17 种语言
- **完整 i18n** — 所有 3252 个键翻译成 17 种语言，包括 CRM 和地标成就

## 快速开始

| 任务 | 链接 |
|------|------|
| 安装仪表板 | [安装](./getting-started/installation) |
| 配置第一台打印机 | [设置](./getting-started/setup) |
| 连接 Bambu Cloud | [Bambu Cloud](./getting-started/bambu-cloud) |
| 探索所有功能 | [功能](./features/overview) |
| 耗材指南 | [材料指南](./kb/filaments/guide) |
| 维护指南 | [维护](./kb/maintenance/nozzle) |
| API 文档 | [API](./advanced/api) |

:::tip 演示模式
您可以通过运行 `npm run demo` 在没有物理打印机的情况下体验仪表板。这将启动 3 台带有实时打印周期的模拟打印机。
:::

## 支持的打印机

所有支持 LAN 模式的 Bambu Lab 打印机：

- **X1 系列**：X1C、X1C Combo、X1E
- **P1 系列**：P1S、P1S Combo、P1P
- **P2 系列**：P2S、P2S Combo
- **A 系列**：A1、A1 Combo、A1 mini
- **H2 系列**：H2S、H2D（双喷嘴）、H2C（换刀装置，6 个打印头）

## 功能详解

### 耗材追踪

仪表板通过四级回退自动追踪耗材消耗：

1. **AMS 传感器差值** — 最精准，比较开始/结束剩余百分比
2. **EXT 直接** — 适用于没有 vt_tray 的 P2S/A1，使用云端估算
3. **云端估算** — 来自 Bambu Cloud 打印任务数据
4. **时长估算** — 最后回退方案，约 30g/小时

所有值均显示为 AMS 传感器和料卷数据库的最小值，以避免打印失败后出现错误。

### 材料指南

内置数据库包含 15 种材料：
- 温度（喷嘴、热床、腔体）
- 打印板兼容性（Cool、Engineering、High Temp、Textured PEI）
- 干燥信息（温度、时间、吸湿性）
- 8 种特性（强度、柔韧性、耐热性、UV、表面、易用性）
- 难度等级和特殊要求（硬化喷嘴、封闭腔体）

### 声音警报

9 个可配置事件，支持：
- **自定义音频片段** — 上传 MP3/OGG/WAV（最长 10 秒，500 KB）
- **内置音调** — 使用 Web Audio API 生成的金属/合成音效
- **打印机扬声器** — 直接通过打印机蜂鸣器播放 M300 G-code 旋律
- **倒计时** — 打印剩余 1 分钟时的声音警报

### 维护

完整的维护系统：
- 组件追踪（喷嘴、PTFE 管、导轨、轴承、AMS、打印板、干燥）
- 来自文档的基于 KB 的间隔
- 按类型的喷嘴寿命（黄铜、硬化钢、HS01）
- 按类型的打印板寿命（Cool、Engineering、High Temp、Textured PEI）
- 带提示和完整文档链接的指南标签

## 技术概述

Bambu Dashboard 使用 Node.js 22 和原生 HTML/CSS/JS 构建 — 没有重型框架，没有构建步骤。数据库是 Node.js 22 内置的 SQLite。

- **后端**：Node.js 22，仅使用 3 个 npm 包（mqtt、ws、basic-ftp）
- **前端**：原生 HTML/CSS/JS，无构建步骤
- **数据库**：通过 Node.js 22 内置 `--experimental-sqlite` 使用 SQLite
- **文档**：支持 17 种语言的 Docusaurus，安装时自动构建
- **API**：177+ 个端点，`/api/docs` 提供 OpenAPI 文档

详情请参阅[架构](./advanced/architecture)。
