---
sidebar_position: 10
title: Uyumluluk matrisi
description: Bambu Lab plakaları, yazıcılar ve nozüllerle malzeme uyumluluğunun tam rehberi
---

# Uyumluluk matrisi

Bu sayfa, hangi malzemelerin hangi yapı plakaları, yazıcılar ve nozül tipleriyle uyumlu olduğuna dair eksiksiz bir genel bakış sunar. Yeni malzemelerle baskı planlarken tabloları referans olarak kullanın.

---

## Malzemeler ve yapı plakaları

| Malzeme | Cool Plate | Engineering Plate | High Temp Plate | Textured PEI | Yapıştırıcı |
|-----------|-----------|-------------------|-----------------|--------------|----------|
| PLA | Mükemmel | İyi | Önerilmez | İyi | Hayır |
| PLA+ | Mükemmel | İyi | Önerilmez | İyi | Hayır |
| PLA-CF | Mükemmel | İyi | Önerilmez | İyi | Hayır |
| PLA Silk | Mükemmel | İyi | Önerilmez | İyi | Hayır |
| PETG | Kötü | Mükemmel | İyi | İyi | Evet (Cool) |
| PETG-CF | Kötü | Mükemmel | İyi | Kabul edilebilir | Evet (Cool) |
| ABS | Önerilmez | Mükemmel | İyi | Kabul edilebilir | Evet (HT) |
| ASA | Önerilmez | Mükemmel | İyi | Kabul edilebilir | Evet (HT) |
| TPU | İyi | İyi | Önerilmez | Mükemmel | Hayır |
| PA (Naylon) | Önerilmez | Mükemmel | İyi | Kötü | Evet |
| PA-CF | Önerilmez | Mükemmel | İyi | Kötü | Evet |
| PA-GF | Önerilmez | Mükemmel | İyi | Kötü | Evet |
| PC | Önerilmez | Kabul edilebilir | Mükemmel | Önerilmez | Evet (Eng) |
| PC-CF | Önerilmez | Kabul edilebilir | Mükemmel | Önerilmez | Evet (Eng) |
| PVA | Mükemmel | İyi | Önerilmez | İyi | Hayır |
| HIPS | Önerilmez | İyi | İyi | Kabul edilebilir | Hayır |
| PVB | İyi | İyi | Önerilmez | İyi | Hayır |

**Açıklama:**
- **Mükemmel** — optimum çalışır, önerilen kombinasyon
- **İyi** — iyi çalışır, kabul edilebilir alternatif
- **Kabul edilebilir** — çalışır, ancak ideal değil — ek önlemler gerektirir
- **Kötü** — değişikliklerle çalışabilir, ancak önerilmez
- **Önerilmez** — kötü sonuçlar veya plaka hasarı riski

:::tip PETG ve Cool Plate
PETG, Cool Plate'e (Smooth PEI) **çok güçlü yapışır** ve parça çıkarılırken PEI kaplamasını yırtabilir. Her zaman yapıştırıcıyı ayırıcı film olarak kullanın veya Engineering Plate seçin.
:::

:::warning PC ve plaka seçimi
PC, yüksek tabla sıcaklıkları (100–120 °C) nedeniyle High Temp Plate gerektirir. Diğer plakalar bu sıcaklıklarda kalıcı olarak deforme olabilir.
:::

---

## Malzemeler ve yazıcılar

