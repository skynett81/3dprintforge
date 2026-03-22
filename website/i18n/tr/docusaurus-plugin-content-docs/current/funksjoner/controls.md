---
sidebar_position: 5
title: Yazıcı Kontrolü
description: Dashboard'dan doğrudan yazıcıya sıcaklık, hız, fanları ayarlayın ve G-code gönderin
---

# Yazıcı Kontrolü

Kontrol paneli, dashboard'dan doğrudan yazıcı üzerinde tam manuel kontrol sağlar.

## Sıcaklık Yönetimi

### Nozül
- 0–350 °C arasında hedef sıcaklık ayarlayın
- Komutu göndermek için **Ayarla**'ya tıklayın
- Gerçek zamanlı okuma animasyonlu halka göstergeyle gösterilir

### Isıtma Tablası
- 0–120 °C arasında hedef sıcaklık ayarlayın
- Baskıdan sonra otomatik kapanma (yapılandırılabilir)

### Kamera
- Kamera sıcaklığını görün (gerçek zamanlı okuma)
- **X1E, H2S, H2D, H2C**: M141 üzerinden aktif kamera ısı kontrolü (kontrol edilebilir hedef sıcaklık)
- **X1C**: Pasif muhafaza — kamera sıcaklığı görüntülenir, ancak doğrudan kontrol edilemez
- **P1S**: Pasif muhafaza — sıcaklık gösterilir, aktif kamera ısı kontrolü yok
- **P1P, A1, A1 mini ve chamberHeat olmayan H serisi**: Kamera sensörü yok

:::warning Maksimum sıcaklıklar
Nozül ve tabla için önerilen sıcaklıkları aşmayın. Sertleştirilmiş çelik nozül (HF tipi) için: maksimum 300 °C. Pirinç için: maksimum 260 °C. Yazıcı kılavuzuna bakın.
:::

## Hız Profilleri

Hız kontrolü dört ön ayarlı profil sunar:

| Profil | Hız | Kullanım Alanı |
|--------|----------|-------------|
| Sessiz | %50 | Gürültü azaltma, gece baskısı |
| Standart | %100 | Normal kullanım |
| Spor | %124 | Daha hızlı baskılar |
| Turbo | %166 | Maksimum hız (kalite düşer) |

Kaydırma çubuğu, %50–200 arasında özel bir yüzde ayarlamanıza olanak tanır.

## Fan Kontrolü

Fan hızlarını manuel olarak kontrol edin:

| Fan | Açıklama | Aralık |
|-------|-------------|--------|
| Parça soğutma fanı | Basılan nesneyi soğutur | %0–100 |
| Yardımcı fan | Kamera sirkülasyonu | %0–100 |
| Kamera fanı | Aktif kamera soğutması | %0–100 |

:::tip İyi ayarlar
- **PLA/PETG:** Parça soğutma %100, yardımcı %30
- **ABS/ASA:** Parça soğutma %0–20, kamera fanı kapalı
- **TPU:** Parça soğutma %50, düşük hız
:::

## G-code Konsolu

Doğrudan yazıcıya G-code komutları gönderin:

```gcode
; Örnek: Kafa konumunu taşı
G28 ; Tüm eksenleri sıfırla
G1 X150 Y150 Z10 F3000 ; Merkeze taşı
M104 S220 ; Nozül sıcaklığını ayarla
M140 S60  ; Tabla sıcaklığını ayarla
```

:::danger G-code ile dikkatli olun
Yanlış G-code yazıcıya zarar verebilir. Yalnızca anladığınız komutları gönderin. Bir baskının ortasında `M600` (filament değişimi) kullanmaktan kaçının.
:::

## Filament İşlemleri

Kontrol panelinden şunları yapabilirsiniz:

- **Filament yükle** — nozülü ısıtır ve filamenti çeker
- **Filament boşalt** — ısıtır ve filamenti çıkarır
- **Nozülü temizle** — temizleme döngüsü çalıştırır

## Makrolar

G-code komut dizilerini makro olarak kaydedin ve çalıştırın:

1. **Yeni Makro**'ya tıklayın
2. Makroya bir ad verin
3. G-code dizisini yazın
4. Bir tıklamayla kaydedin ve çalıştırın

Tabla kalibrasyonu için örnek makro:
```gcode
G28
M84
M500
```

## Baskı Kontrolü

Aktif baskı sırasında şunları yapabilirsiniz:

- **Duraklat** — mevcut katmandan sonra baskıyı duraklatır
- **Devam et** — duraklatılmış baskıyı devam ettirir
- **Durdur** — baskıyı iptal eder (geri alınamaz)
- **Acil durdur** — tüm motorların anında durması
