---
sidebar_position: 4
title: OBS Overlay
description: Bambu Lab yazıcınız için şeffaf durum overlay'ini doğrudan OBS Studio'ya ekleyin
---

# OBS Overlay

OBS overlay'i, yazıcınızın gerçek zamanlı durumunu doğrudan OBS Studio'da görüntülemenizi sağlar — 3D baskıların canlı yayını veya kaydı için idealdir.

## Overlay URL'si

Overlay, şeffaf arka planlı bir web sayfası olarak mevcuttur:

```
https://localhost:3443/obs-overlay?printer=YAZICI_ID
```

`YAZICI_ID`'yi yazıcının ID'siyle değiştirin (**Ayarlar → Yazıcılar** altında bulunur).

### Mevcut Parametreler

| Parametre | Varsayılan | Açıklama |
|---|---|---|
| `printer` | ilk yazıcı | Görüntülenecek Yazıcı ID'si |
| `theme` | `dark` | `dark`, `light` veya `minimal` |
| `scale` | `1.0` | Ölçek (0.5–2.0) |
| `position` | `bottom-left` | `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `opacity` | `0.9` | Şeffaflık (0.0–1.0) |
| `fields` | hepsi | Virgülle ayrılmış liste: `progress,temp,ams,time` |
| `color` | `#00d4ff` | Vurgu rengi (hex) |

**Parametrelerle örnek:**
```
https://localhost:3443/obs-overlay?printer=abc123&theme=minimal&scale=1.2&position=top-right&fields=progress,time
```

## OBS Studio'da Kurulum

### Adım 1: Tarayıcı kaynağı ekleyin

1. OBS Studio'yu açın
2. **Kaynaklar** altında **+**'ya tıklayın
3. **Tarayıcı** (Browser Source) seçin
4. Kaynağa bir ad verin, ör. `Bambu Overlay`
5. **Tamam**'a tıklayın

### Adım 2: Tarayıcı kaynağını yapılandırın

Ayarlar iletişim kutusuna şunları doldurun:

| Alan | Değer |
|---|---|
| URL | `https://localhost:3443/obs-overlay?printer=SIZIN_ID` |
| Genişlik | `400` |
| Yükseklik | `200` |
| FPS | `30` |
| Özel CSS | *(boş bırakın)* |

Şunları işaretleyin:
- ✅ **Görünür olmadığında kaynağı kapat**
- ✅ **Sahne etkinleştirildiğinde tarayıcıyı yenile**

:::warning HTTPS ve localhost
OBS, kendinden imzalı sertifika konusunda uyarı verebilir. Önce Chrome/Firefox'ta `https://localhost:3443` adresine gidin ve sertifikayı kabul edin. OBS aynı onayı kullanır.
:::

### Adım 3: Şeffaf arka plan

Overlay `background: transparent` ile oluşturulmuştur. OBS'de çalışması için:

1. Tarayıcı kaynağında **Özel arka plan rengi** kutusunu işaretlemeyin
2. Overlay'in opak bir öğeye sarılmadığından emin olun
3. OBS'de kaynakta **Blend modunu** **Normal** olarak ayarlayın

:::tip Alternatif: Chroma key
Şeffaflık çalışmıyorsa, yeşil arka planla filtre → **Chroma Key** kullanın:
URL'ye `&bg=green` ekleyin ve OBS'deki kaynağa chroma key filtresi uygulayın.
:::

## Overlay'de Neler Görünür

Standart overlay şunları içerir:

- Yüzde değeriyle **ilerleme çubuğu**
- **Kalan süre** (tahmini)
- **Nozül sıcaklığı** ve **tabla sıcaklığı**
- Filament rengi ve adıyla **Aktif AMS yuvası**
- **Yazıcı modeli** ve adı (kapatılabilir)

## Yayın için Minimal Mod

Yayın sırasında ayrık bir overlay için:

```
https://localhost:3443/obs-overlay?theme=minimal&fields=progress,time&scale=0.8&opacity=0.7
```

Bu, yalnızca köşede kalan süreyle küçük bir ilerleme çubuğu gösterir.