| Malzeme | A1 Mini | A1 | P1P | P1S | P2S | X1C | X1E | H2S | H2D | H2C |
|-----------|---------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| PLA | Evet | Evet | Evet | Evet | Evet | Evet | Evet | Evet | Evet | Evet |
| PLA+ | Evet | Evet | Evet | Evet | Evet | Evet | Evet | Evet | Evet | Evet |
| PLA-CF | Evet* | Evet* | Evet* | Evet* | Evet* | Evet | Evet | Evet* | Evet* | Evet* |
| PETG | Evet | Evet | Evet | Evet | Evet | Evet | Evet | Evet | Evet | Evet |
| PETG-CF | Evet* | Evet* | Evet* | Evet* | Evet* | Evet | Evet | Evet* | Evet* | Evet* |
| ABS | Hayır | Hayır | Mümkün** | Evet | Evet | Evet | Evet | Evet | Evet | Evet |
| ASA | Hayır | Hayır | Mümkün** | Evet | Evet | Evet | Evet | Evet | Evet | Evet |
| TPU | Evet | Evet | Evet | Evet | Evet | Evet | Evet | Evet | Evet | Evet |
| PA (Naylon) | Hayır | Hayır | Hayır | Mümkün** | Mümkün** | Evet | Evet | Evet | Evet | Evet |
| PA-CF | Hayır | Hayır | Hayır | Hayır | Hayır | Evet | Evet | Mümkün** | Mümkün** | Mümkün** |
| PA-GF | Hayır | Hayır | Hayır | Hayır | Hayır | Evet | Evet | Mümkün** | Mümkün** | Mümkün** |
| PC | Hayır | Hayır | Hayır | Mümkün** | Hayır | Evet | Evet | Mümkün** | Mümkün** | Mümkün** |
| PC-CF | Hayır | Hayır | Hayır | Hayır | Hayır | Evet | Evet | Hayır | Hayır | Hayır |
| PVA | Evet | Evet | Evet | Evet | Evet | Evet | Evet | Evet | Evet | Evet |
| HIPS | Hayır | Hayır | Mümkün** | Evet | Evet | Evet | Evet | Evet | Evet | Evet |

**Açıklama:**
- **Evet** — tam destekli ve önerilen
- **Evet*** — sertleştirilmiş çelik nozül gerektirir (HS01 veya eşdeğeri)
- **Mümkün**** — kısıtlamalarla çalışabilir, resmi olarak önerilmez
- **Hayır** — uygun değil (kabin yok, düşük sıcaklıklar vb.)

:::danger Kapalı kabin gereksinimleri
Kapalı kabin gerektiren malzemeler (ABS, ASA, PA, PC):
- **A1 ve A1 Mini** açık çerçeve — uygun değil
- **P1P** açık çerçeve — kabin aksesuarı gerektirir
- **P1S** kapalı kabin var, ancak aktif kabin ısıtması yok
- **X1C ve X1E** aktif ısıtmalı tam kapalı kabin — zorlu malzemeler için önerilen
:::

---

## Malzemeler ve nozül tipleri

| Malzeme | Pirinç (standart) | Sertleştirilmiş çelik (HS01) | Hardened Steel |
|-----------|--------------------|--------------------|----------------|
| PLA | Mükemmel | Mükemmel | Mükemmel |
| PLA+ | Mükemmel | Mükemmel | Mükemmel |
| PLA-CF | Kullanmayın | Mükemmel | Mükemmel |
| PLA Silk | Mükemmel | Mükemmel | Mükemmel |
| PETG | Mükemmel | Mükemmel | Mükemmel |
| PETG-CF | Kullanmayın | Mükemmel | Mükemmel |
| ABS | Mükemmel | Mükemmel | Mükemmel |
| ASA | Mükemmel | Mükemmel | Mükemmel |
| TPU | Mükemmel | İyi | İyi |
| PA (Naylon) | İyi | Mükemmel | Mükemmel |
| PA-CF | Kullanmayın | Mükemmel | Mükemmel |
| PA-GF | Kullanmayın | Mükemmel | Mükemmel |
| PC | İyi | Mükemmel | Mükemmel |
| PC-CF | Kullanmayın | Mükemmel | Mükemmel |
| PVA | Mükemmel | İyi | İyi |
| HIPS | Mükemmel | Mükemmel | Mükemmel |
| PVB | Mükemmel | İyi | İyi |

