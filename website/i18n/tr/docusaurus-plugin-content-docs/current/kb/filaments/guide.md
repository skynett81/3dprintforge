---
sidebar_position: 0
title: Filament Rehberi
description: Tüm 3D baskı filamentleri için eksiksiz rehber — sıcaklıklar, plakalar, kurutma ve özellikler
---

# Filament Rehberi

Tüm yaygın 3D baskı malzemeleri için eksiksiz bir referans. Projeniz için doğru filamenti ve ayarları seçmek üzere bu rehberi kullanın.

## Genel Bakış — Sıcaklık Ayarları

| Malzeme | Nozul (°C) | Tabla (°C) | Kabin (°C) | Zorluk |
|-----------|-----------|-----------|-------------|--------------|
| PLA | 190–230 (210) | 35–65 (55) | — | Başlangıç |
| PLA-CF | 210–240 (220) | 45–65 (55) | — | Orta |
| PETG | 220–260 (240) | 60–80 (70) | — | Başlangıç |
| PETG-CF | 230–270 (250) | 65–80 (70) | — | Orta |
| ABS | 240–270 (255) | 90–110 (100) | 40–60 | Orta |
| ASA | 240–270 (260) | 90–110 (100) | 40–60 | Orta |
| TPU | 210–240 (225) | 40–60 (50) | — | İleri |
| PA (Nylon) | 260–290 (275) | 80–100 (90) | 40–60 | İleri |
| PA-CF | 270–300 (285) | 80–100 (90) | 45–65 | Uzman |
| PA-GF | 270–300 (285) | 80–100 (90) | 45–65 | Uzman |
| PC | 260–300 (280) | 100–120 (110) | 50–70 | Uzman |
| PVA | 190–220 (200) | 45–60 (55) | — | Orta |
| PVB | 200–230 (215) | 50–70 (60) | — | Orta |
| HIPS | 220–250 (235) | 80–100 (90) | 35–50 | Orta |
| PET-CF | 250–280 (265) | 65–85 (75) | — | İleri |

*Parantez içindeki değerler önerilen değerlerdir.*

## Plaka Uyumluluğu

| Malzeme | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI |
|-----------|:----------:|:-----------------:|:---------------:|:------------:|
| PLA | ★★★ | ★★ | ✗ | ★★★ |
| PLA-CF | ★★ | ★★★ | ✗ | ★★★ |
| PETG | ✗ (yapıştırıcı) | ★★★ | ★★ | ★★★ |
| PETG-CF | ✗ (yapıştırıcı) | ★★★ | ★★ | ★★★ |
| ABS | ⊘ | ★★★ | ★★★ | ★★ |
| ASA | ⊘ | ★★★ | ★★★ | ★★ |
| TPU | ★★★ | ★★ | ✗ | ★★ |
| PA (Nylon) | ⊘ | ★★ (yapıştırıcı) | ★★★ | ★★ (yapıştırıcı) |
| PA-CF | ⊘ | ★★ (yapıştırıcı) | ★★★ | ★★ (yapıştırıcı) |
| PA-GF | ⊘ | ★★ (yapıştırıcı) | ★★★ | ★★ (yapıştırıcı) |
| PC | ⊘ | ★★ (yapıştırıcı) | ★★★ | ✗ (yapıştırıcı) |
| PVA | ★★ | ★★ | ✗ | ★★ |
| PVB | ★★ | ★★ | ✗ | ★★ |
| HIPS | ⊘ | ★★ | ★★★ | ★★ |
| PET-CF | ✗ (yapıştırıcı) | ★★★ | ★★ | ★★★ |

**Açıklama:** ★★★ = Mükemmel, ★★ = İyi, ✗ = Kötü, ⊘ = Önerilmez, (yapıştırıcı) = Yapıştırıcı çubuk gerekli

## Kurutma

| Malzeme | Sıcaklık | Süre | Nem Hassasiyeti |
|-----------|:----------:|:---:|:----------------:|
| PLA | 50 °C | 4s | Düşük |
| PLA-CF | 55 °C | 6s | Düşük |
| PETG | 65 °C | 6s | Orta |
| PETG-CF | 65 °C | 8s | Orta |
| ABS | 65 °C | 6s | Orta |
| ASA | 65 °C | 6s | Orta |
| TPU | 50 °C | 6s | Yüksek |
| PA (Nylon) | 80 °C | 12s | Aşırı |
| PA-CF | 80 °C | 12s | Aşırı |
| PA-GF | 80 °C | 12s | Aşırı |
| PC | 80 °C | 8s | Yüksek |
| PVA | 45 °C | 8s | Aşırı |
| PVB | 50 °C | 6s | Orta |
| HIPS | 60 °C | 6s | Düşük |
| PET-CF | 65 °C | 8s | Orta |

