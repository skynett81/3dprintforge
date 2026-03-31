---
sidebar_position: 4
title: 插件系统
description: 创建和安装插件以扩展 3DPrintForge 的功能
---

# 插件系统

3DPrintForge 支持插件系统，允许您在不修改源代码的情况下扩展功能。

:::info 实验性功能
插件系统正在积极开发中。API 可能在不同版本之间发生变化。
:::

## 插件能做什么？

- 添加新的 API 端点
- 监听打印机事件并作出响应
- 添加新的前端面板
- 与第三方服务集成
- 扩展通知渠道

## 插件结构

插件是 `plugins/` 目录中的 Node.js 模块：

```
plugins/
└── my-plugin/
    ├── plugin.json    # 元数据
    ├── index.js       # 入口文件
    └── README.md      # 文档（可选）
```

### plugin.json

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "插件说明",
  "author": "您的名字",
  "main": "index.js",
  "hooks": ["onPrintStart", "onPrintEnd", "onPrinterConnect"]
}
```

### index.js

```javascript
module.exports = {
  // 插件加载时调用
  async onLoad(context) {
    const { api, db, logger, events } = context;
    logger.info('我的插件已加载');

    // 注册新的 API 路由
    api.get('/plugins/my-plugin/status', (req, res) => {
      res.json({ status: '活跃' });
    });
  },

  // 打印开始时调用
  async onPrintStart(context, printJob) {
    const { logger } = context;
    logger.info(`打印开始：${printJob.name}`);
  },

  // 打印完成时调用
  async onPrintEnd(context, printJob) {
    const { logger, db } = context;
    logger.info(`打印完成：${printJob.name}`);
    // 将数据保存到数据库
    await db.run(
      'INSERT INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
      ['my-plugin', 'last-print', printJob.name]
    );
  }
};
```

## 可用的钩子

| 钩子 | 触发时机 |
|------|---------|
| `onLoad` | 插件加载时 |
| `onUnload` | 插件卸载时 |
| `onPrinterConnect` | 打印机连接时 |
| `onPrinterDisconnect` | 打印机断开时 |
| `onPrintStart` | 打印开始时 |
| `onPrintEnd` | 打印完成时 |
| `onPrintFail` | 打印失败时 |
| `onFilamentChange` | 耗材更换时 |
| `onAmsUpdate` | AMS 状态更新时 |

## 插件上下文

所有钩子都接收一个 `context` 对象：

| 属性 | 类型 | 说明 |
|----------|------|-------------|
| `api` | Express Router | 添加自定义 API 路由 |
| `db` | SQLite | 访问数据库 |
| `logger` | Logger | 日志记录 |
| `events` | EventEmitter | 监听事件 |
| `config` | Object | 仪表板配置 |
| `printers` | Map | 所有已连接的打印机 |

## 安装插件

```bash
# 复制插件文件夹
cp -r my-plugin/ plugins/

# 重启仪表板
npm start
```

如果插件存在于 `plugins/` 目录中，它将在启动时自动激活。

## 禁用插件

在 `plugin.json` 中添加 `"disabled": true`，或删除该文件夹。

## 示例插件：Slack 通知

```javascript
const { IncomingWebhook } = require('@slack/webhook');

module.exports = {
  async onLoad(context) {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  },

  async onPrintEnd(context, job) {
    await this.webhook.send({
      text: `打印完成！*${job.name}* 耗时 ${job.duration}`
    });
  }
};
```
