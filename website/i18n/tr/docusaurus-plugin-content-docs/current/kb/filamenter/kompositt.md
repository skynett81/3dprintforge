---
sidebar_position: 6
title: Kompozit Malzemeler (CF/GF)
description: Karbon fiber ve cam fiber takviyeli filamentler — sertleştirilmiş çelik nozül, aşınma ve ayarlar
---

# Kompozit Malzemeler (CF/GF)

Kompozit filamentler, PLA, PETG, PA veya ABS gibi bir taban plastik içine karıştırılmış kısa karbon fiber (CF) veya cam fiber (GF) liflerini içerir. Artan sertlik, azaltılmış ağırlık ve daha iyi boyutsal kararlılık sağlarlar.

## Mevcut Türler

| Filament | Taban | Sertlik | Ağırlık Azalması | Zorluk |
|----------|-------|---------|--------------|------------------|
| PLA-CF | PLA | Yüksek | Orta | Kolay |
| PETG-CF | PETG | Yüksek | Orta | Orta |
| PA6-CF | Naylon 6 | Çok Yüksek | İyi | Zorlu |
| PA12-CF | Naylon 12 | Çok Yüksek | İyi | Orta |
| ABS-CF | ABS | Yüksek | Orta | Orta |
| PLA-GF | PLA | Yüksek | Orta | Kolay |

## Sertleştirilmiş Çelik Nozül Zorunludur

:::danger CF/GF ile Asla Pirinç Nozül Kullanmayın
Karbon ve cam lifler son derece aşındırıcıdır. Standart bir pirinç nozülü saatler ila günler içinde aşındırırlar. Tüm CF ve GF malzemelerde her zaman **sertleştirilmiş çelik nozül** (Hardened Steel) veya **HS01 nozülü** kullanın.

- Bambu Lab Sertleştirilmiş Çelik Nozül (0,4 mm)
- Bambu Lab HS01 Nozülü (özel kaplama, daha uzun ömür)
:::

## Ayarlar (PA-CF Örneği)

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 270–290 °C |
| Tabla sıcaklığı | 80–100 °C |
| Parça soğutma | %0–20 |
| Hız | %80 |
| Kurutma | 80 °C / 12 saat |

PLA-CF için: nozül 220–230 °C, tabla 35–50 °C — PA-CF'den çok daha kolay.

## Yapı Tabaları

| Tabla | Uygunluk | Yapıştırıcı? |
|-------|---------|----------|
| Engineering Plate (Dokulu PEI) | Mükemmel | Evet (PA tabanlı için) |
| High Temp Plate | İyi | Evet |
| Cool Plate | Kaçının (CF çizer) | — |
| Textured PEI | İyi | Evet |

:::warning Tabla Çizilebilir
CF malzemeler çıkarırken düz tabaları çizebilir. Her zaman Engineering Plate veya Textured PEI kullanın. Baskıyı çekmeyin — tablayı dikkatlice bükün.
:::

## Yüzey İşlemi

CF filamentler boyama gerektirmeyen mat, karbon benzeri bir yüzey verir. Yüzey biraz gözeneklidir ve daha düzgün bir bitim için epoksi ile emprenye edilebilir.

## Aşınma ve Nozül Ömrü

| Nozül Türü | CF ile Ömür | Maliyet |
|----------|---------------|---------|
| Pirinç (standart) | Saatler–Günler | Düşük |
| Sertleştirilmiş çelik | 200–500 saat | Orta |
| HS01 (Bambu) | 500–1000 saat | Yüksek |

Görünür aşınmada nozülü değiştirin: genişlemiş nozül deliği, ince duvarlar, kötü boyutsal doğruluk.

## Kurutma

PA ve PETG'nin CF varyantları taban ile aynı şekilde kurutma gerektirir:
- **PLA-CF:** Kurutma önerilir, ancak kritik değil
- **PETG-CF:** 65 °C / 6–8 saat
- **PA-CF:** 80 °C / 12 saat — kritik
