---
sidebar_position: 1
title: Yapı Tabası Genel Bakışı
description: Tüm Bambu Lab yapı tabaları ve malzemeler için uyumluluk matrisi
---

# Yapı Tabası Genel Bakışı

Bambu Lab, her biri farklı malzemeler ve kullanım durumları için optimize edilmiş dört farklı yapı tabası sunmaktadır. Başarısız baskıları ve tabla hasarını önlemek için doğru tablayı seçin.

## Uyumluluk Matrisi

| Malzeme | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI | Yapıştırıcı? |
|-----------|:----------:|:-----------------:|:---------------:|:------------:|:---------:|
| PLA | ★★★★★ | ★★★★ | ★★ | ★★★★ | Hayır |
| PLA+ | ★★★★★ | ★★★★ | ★★ | ★★★★ | Hayır |
| PLA İpekli | ★★★★★ | ★★★★ | ★★ | ★★★ | Hayır |
| PLA-CF | ★★★★ | ★★★★ | ★★ | ★★★★ | Hayır |
| PETG | ⚠️ + yapıştırıcı | ★★★★★ | ★★★ | ★★★★ | ⚠️ Cool Plate'de Zorunlu |
| PETG-CF | ⚠️ + yapıştırıcı | ★★★★★ | ★★★ | ★★★★ | ⚠️ Cool Plate'de Zorunlu |
| ABS | ★ | ★★★★ | ★★★★★ | ★★★ | Evet |
| ASA | ★ | ★★★★ | ★★★★★ | ★★★ | Evet |
| TPU | ★★★ | ★★★ | ★★★ | ★★★★★ | Hayır |
| PA6 | ★ | ★★★★★ | ★★★★ | ★★★ | Evet (zorunlu) |
| PA12 | ★ | ★★★★★ | ★★★★ | ★★★ | Evet (zorunlu) |
| PA-CF | ★ | ★★★★★ | ★★★★ | ★★★ | Evet (zorunlu) |
| PC | ★ | ★★ | ★★★★★ | ★★ | Evet (zorunlu) |
| PVA/destek malzemesi | ★★★ | ★★★★ | ★★ | ★★★ | Hayır |

**Açıklama:** ★★★★★ = Mükemmel, ★★★★ = İyi, ★★★ = Tamam, ★★ = Kaçının, ★ = Önerilmez, ⚠️ = Dikkatli kullanın

## Tabla Genel Bakışı

### Cool Plate (Düz PEI)
Düz PEI tabla. PLA ve PLA varyantları için en iyisi. **Yapıştırıcı olmadan PETG kullanmayın** — PETG çok güçlü yapışır ve kaplamayı koparabilir.

[Daha fazla oku →](./cool-plate)

### Engineering Plate (Dokulu PEI)
Teknik malzemeler için daha iyi yapışmayla dokulu PEI. Baskılarda güzel dokulu alt yüzey verir. En iyi çok amaçlı tabla.

[Daha fazla oku →](./engineering-plate)

### High Temp Plate
Yüksek sıcaklık gereksinimleri olan malzemeler için: ABS, ASA, PC, PA. 120 °C'ye kadar tabla sıcaklıklarına dayanır.

[Daha fazla oku →](./high-temp-plate)

### Textured PEI Plate
Kaba doku verir. TPU ve güçlü mekanik yapışma gerektiren malzemeler için mükemmeldir. Soğumadan sonra baskıların çıkarılması kolaydır.

[Daha fazla oku →](./textured-pei)

## Yapıştırıcı Kullanımı

Yapıştırıcının iki amacı vardır:
1. **Bariyer** (Düz PEI'de PETG) — çok güçlü yapışmayı ve tabla hasarını önler
2. **Geliştirilmiş yapışma** (tüm tablalarda ABS, PA) — malzeme ile tabla arasındaki teması artırır

**Önerilen yapıştırıcı:** Bambu Lab'ın kendi yapıştırıcısı veya standart Pritt Stick. İnce, düzgün bir tabaka uygulayın ve 30 saniye kurumaya bırakın.

:::tip Yapıştırıcıdan Sonra Temizlik
Yapıştırıcı kullandıktan sonra tablayı ılık su ve hafif deterjanla yıkayın. Bir sonraki baskıdan önce tamamen kurumaya bırakın.
:::
