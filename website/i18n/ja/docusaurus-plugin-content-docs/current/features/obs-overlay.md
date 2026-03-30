---
sidebar_position: 4
title: OBSオーバーレイ
description: Bambu LabプリンターのリアルタイムステータスオーバーレイをOBS Studioに直接追加する
---

# OBSオーバーレイ

OBSオーバーレイを使用すると、OBS Studioでプリンターのリアルタイム状態を直接表示できます。3Dプリントのライブストリーミングや録画に最適です。

## オーバーレイURL

オーバーレイは透明な背景のウェブページとして利用できます。

```
https://localhost:3443/obs-overlay?printer=PRINTER_ID
```

`PRINTER_ID`をプリンターのID（**設定 → プリンター**で確認）に置き換えてください。

### 利用可能なパラメーター

| パラメーター | デフォルト値 | 説明 |
|---|---|---|
| `printer` | 最初のプリンター | 表示するプリンターID |
| `theme` | `dark` | `dark`、`light`または`minimal` |
| `scale` | `1.0` | スケール（0.5〜2.0） |
| `position` | `bottom-left` | `top-left`、`top-right`、`bottom-left`、`bottom-right` |
| `opacity` | `0.9` | 透明度（0.0〜1.0） |
| `fields` | すべて | カンマ区切りのリスト：`progress,temp,ams,time` |
| `color` | `#00d4ff` | アクセントカラー（hex） |

**パラメーターの例：**
```
https://localhost:3443/obs-overlay?printer=abc123&theme=minimal&scale=1.2&position=top-right&fields=progress,time
```

## OBS Studioでのセットアップ

### ステップ1：ブラウザソースを追加

1. OBS Studioを開きます
2. **ソース**の下で**+**をクリックします
3. **ブラウザ**（Browser Source）を選択します
4. ソースに名前を付けます（例：`Bambu Overlay`）
5. **OK**をクリックします

### ステップ2：ブラウザソースを設定

設定ダイアログに以下を入力します。

| フィールド | 値 |
|---|---|
| URL | `https://localhost:3443/obs-overlay?printer=YOUR_ID` |
| 幅 | `400` |
| 高さ | `200` |
| FPS | `30` |
| カスタムCSS | *（空白のまま）* |

以下にチェックを入れます。
- ✅ **非表示時はソースをシャットダウン**
- ✅ **シーンがアクティブになったらブラウザを更新**

:::warning HTTPSとlocalhost
OBSが自己署名証明書の警告を表示する場合があります。まずChrome/Firefoxで`https://localhost:3443`にアクセスして証明書を承認してください。OBSは同じ承認を使用します。
:::

### ステップ3：透明な背景

オーバーレイは`background: transparent`で構築されています。OBSで正しく機能させるには：

1. ブラウザソースの**カスタム背景色**にチェックを入れないでください
2. オーバーレイが不透明な要素に包まれていないことを確認します
3. OBSのソースの**ブレンドモード**を**ノーマル**に設定してください

:::tip 代替案：クロマキー
透明度が機能しない場合は、緑の背景でフィルター → **クロマキー**を使用してください：
URLに`&bg=green`を追加し、OBSのソースにクロマキーフィルターを設定します。
:::

## オーバーレイに表示される内容

標準オーバーレイには以下が含まれます。

- **プログレスバー**とパーセンテージ
- **残り時間**（推定）
- **ノズル温度**と**ベッド温度**
- フィラメントの色と名前付きの**アクティブAMSスロット**
- **プリンターモデル**と名前（オフ可能）

## ストリーミング用のミニマルモード

ストリーミング中のコンパクトなオーバーレイ：

```
https://localhost:3443/obs-overlay?theme=minimal&fields=progress,time&scale=0.8&opacity=0.7
```

これにより、コーナーに残り時間付きの小さなプログレスバーのみが表示されます。
