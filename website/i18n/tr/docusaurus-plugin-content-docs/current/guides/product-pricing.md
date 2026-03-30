---
sidebar_position: 11
title: Ürün Fiyatlandırma — satış fiyatı hesaplama
description: Tüm maliyet faktörleriyle 3D baskıları satış için fiyatlandırma rehberi
---

# Ürün Fiyatlandırma — satış fiyatı hesaplama

Bu rehber, sattığınız 3D baskılar için doğru satış fiyatını bulmak amacıyla maliyet hesaplayıcısını nasıl kullanacağınızı açıklar.

## Maliyet Genel Bakışı

Bir 3D baskının maliyeti şu bileşenlerden oluşur:

| Bileşen | Açıklama | Örnek |
|-----------|-------------|---------|
| **Filament** | Ağırlık ve makara fiyatına dayalı malzeme maliyeti | 100g × 0,25 kr/g = 25 kr |
| **Atık** | Malzeme israfı (temizleme, başarısız baskılar, destek) | %10 ekstra = 2,50 kr |
| **Elektrik** | Baskı sırasında güç tüketimi | 3,5s × 150W × 1,50 kr/kWh = 0,79 kr |
| **Aşınma** | Nozül + makine değeri ömür boyunca | 3,5s × 0,15 kr/s = 0,53 kr |
| **İşçilik** | Kurulum, son işlem, paketleme için zamanınız | 10 dk × 200 kr/s = 33,33 kr |
| **Kâr payı** | Kâr marjı | %20 = 12,43 kr |

**Toplam üretim maliyeti** = tüm bileşenlerin toplamı

## Ayarları Yapılandırma

### Temel Ayarlar

**Filament → ⚙ Ayarlar**'a gidin ve doldurun:

1. **Elektrik fiyatı (kr/kWh)** — elektrik fiyatınız. Elektrik faturanızı kontrol edin veya Nordpool entegrasyonunu kullanın
2. **Yazıcı gücü (W)** — Bambu Lab yazıcılar için genellikle 150W
3. **Makine maliyeti (kr)** — yazıcı için ödediğiniz tutar
4. **Makine ömrü (saat)** — beklenen ömür (3000-8000 saat)
5. **İşçilik maliyeti (kr/saat)** — saatlik ücretiniz
6. **Hazırlık süresi (dk)** — filament değişimi, tabla kontrolü, paketleme için ortalama süre
7. **Kâr payı (%)** — istediğiniz kâr marjı
8. **Nozül maliyeti (kr/saat)** — nozül aşınması (HS01 ≈ 0,05 kr/s)
9. **Atık faktörü** — malzeme israfı (1,1 = %10 ekstra, 1,15 = %15)

:::tip Bambu Lab için tipik değerler
| Ayar | Hobi | Yarı-profesyonel | Profesyonel |
|---|---|---|---|
| Elektrik fiyatı | 1,50 kr/kWh | 1,50 kr/kWh | 1,00 kr/kWh |
| Yazıcı gücü | 150W | 150W | 150W |
| Makine maliyeti | 5 000 kr | 12 000 kr | 25 000 kr |
| Makine ömrü | 3 000s | 5 000s | 8 000s |
| İşçilik maliyeti | 0 kr/s | 150 kr/s | 250 kr/s |
| Hazırlık süresi | 5 dk | 10 dk | 15 dk |
| Kâr payı | %0 | %30 | %50 |
| Atık faktörü | 1,05 | 1,10 | 1,15 |
:::

## Maliyet Hesaplama

1. **Maliyet Hesaplayıcısı**'na gidin (`https://localhost:3443/#costestimator`)
2. Bir `.3mf` veya `.gcode` dosyasını **sürükleyip bırakın**
3. Sistem otomatik olarak okur: filament ağırlığı, tahmini süre, renkler
4. **Makaraları bağlayın** — stoktan hangi makaraların kullanıldığını seçin
5. **Maliyet Hesapla**'ya tıklayın

### Sonuç şunları gösterir:

- **Filament** — renk başına malzeme maliyeti
- **Atık/israf** — atık faktörüne dayalı
- **Elektrik** — varsa Nordpool'dan canlı spot fiyat kullanır
- **Aşınma** — nozül + makine değeri
- **İşçilik** — saatlik ücret + hazırlık süresi
- **Üretim maliyeti** — yukarıdakilerin toplamı
- **Kâr payı** — kâr marjınız
- **Toplam maliyet** — en az talep etmeniz gereken tutar
- **Önerilen satış fiyatları** — 2×, 2,5×, 3× marj

## Fiyatlandırma Stratejileri

### 2× marj (önerilen minimum)
Üretim maliyeti + öngörülemeyen giderleri karşılar. Arkadaşlar/aile ve basit geometri için kullanın.

### 2,5× marj (standart)
Fiyat ve değer arasında iyi denge. Çoğu ürün için uygundur.

### 3× marj (premium)
Karmaşık modeller, çok renkli, yüksek kalite veya niş pazarlar için.

:::warning Gizli maliyetleri unutmayın
- Başarısız baskılar (tüm baskıların %5-15'i başarısız olur)
- Kullanılamayan filament (son 50g genellikle zordur)
- Müşteri hizmetine harcanan zaman
- Ambalaj ve kargo
- Yazıcı bakımı
:::

## Örnek: Telefon tutucu fiyatlandırma

| Parametre | Değer |
|-----------|-------|
| Filament ağırlığı | 45g PLA |
| Baskı süresi | 2 saat |
| Spot fiyat | 1,20 kr/kWh |

**Hesaplama:**
- Filament: 45g × 0,25 kr/g = 11,25 kr
- Atık (%10): 1,13 kr
- Elektrik: 2s × 0,15kW × 1,20 = 0,36 kr
- Aşınma: 2s × 0,15 = 0,30 kr
- İşçilik: (2s + 10dk) × 200 kr/s = 433 kr (veya hobi için 0)
- **Üretim maliyeti (hobi)**: ~13 kr
- **Satış fiyatı 2,5×**: ~33 kr

## Tahmini Kaydet

Hesaplamayı arşivlemek için **Tahmini Kaydet**'e tıklayın. Kaydedilen tahminler maliyet hesaplayıcısındaki **Kaydedilenler** sekmesinde bulunur.

## E-ticaret

[E-ticaret modülünü](../integrations/ecommerce) kullanıyorsanız, otomatik fiyat hesaplama için maliyet tahminlerini doğrudan siparişlere bağlayabilirsiniz.
