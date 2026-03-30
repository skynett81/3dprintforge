---
sidebar_position: 3
title: ABS
description: ABS baskı kılavuzu — sıcaklık, kapalı kasa, warping ve yapıştırıcı
---

# ABS

ABS (Akrilonitril Bütadien Stiren), iyi ısı kararlılığı ve darbe direncine sahip bir termoplastiktir. Kapalı kasa gerektirir ve PLA/PETG'den daha zorludur, ancak dayanıklı fonksiyonel parçalar üretir.

## Ayarlar

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 240–260 °C |
| Tabla sıcaklığı | 90–110 °C |
| Kasa sıcaklığı | 45–55 °C (X1C/P1S) |
| Parça soğutma | %0–20 |
| Yardımcı fan | %0 |
| Hız | %80–100 |
| Kurutma | Önerilen (70 °C'de 4–6 saat) |

## Önerilen Yapı Tabaları

| Tabla | Uygunluk | Yapıştırıcı? |
|-------|---------|----------|
| Engineering Plate (Dokulu PEI) | Mükemmel | Evet (önerilen) |
| High Temp Plate | Mükemmel | Evet |
| Cool Plate (Düz PEI) | Kaçının | — |
| Textured PEI | İyi | Evet |

:::tip ABS için Yapıştırıcı
ABS için Engineering Plate'e her zaman yapıştırıcı uygulayın. Yapışmayı iyileştirir ve tablaya zarar vermeden baskıyı çıkarmayı kolaylaştırır.
:::

## Kapalı Kasa (Kamera)

ABS, warping'i önlemek için kapalı kasa **gerektirir**:

- **X1C ve P1S:** Aktif ısı kontrolüyle yerleşik kasa — ABS için idealdir
- **P1P:** Kısmen açık — daha iyi sonuçlar için üst kapak ekleyin
- **A1 / A1 Mini:** Açık CoreXY — özel bir kaplama olmadan ABS için **önerilmez**

Tüm baskı boyunca kasayı kapalı tutun. Baskıyı kontrol etmek için açmayın — soğuyana kadar beklerseniz ayrılmada da warping yaşamazsınız.

## Warping

ABS, warpinge (köşeler kalkıyor) son derece yatkındır:

- **Tabla sıcaklığını artırın** — 105–110 °C deneyin
- **Kenar kullanın** — Bambu Studio'da 5–10 mm kenar
- **Hava akışından kaçının** — yazıcı etrafındaki tüm hava akışlarını kapatın
- **Parça soğutmayı %0'a düşürün** — soğutma bükülmeye neden olur

:::warning Dumanlar
ABS yazdırma sırasında stiren dumanı yayar. Odada iyi havalandırma sağlayın veya HEPA/aktif karbon filtre kullanın. Bambu P1S yerleşik filtreye sahiptir.
:::

## Son İşlem

ABS, PETG ve PLA'dan daha kolay zımparalanabilir, boyanabilir ve yapıştırılabilir. Düzgün bir yüzey için aseton buharıyla da düzeltilebilir — ancak aseton maruziyetinde son derece dikkatli olun.

## Depolama

Yazdırmadan önce **70 °C'de 4–6 saat kurutun**. Kapalı kutuda saklayın — ABS nem çeker ve bu patlama seslerine ve zayıf katmanlara yol açar.