:::tip Kurutma Kuralı
**Yüksek** veya **aşırı** nem hassasiyetine sahip malzemeler kullanımdan önce mutlaka kurutulmalı ve nem alıcı ile saklanmalıdır.
:::

## Özel Gereksinimler

| Malzeme | Kapalı Alan | Sertleştirilmiş Nozul | Uyumlu Yazıcılar |
|-----------|:---------:|:-----------:|:-------------------:|
| PLA | Hayır | Hayır | Tümü |
| PLA-CF | Hayır | **Evet** | Tümü |
| PETG | Hayır | Hayır | Tümü |
| PETG-CF | Hayır | **Evet** | Tümü |
| ABS | **Evet** | Hayır | Yalnızca kapalı |
| ASA | **Evet** | Hayır | Yalnızca kapalı |
| TPU | Hayır | Hayır | Tümü |
| PA (Nylon) | **Evet** | Hayır | Yalnızca kapalı |
| PA-CF | **Evet** | **Evet** | Yalnızca kapalı |
| PA-GF | **Evet** | **Evet** | Yalnızca kapalı |
| PC | **Evet** | Hayır | Yalnızca kapalı |
| PVA | Hayır | Hayır | Tümü |
| PVB | Hayır | Hayır | Tümü |
| HIPS | **Evet** | Hayır | Yalnızca kapalı |
| PET-CF | Hayır | **Evet** | Tümü |

## Özellikler (1–5)

| Malzeme | Dayanıklılık | Esneklik | Isı | UV | Yüzey | Yazdırılabilirlik |
|-----------|:------:|:-------------:|:-----:|:--:|:---------:|:-----------:|
| PLA | 3 | 2 | 2 | 1 | 4 | 5 |
| PLA-CF | 4 | 1 | 2 | 2 | 3 | 4 |
| PETG | 4 | 3 | 3 | 3 | 3 | 4 |
| PETG-CF | 5 | 2 | 3 | 3 | 3 | 3 |
| ABS | 4 | 3 | 4 | 2 | 3 | 2 |
| ASA | 4 | 3 | 4 | 5 | 3 | 2 |
| TPU | 3 | 5 | 2 | 3 | 3 | 2 |
| PA (Nylon) | 5 | 4 | 4 | 2 | 3 | 2 |
| PA-CF | 5 | 2 | 5 | 3 | 3 | 1 |
| PA-GF | 5 | 2 | 5 | 3 | 2 | 1 |
| PC | 5 | 3 | 5 | 3 | 3 | 1 |
| PVA | 1 | 2 | 1 | 1 | 3 | 2 |
| PVB | 3 | 3 | 2 | 2 | 5 | 3 |
| HIPS | 3 | 2 | 3 | 2 | 3 | 3 |
| PET-CF | 5 | 2 | 4 | 3 | 3 | 3 |

## Malzeme Bazında İpuçları

### Standart (PLA, PETG)
- PLA en kolay malzemedir — prototipler ve dekorasyon için mükemmel
- PETG daha iyi dayanıklılık ve ısı direnci sunar, ancak daha fazla iplik çekebilir
- Her ikisi de kapalı alan olmadan ve standart pirinç nozul ile çalışır

### Mühendislik (ABS, ASA, PC)
- Bükülmeyi önlemek için kapalı bir yazıcı gerektirir
- ASA UV dayanıklıdır — dış mekan parçaları için kullanın
- PC en yüksek dayanıklılık ve ısı direnci sunar, ancak yazdırması en zordur

### Kompozit (CF/GF)
- **Her zaman** sertleştirilmiş çelik nozul kullanın — karbon fiber pirinç nozulları hızla aşındırır
- CF varyantları mat yüzeyli daha sert ve hafif parçalar üretir
- GF varyantları daha ucuzdur ancak daha pürüzlü yüzey üretir

### Esnek (TPU)
- En iyi sonuçlar için yavaş yazdırın (50 mm/s veya altı)
- Tıkanmayı önlemek için geri çekmeyi azaltın
- Doğrudan tahrikli ekstruderler Bowden'dan çok daha iyi çalışır

### Destek (PVA, HIPS)
- PVA suda çözünür — PLA desteği için mükemmel
- HIPS limonende çözünür — ABS ile birlikte kullanılır
- Her ikisi de neme çok duyarlıdır — kuru saklayın

:::warning Naylon Malzemeler
PA, PA-CF ve PA-GF **son derece** higroskopiktir. Havadan nemi dakikalar içinde emerler. Kullanımdan önce mutlaka 12+ saat kurutun ve mümkünse doğrudan kurutma kutusundan yazdırın.
:::
