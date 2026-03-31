---
sidebar_position: 5
title: Atık Takibi
description: AMS temizleme ve destek malzemesinden filament atığını takip edin, maliyetleri hesaplayın ve verimliliği optimize edin
---

# Atık Takibi

Atık takibi, yazdırma sırasında ne kadar filamenti boşa harcadığınız hakkında tam içgörü sağlar — AMS temizleme, malzeme değişimlerinde yıkama ve destek malzemesi — ve bunun size ne kadara mal olduğu.

Gidin: **https://localhost:3443/#waste**

## Atık Kategorileri

3DPrintForge üç tür atığı birbirinden ayırır:

| Kategori | Kaynak | Tipik Miktar |
|---|---|---|
| **AMS temizleme** | Çok renkli baskıda AMS'de renk değişimi | Değişim başına 5–30 g |
| **Malzeme değişimi yıkaması** | Farklı malzemeler arasında geçişte temizleme | Değişim başına 10–50 g |
| **Destek malzemesi** | Baskıdan sonra çıkarılan destek yapıları | Değişkendir |

## AMS Temizleme Takibi

AMS temizleme verileri doğrudan MQTT telemetrisi ve G-kodu analizinden alınır:

- **Renk değişimi başına gram** — G-kodu temizleme bloğundan hesaplanır
- **Renk değişimi sayısı** — baskı günlüğünden sayılır
- **Toplam temizleme tüketimi** — seçilen dönemdeki toplam

:::tip Temizlemeyi Azaltın
Bambu Studio, renk kombinasyonu başına temizleme hacmi ayarlarına sahiptir. Düşük renk farkı olan renk çiftleri için temizleme hacmini azaltın (örn. beyaz → açık gri) ve filament tasarrufu yapın.
:::

## Verimlilik Hesaplama

Verimlilik toplam yüzde olarak hesaplanır:

```
Verimlilik % = (model malzemesi / toplam tüketim) × 100

Toplam tüketim = model malzemesi + temizleme + destek malzemesi
```

**Örnek:**
- Model: 45 g
- Temizleme: 12 g
- Destek: 8 g
- Toplam: 65 g
- **Verimlilik: %69**

Zaman içinde iyileşip iyileşmediğinizi görmek için verimlilik bir trend grafiği olarak gösterilir.

## Atık Maliyeti

Kayıtlı filament fiyatlarına göre hesaplanır:

| Kalem | Hesaplama |
|---|---|
| Temizleme maliyeti | Temizleme gramı × renk başına gram fiyatı |
| Destek maliyeti | Destek gramı × gram fiyatı |
| **Toplam atık maliyeti** | Yukarıdakilerin toplamı |
| **Başarılı baskı başına maliyet** | Atık maliyeti / baskı sayısı |

## Yazıcı ve Malzeme Başına Atık

Görünümü şuna göre filtreleyin:

- **Yazıcı** — hangi yazıcının en fazla atık ürettiğini görün
- **Malzeme** — filament türü başına atığı görün
- **Dönem** — gün, hafta, ay, yıl

Tablo görünümü, tahmini maliyet dahil en yüksek atıkla başlayan sıralı bir liste gösterir.

## Optimizasyon İpuçları

Sistem, atığı azaltmak için otomatik öneriler oluşturur:

- **Renk sırası değiştirme** — Renk A→B, B→A'dan daha fazla temizleme gerektiriyorsa sistem sırayı değiştirmeyi önerir
- **Renk değişim katmanlarını birleştirme** — Değişimleri en aza indirmek için aynı renkli katmanları gruplar
- **Destek yapısı optimizasyonu** — Yönelimi değiştirerek destek azaltmasını tahmin eder

:::info Doğruluk
Temizleme hesaplamaları G-kodundan tahminidir. Gerçek atık, yazıcı davranışı nedeniyle %10–20 oranında farklılık gösterebilir.
:::

## Dışa Aktarma ve Raporlama

1. **Atık Verilerini Dışa Aktar**'a tıklayın
2. Dönem ve format seçin (CSV / PDF)
3. Atık verileri, proje raporlarına ve faturalara maliyet kalemi olarak dahil edilebilir

Kapsamlı tüketim genel bakışı için [Filament Analizi](./filamentanalytics) sayfasına da bakın.
