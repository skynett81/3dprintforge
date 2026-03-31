---
sidebar_position: 1
title: Kötü Yapışma
description: Kötü ilk katman yapışmasının nedenleri ve çözümleri — tabla, sıcaklık, yapıştırıcı, hız, Z-offset
---

# Kötü Yapışma

Kötü yapışma, 3D baskıda en yaygın sorunlardan biridir. İlk katman yapışmaz veya baskılar yarı yolda ayrılır.

## Belirtiler

- İlk katman yapışmıyor — baskı hareket ediyor veya kalkıyor
- Kenarlar ve köşeler kalkıyor (warping)
- Baskı iş ortasında ayrılıyor
- Boşluklar veya gevşek iplikler içeren düzensiz ilk katman

## Kontrol Listesi — Bu Sırayla Deneyin

### 1. Tablayı Temizleyin
Kötü yapışmanın en yaygın nedeni tablada yağ veya kirdir.

```
1. Tablayı IPA (izopropil alkol) ile silin
2. Yüzeye çıplak elle dokunmaktan kaçının
3. Sorun devam ederse: su ve hafif deterjanla yıkayın
```

### 2. Z-Offset'i Kalibre Edin

Z-offset, ilk katmanda nozül ile tabla arasındaki yüksekliktir. Çok yüksek = iplik serbest asılır. Çok düşük = nozül tablayı kazır.

**Doğru Z-offset:**
- İlk katman hafif şeffaf görünmeli
- İplik tablaya küçük bir "squish" ile bastırılmalı
- İplikler birbirine hafifçe kaynaşmalı

Z-offset'i baskı sırasında **Kontrol → Z Canlı Ayarı** üzerinden yapın.

:::tip Baskı Sırasında Canlı Ayar
3DPrintForge, aktif baskı sırasında Z-offset ayar düğmelerini gösterir. İlk katmanı izlerken ±0.02 mm adımlarla ayarlayın.
:::

### 3. Tabla Sıcaklığını Kontrol Edin

| Malzeme | Çok Düşük Sıcaklık | Önerilen |
|---------|--------------------|----------|
| PLA | 30 °C altı | 35–45 °C |
| PETG | 60 °C altı | 70–85 °C |
| ABS | 80 °C altı | 90–110 °C |
| TPU | 25 °C altı | 30–45 °C |

Tabla sıcaklığını birer 5 °C artırarak deneyin.

### 4. Yapıştırıcı Kullanın

Yapıştırıcı çoğu malzeme ve tablada yapışmayı iyileştirir:
- İnce, düzgün bir tabaka sürün
- Başlamadan önce 30 saniye kurumaya bırakın
- Özellikle şunlar için önemlidir: ABS, PA, PC, PETG (düz PEI üzerinde)

### 5. İlk Katman Hızını Düşürün

İlk katmanda daha düşük hız, filament ile tabla arasında daha iyi temas sağlar:
- Standart: ilk katman için 50 mm/s
- Deneyin: 30–40 mm/s
- Bambu Studio: **Kalite → İlk Katman Hızı** altında

### 6. Tabla Durumunu Kontrol Edin

Aşınmış bir tabla, mükemmel ayarlarla bile kötü yapışmaya neden olur. Şu durumlarda tablayı değiştirin:
- PEI kaplaması görünür şekilde hasarlı
- Temizlik yardımcı olmuyor

### 7. Brim Kullanın

Warping eğilimli malzemeler için (ABS, PA, büyük düz objeler):
- Dilimleyicide brim ekleyin: 5–10 mm genişlik
- Temas yüzeyini artırır ve kenarları aşağıda tutar

## Özel Durumlar

### Büyük Düz Objeler
Büyük düz objeler ayrılmaya en yatkın olanlardır. Önlemler:
- 8–10 mm brim
- Tabla sıcaklığını artırın
- Kasayı kapatın (ABS/PA)
- Parça soğutmayı azaltın

### Sırlanmış Yüzeyler
Zaman içinde çok fazla yapıştırıcı birikmiş tablalar sırlanabilir. Su ile iyice yıkayın ve sıfırdan başlayın.

### Filament Değişikliğinden Sonra
Farklı malzemeler farklı ayarlar gerektirir. Tabla sıcaklığı ve tablanın yeni malzeme için yapılandırıldığından emin olun.
