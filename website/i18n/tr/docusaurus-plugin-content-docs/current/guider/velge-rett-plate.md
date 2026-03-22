---
sidebar_position: 4
title: Doğru yapı plakasını seçmek
description: Bambu Labs yapı plakalarına genel bakış ve filamentinize en uygun olan
---

# Doğru yapı plakasını seçmek

Doğru yapı plakası, iyi yapışma ve baskıyı kolayca çıkarma için kritiktir. Yanlış kombinasyon, zayıf yapışmaya veya baskının sıkışmasına ve plakaya zarar vermesine yol açar.

## Genel bakış tablosu

| Filament | Önerilen plaka | Yapıştırıcı çubuk | Plaka sıcaklığı |
|----------|---------------|-------------------|-----------------|
| PLA | Cool Plate / Textured PEI | Hayır / Evet | 35–45°C |
| PETG | Textured PEI | **Evet (zorunlu)** | 70°C |
| ABS | Engineering Plate / High Temp | Evet | 90–110°C |
| ASA | Engineering Plate / High Temp | Evet | 90–110°C |
| TPU | Textured PEI | Hayır | 35–45°C |
| PA (Naylon) | Engineering Plate | Evet | 90°C |
| PC | High Temp Plate | Evet | 100–120°C |
| PLA-CF / PETG-CF | Engineering Plate | Evet | 45–90°C |
| PVA | Cool Plate | Hayır | 35°C |

## Plaka açıklamaları

### Cool Plate (Düz PEI)
**En iyi kullanım:** PLA, PVA
**Yüzey:** Düz, baskının alt yüzeyini düz yapar
**Çıkarma:** Plakayı hafifçe bükün veya soğumasını bekleyin — baskı kendiliğinden ayrılır

Cool Plate'i PETG ile kullanmayın — **çok güçlü** yapışır ve plaka kaplamayı tahrip edebilir.

### Textured PEI (Dokulu)
**En iyi kullanım:** PETG, TPU, PLA (pürüzlü yüzey verir)
**Yüzey:** Dokulu, baskının alt yüzeyine pürüzlü ve estetik görünüm verir
**Çıkarma:** Oda sıcaklığına soğumasını bekleyin — baskı kendiliğinden ayrılır

:::warning PETG, Textured PEI üzerinde yapıştırıcı çubuk gerektirir
Yapıştırıcı çubuk olmadan PETG, Textured PEI'e son derece güçlü yapışır ve çıkarma sırasında kaplamayı tahribat edebilir. Tüm yüzeye her zaman ince bir kat yapıştırıcı çubuk (Bambu yapıştırıcı çubuk veya Elmer's Disappearing Purple Glue) uygulayın.
:::

### Engineering Plate
**En iyi kullanım:** ABS, ASA, PA, PLA-CF, PETG-CF
**Yüzey:** Textured PEI'den daha düşük yapışkanlığa sahip mat PEI kaplama
**Çıkarma:** Soğuduktan sonra kolayca çıkarılır. ABS/ASA için yapıştırıcı kullanın

### High Temp Plate
**En iyi kullanım:** PC, PA-CF, yüksek sıcaklıklarda ABS
**Yüzey:** 120°C'ye kadar plaka sıcaklığına deformasyon olmadan dayanır
**Çıkarma:** Oda sıcaklığına soğutun

## Sık yapılan hatalar

### Düz Cool Plate üzerinde PETG (yapıştırıcı çubuk olmadan)
**Sorun:** PETG öyle güçlü yapışır ki baskı hasarsız çıkarılamaz
**Çözüm:** Her zaman yapıştırıcı çubuklu Textured PEI veya Engineering Plate kullanın

### Cool Plate üzerinde ABS
**Sorun:** Warping — köşeler baskı sırasında kalkar
**Çözüm:** Engineering Plate + yapıştırıcı çubuk + hazne sıcaklığını artırma (ön kapağı kapatın)

### High Temp Plate üzerinde PLA
**Sorun:** Çok yüksek plaka sıcaklığı aşırı yapışma sağlar, çıkarması zordur
**Çözüm:** PLA için Cool Plate veya Textured PEI

### Çok fazla yapıştırıcı çubuk
**Sorun:** Kalın yapıştırıcı çubuk fil ayağına (dağılan ilk katman) neden olur
**Çözüm:** İnce bir kat — yapıştırıcı çubuk neredeyse görünmez olmalı

## Plaka değiştirme

1. **Plakanın soğumasını bekleyin** (veya eldiven kullanın — plaka sıcak olabilir)
2. Plakayı ön tarafından kaldırın ve çekin
3. Yeni plakayı yerleştirin — mıknatıs onu yerinde tutar
4. Plaka değiştirdikten sonra Bambu Studio'da veya pano üzerinden **Kontroller → Kalibrasyon** bölümünde **otomatik kalibrasyon çalıştırın** (Akış Hızı ve Tabla Seviyeleme)

:::info Değişimden sonra kalibre etmeyi unutmayın
Plakalar biraz farklı kalınlıklara sahiptir. Kalibrasyon olmadan, ilk katman çok uzakta olabilir veya plakaya çarpabilir.
:::

## Plaka bakımı

### Temizleme (her 2–5 baskıdan sonra)
- IPA (izopropanol %70–99) ve tüy bırakmayan kağıt havluyla silin
- Yüzeye çıplak elle dokunmaktan kaçının — cilt yağı yapışmayı azaltır
- Textured PEI için: Çok sayıda baskıdan sonra ılık su ve hafif deterjanla yıkayın

### Yapıştırıcı çubuk kalıntılarını çıkarma
- Plakayı 60°C'ye ısıtın
- Nemli bezle silin
- IPA ile temizleyerek bitirin

### Değiştirme
Şunları gördüğünüzde plakayı değiştirin:
- Baskı çıkarma sonrası görünür çukurlar veya izler
- Temizlemeden sonra bile sürekli kötü yapışma
- Kaplamada kabarcıklar veya lekeler

Bambu plakaları, filament türüne ve kullanıma bağlı olarak genellikle 200–500 baskıya dayanır.

:::tip Plakaları doğru saklayın
Kullanılmayan plakaları orijinal ambalajında veya dik bir tutucuda saklayın — üstlerine ağır şeyler koyarak istiflenmiş şekilde değil. Deforme olmuş plakalar düzensiz ilk katmana neden olur.
:::
