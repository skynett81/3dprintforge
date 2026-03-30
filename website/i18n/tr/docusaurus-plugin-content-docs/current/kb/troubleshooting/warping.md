---
sidebar_position: 2
title: Warping
description: Warping nedenleri ve çözümleri — kapalı kasa, brim, sıcaklık ve draft shield
---

# Warping

Warping, baskı sırasında veya sonrasında baskının köşe veya kenarlarının tablodan kalkmasıdır. Malzemenin termal büzülmesinden kaynaklanır.

## Warping Nedir?

Plastik soğuduğunda büzülür. Üst katmanlar alt katmanlardan daha sıcaktır — bu, kenarları yukarı çeken ve baskıyı büken gerilim oluşturur. Sıcaklık farkı ne kadar büyükse warping o kadar fazla olur.

## En Çok Etkilenen Malzemeler

| Malzeme | Warping Riski | Kapalı Kasa Gerektirir mi |
|---------|---------------|--------------------------|
| PLA | Düşük | Hayır |
| PETG | Düşük–Orta | Hayır |
| ABS | Yüksek | Evet |
| ASA | Yüksek | Evet |
| PA/Naylon | Çok Yüksek | Evet |
| PC | Çok Yüksek | Evet |
| TPU | Düşük | Hayır |

## Çözümler

### 1. Kapalı Kasa Kullanın

ABS, ASA, PA ve PC için en önemli önlem:
- En iyi sonuç için kasa sıcaklığını 40–55 °C'de tutun
- X1C ve P1S: kasa fanlarını "kapalı" modda aktif edin
- A1/P1P: ısıyı tutmak için kapak örtüsü kullanın

### 2. Brim Kullanın

Brim, baskıyı tablaya sabit tutan tek katmanlı geniş kenar eklemesidir:

```
Bambu Studio:
1. Dilimleyicide baskıyı seçin
2. Support → Brim'e gidin
3. Genişliği 5–10 mm olarak ayarlayın (warping ne kadar fazlaysa o kadar geniş)
4. Tür: Outer Brim Only (önerilen)
```

:::tip Brim Genişlik Rehberi
- PLA (nadiren gerekli): 3–5 mm
- PETG: 4–6 mm
- ABS/ASA: 6–10 mm
- PA/Naylon: 8–15 mm
:::

### 3. Tabla Sıcaklığını Artırın

Daha yüksek tabla sıcaklığı, katmanlar arasındaki sıcaklık farkını azaltır:
- ABS: 105–110 °C deneyin
- PA: 85–95 °C
- PETG: 80–85 °C

### 4. Parça Soğutmayı Azaltın

Warping eğilimli malzemeler için parça soğutmayı azaltın veya devre dışı bırakın:
- ABS/ASA: %0–20 parça soğutma
- PA: %0–30 parça soğutma

### 5. Hava Akımı ve Soğuk Havadan Kaçının

Yazıcıyı şunlardan uzak tutun:
- Pencereler ve dış kapılar
- Klima ve vantilatörler
- Odada hava akımı

P1P ve A1 için: kritik baskılarda karton ile açıklıkları kapatın.

### 6. Draft Shield

Draft shield, nesnenin etrafında ısıyı içeride tutan ince bir duvardır:

```
Bambu Studio:
1. Support → Draft Shield'e gidin
2. Etkinleştirin ve mesafeyi ayarlayın (3–5 mm)
```

Özellikle uzun, ince nesneler için kullanışlıdır.

### 7. Model Tasarım Önlemleri

Kendi modellerinizi tasarlarken:
- Büyük düz tabanlardan kaçının (köşelere pah/yuvarlatma ekleyin)
- Büyük düz parçaları daha küçük bölümlere ayırın
- Dilimleyicide veya CAD'de köşelere "mouse ears" — küçük daireler — kullanın

## Soğumadan Sonra Warping

Bazen baskı iyi görünür ama tabladan çıkarıldıktan sonra warping oluşur:
- Baskıyı çıkarmadan önce her zaman tabla ve baskının **tamamen soğumasını** (40 °C altı) bekleyin
- ABS için: daha yavaş soğuma için kapalı kasanın içinde soğumaya bırakın
- Sıcak baskıyı soğuk yüzeye koymaktan kaçının
