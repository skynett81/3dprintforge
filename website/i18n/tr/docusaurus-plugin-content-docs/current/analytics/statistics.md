---
sidebar_position: 1
title: İstatistikler
description: Zaman içinde tüm Bambu Lab yazıcıları için başarı oranı, filament tüketimi, trendler ve temel metrikler
---

# İstatistikler

İstatistikler sayfası, isteğe bağlı zaman dilimleri üzerinde temel metrikler, trendler ve filament tüketimiyle yazıcı aktivitenizin eksiksiz bir genel bakışını sunar.

Gidin: **https://localhost:3443/#statistics**

## Temel Metrikler

Sayfanın üst kısmında dört KPI kartı görüntülenir:

| Temel Metrik | Açıklama |
|---|---|
| **Başarı oranı** | Toplam baskı sayısına karşı başarılı baskıların oranı |
| **Toplam filament** | Seçilen dönemde kullanılan gram |
| **Toplam baskı saatleri** | Birikimli baskı süresi |
| **Ortalama baskı süresi** | Baskı başına medyan süre |

Her temel metrik, önceki dönemden yüzde sapma olarak değişimi gösterir (↑ yukarı / ↓ aşağı).

## Başarı Oranı

Başarı oranı yazıcı başına ve toplam olarak hesaplanır:

- **Başarılı** — kesinti olmadan tamamlanan baskı
- **İptal edildi** — kullanıcı tarafından manuel olarak durduruldu
- **Başarısız** — Print Guard, HMS hatası veya donanım arızası tarafından durduruldu

Başarısız olan baskıları ve nedenini görmek için başarı oranı diyagramına tıklayın.

:::tip Başarı Oranını İyileştirme
Başarısız baskıların nedenlerini belirlemek ve düzeltmek için [Hata Örüntüsü Analizi](../monitoring/erroranalysis) sayfasını kullanın.
:::

## Trendler

Trend görünümü, zaman içindeki gelişimi çizgi diyagramı olarak gösterir:

1. **Zaman Dilimi** seçin: Son 7 / 30 / 90 / 365 gün
2. **Gruplama** seçin: Gün / Hafta / Ay
3. **Metrik** seçin: Baskı sayısı / Saatler / Gram / Başarı oranı
4. İki metriği üst üste bindirmek için **Karşılaştır**'a tıklayın

Grafik yakınlaştırmayı (kaydırma) ve kaydırmayı (tıklayın ve sürükleyin) destekler.

## Filament Tüketimi

Filament tüketimi şu şekilde gösterilir:

- **Çubuk diyagramı** — gün/hafta/ay başına tüketim
- **Pasta diyagramı** — malzemeler arasında dağılım (PLA, PETG, ABS vb.)
- **Tablo** — malzeme başına toplam gram, metre ve maliyetin ayrıntılı listesi

### Yazıcı Başına Tüketim

Üstteki çoklu seçim filtresini kullanın:
- Yalnızca bir yazıcı gösterin
- İki yazıcıyı yan yana karşılaştırın
- Tüm yazıcılar için toplu toplam görün

## Etkinlik Takvimi

İstatistik sayfasında doğrudan kompakt bir GitHub tarzı ısı haritası görün (basitleştirilmiş görünüm) veya daha ayrıntılı görünüm için tam [Etkinlik Takvimi](./calendar) sayfasına gidin.

## Dışa Aktarma

1. **İstatistikleri Dışa Aktar**'a tıklayın
2. Tarih aralığını ve dahil etmek istediğiniz metrikleri seçin
3. Format seçin: **CSV** (ham veriler), **PDF** (rapor) veya **JSON**
4. Dosya indirilir

CSV dışa aktarma, daha fazla analiz için Excel ve Google Sheets ile uyumludur.

## Önceki Dönemle Karşılaştırma

Grafikleri karşılık gelen önceki dönemle üst üste bindirmek için **Önceki Dönemi Göster**'i etkinleştirin:

- Son 30 gün vs. önceki 30 gün
- Bu ay vs. geçen ay
- Bu yıl vs. geçen yıl

Bu, eskiye kıyasla daha fazla mı yoksa daha az mı baskı yaptığınızı ve başarı oranının iyileşip iyileşmediğini görmeyi kolaylaştırır.
