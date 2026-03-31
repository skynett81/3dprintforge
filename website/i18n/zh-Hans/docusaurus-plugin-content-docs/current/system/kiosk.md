---
sidebar_position: 6
title: 信息亭模式
description: 将 3DPrintForge 设置为壁挂显示屏或 Hub 视图，支持信息亭模式和自动轮播
---

# 信息亭模式

信息亭模式专为壁挂显示屏、电视或专用显示器设计，可持续显示打印机状态——无需键盘、鼠标交互或浏览器 UI。

访问地址：**https://localhost:3443/#settings** → **系统 → 信息亭**

## 什么是信息亭模式

在信息亭模式下：
- 导航菜单已隐藏
- 不显示交互式控件
- 仪表板自动刷新
- 屏幕在打印机之间轮播（如已配置）
- 非活动超时已禁用

## 通过 URL 启用信息亭模式

在 URL 中添加 `?kiosk=true` 即可启用信息亭模式，无需更改设置：

```
https://localhost:3443/?kiosk=true
https://localhost:3443/#fleet?kiosk=true
```

删除该参数或添加 `?kiosk=false` 可退出信息亭模式。

## 信息亭设置

1. 进入**设置 → 系统 → 信息亭**
2. 配置：

| 设置 | 默认值 | 说明 |
|---|---|---|
| 默认视图 | 机群概览 | 显示哪个页面 |
| 轮播间隔 | 30 秒 | 每台打印机的显示时长 |
| 轮播模式 | 仅活跃 | 只在活跃打印机之间轮播 |
| 主题 | 深色 | 显示屏推荐 |
| 字体大小 | 大 | 远距离可读 |
| 时钟显示 | 关 | 在角落显示时钟 |

## 信息亭机群视图

机群概览已针对信息亭优化：

```
https://localhost:3443/#fleet?kiosk=true&cols=3&size=large
```

机群视图参数：
- `cols=N` — 列数（1–6）
- `size=small|medium|large` — 卡片尺寸

## 单台打印机轮播

按打印机逐个轮播显示：

```
https://localhost:3443/?kiosk=true&rotate=true&interval=20
```

- `rotate=true` — 启用轮播
- `interval=N` — 每台打印机的显示秒数

## 在 Raspberry Pi / NUC 上部署

适用于专用信息亭硬件：

### Chromium 信息亭模式（Linux）

```bash
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --app="https://localhost:3443/?kiosk=true"
```

将命令添加到自启动（`~/.config/autostart/bambu-kiosk.desktop`）。

### 自动登录与开机启动

1. 在操作系统中配置自动登录
2. 为 Chromium 创建自启动条目
3. 禁用屏保和节能模式：
   ```bash
   xset s off
   xset -dpms
   xset s noblank
   ```

:::tip 专用账户
为信息亭设备创建一个专用 3DPrintForge 账户，赋予**访客**角色。这样设备只有只读访问权限，即使有人接触屏幕也无法修改设置。
:::

## Hub 设置

Hub 模式显示包含所有打印机和关键统计数据的概览页面——专为大屏电视设计：

```
https://localhost:3443/#hub?kiosk=true
```

Hub 视图包含：
- 带状态的打印机网格
- 聚合关键数据（活跃打印数、总体进度）
- 时钟和日期
- 最新 HMS 警报
