---
sidebar_position: 4
title: OBS 覆盖层
description: 直接在 OBS Studio 中为您的拓竹打印机添加透明状态覆盖层
---

# OBS 覆盖层

OBS 覆盖层允许您在 OBS Studio 中直接显示打印机的实时状态——非常适合 3D 打印的直播或录制。

## 覆盖层 URL

覆盖层作为具有透明背景的网页提供：

```
https://localhost:3443/obs-overlay?printer=PRINTER_ID
```

将 `PRINTER_ID` 替换为打印机的 ID（可在**设置 → 打印机**中找到）。

### 可用参数

| 参数 | 默认值 | 说明 |
|---|---|---|
| `printer` | 第一台打印机 | 要显示的打印机 ID |
| `theme` | `dark` | `dark`、`light` 或 `minimal` |
| `scale` | `1.0` | 缩放比例（0.5–2.0） |
| `position` | `bottom-left` | `top-left`、`top-right`、`bottom-left`、`bottom-right` |
| `opacity` | `0.9` | 透明度（0.0–1.0） |
| `fields` | 全部 | 逗号分隔列表：`progress,temp,ams,time` |
| `color` | `#00d4ff` | 强调色（十六进制） |

**带参数的示例：**
```
https://localhost:3443/obs-overlay?printer=abc123&theme=minimal&scale=1.2&position=top-right&fields=progress,time
```

## 在 OBS Studio 中设置

### 步骤 1：添加浏览器源

1. 打开 OBS Studio
2. 在**来源**下点击 **+**
3. 选择**浏览器**（Browser Source）
4. 为来源命名，例如 `Bambu Overlay`
5. 点击**确定**

### 步骤 2：配置浏览器源

在设置对话框中填写以下内容：

| 字段 | 值 |
|---|---|
| URL | `https://localhost:3443/obs-overlay?printer=你的ID` |
| 宽度 | `400` |
| 高度 | `200` |
| FPS | `30` |
| 自定义 CSS | *（留空）* |

勾选：
- ✅ **当不可见时关闭来源**
- ✅ **场景激活时刷新浏览器**

:::warning HTTPS 和 localhost
OBS 可能会对自签名证书发出警告。请先在 Chrome/Firefox 中访问 `https://localhost:3443` 并接受证书。OBS 随后将使用相同的信任设置。
:::

### 步骤 3：透明背景

覆盖层使用 `background: transparent` 构建。为使其在 OBS 中正常工作：

1. 在浏览器源中**不要**勾选**自定义背景色**
2. 确保覆盖层没有被不透明元素包裹
3. 在 OBS 的来源上将**混合模式**设置为**正常**

:::tip 备选方案：色度键
如果透明度不起作用，可使用滤镜 → **色度键**配合绿色背景：
在 URL 中添加 `&bg=green`，然后在 OBS 来源上设置色度键滤镜。
:::

## 覆盖层显示内容

默认覆盖层包含：

- **进度条**及百分比值
- **剩余时间**（估计）
- **喷嘴温度**和**热床温度**
- **活跃 AMS 槽位**，含耗材颜色和名称
- **打印机型号**和名称（可关闭）

## 直播用简洁模式

适合直播时使用的低调覆盖层：

```
https://localhost:3443/obs-overlay?theme=minimal&fields=progress,time&scale=0.8&opacity=0.7
```

这将在角落显示一个小型进度条和剩余时间。