:::danger Karbon fiber ve cam fiber sertleştirilmiş nozül gerektirir
**-CF** (karbon fiber) veya **-GF** (cam fiber) içeren tüm malzemeler **sertleştirilmiş çelik nozül** gerektirir. Pirinç bu malzemelerle saatler ile günler arasında aşınır. Bambu Lab HS01 önerilir.

Sertleştirilmiş nozül gerektiren malzemeler:
- PLA-CF
- PETG-CF
- PA-CF / PA-GF
- PC-CF / PC-GF
:::

:::tip Normal malzemeler için pirinç vs sertleştirilmiş çelik
Pirinç nozül, normal malzemeler (PLA, PETG, ABS) için **daha iyi ısı iletkenliği** ve dolayısıyla daha düzgün ekstrüzyon sağlar. Sertleştirilmiş çelik de iyi çalışır, ancak 5–10 °C daha yüksek sıcaklık gerektirebilir. Günlük kullanım için pirinç, CF/GF malzemeler için sertleştirilmiş çelik kullanın.
:::

---

## Malzeme değişim ipuçları

AMS'de veya manuel olarak malzeme değiştirirken, kontaminasyonu önlemek için doğru temizleme önemlidir.

### Önerilen temizleme miktarı

| Geçiş | Temizleme miktarı | Not |
|-----------|-------------|---------|
| PLA → PLA (farklı renk) | 100–150 mm³ | Standart renk değişimi |
| PLA → PETG | 200–300 mm³ | Sıcaklık artışı, farklı akış |
| PETG → PLA | 200–300 mm³ | Sıcaklık düşüşü |
| ABS → PLA | 300–400 mm³ | Büyük sıcaklık farkı |
| PLA → ABS | 300–400 mm³ | Büyük sıcaklık farkı |
| PA → PLA | 400–500 mm³ | Naylon hotend'de kalır |
| PC → PLA | 400–500 mm³ | PC kapsamlı temizleme gerektirir |
| Koyu → Açık renk | 200–300 mm³ | Koyu pigment temizlemesi zor |
| Açık → Koyu renk | 100–150 mm³ | Daha kolay geçiş |

### Malzeme değişiminde sıcaklık değişikliği

| Geçiş | Öneri |
|----------|-----------|
| Soğuk → Sıcak (örn. PLA → ABS) | Yeni malzeme sıcaklığına ısıtın, iyice temizleyin |
| Sıcak → Soğuk (örn. ABS → PLA) | Önce yüksek sıcaklıkta temizleyin, sonra düşürün |
| Benzer sıcaklıklar (örn. PLA → PLA) | Standart temizleme |
| Büyük fark (örn. PLA → PC) | PETG ile ara adım yardımcı olabilir |

:::warning Naylon ve PC kalıntı bırakır
PA (Naylon) ve PC özellikle temizlemesi zordur. Bu malzemelerin kullanımından sonra:
1. **PETG** veya **ABS** ile yüksek sıcaklıkta (260–280 °C) temizleyin
2. En az **500 mm³** temizleme malzemesi kullanın
3. Ekstrüzyonu görsel olarak kontrol edin — renk değişikliği olmadan tamamen temiz olmalı
:::

---

## Hızlı referans — malzeme seçimi

Hangi malzemeye ihtiyacınız olduğundan emin değil misiniz? Bu rehberi kullanın:

| İhtiyaç | Önerilen malzeme |
|-------|-------------------|
| Prototipleme / günlük kullanım | PLA |
| Mekanik mukavemet | PETG, PLA Tough |
| Dış mekan kullanımı | ASA |
| Isı dayanımı | ABS, ASA, PC |
| Esnek parçalar | TPU |
| Maksimum mukavemet | PA-CF, PC-CF |
| Şeffaf | PETG (doğal), PC (doğal) |
| Estetik / dekorasyon | PLA Silk, PLA Sparkle |
| Geçmeli bağlantı / canlı menteşe | PETG, PA |
| Gıda teması | PLA (koşullu) |
