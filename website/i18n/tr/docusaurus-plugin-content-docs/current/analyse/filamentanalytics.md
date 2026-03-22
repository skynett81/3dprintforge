---
sidebar_position: 3
title: Filament Analizi
description: Malzeme ve tedarikçi başına filament tüketimi, maliyetler, tahminler, tüketim oranları ve atık hakkında ayrıntılı analiz
---

# Filament Analizi

Filament analizi, filament tüketiminiz hakkında tam içgörü sağlar — ne kullandığınızı, ne kadara mal olduğunu ve nerede tasarruf edebileceğinizi.

Gidin: **https://localhost:3443/#filament-analytics**

## Tüketim Genel Bakışı

En üstte seçilen dönem için bir özet gösterilir:

- **Toplam tüketim** — tüm malzemeler için gram ve metre
- **Tahmini maliyet** — makara başına kayıtlı fiyata göre
- **En çok kullanılan malzeme** — tür ve tedarikçi
- **Geri dönüşüm oranı** — gerçek modeldeki filament payı ile destek/temizleme arasındaki oran

### Malzeme Başına Tüketim

Pasta grafiği ve tablo, malzemeler arasındaki dağılımı gösterir:

| Sütun | Açıklama |
|---|---|
| Malzeme | PLA, PETG, ABS, PA vb. |
| Tedarikçi | Bambu Lab, PolyMaker, Prusament vb. |
| Kullanılan gram | Toplam ağırlık |
| Metre | Tahmini uzunluk |
| Maliyet | Gram × gram başına fiyat |
| Baskılar | Bu malzemeyle baskı sayısı |

Tek makara düzeyine inmek için bir satıra tıklayın.

## Tüketim Oranları

Tüketim oranı, zaman birimi başına ortalama filament tüketimini gösterir:

- **Saat başına gram** — aktif yazdırma sırasında
- **Hafta başına gram** — yazıcı kapalı kalma süresi dahil
- **Baskı başına gram** — çıktı başına ortalama

Bunlar gelecekteki ihtiyaç tahminlerini hesaplamak için kullanılır.

:::tip Satın Alma Planlaması
Makara stokunu planlamak için tüketim oranını kullanın. Sistem, tahmini stokun 14 gün içinde tükeneceği durumlarda otomatik olarak uyarır (yapılandırılabilir).
:::

## Maliyet Tahmini

Geçmiş tüketim oranına göre hesaplanır:

- **Sonraki 30 günün tahmini tüketimi** (malzeme başına gram)
- **Sonraki 30 günün tahmini maliyeti**
- **Önerilen stok miktarı** (30 / 60 / 90 günlük işletme için yeterli)

Tahmin, en az bir yıllık veriniz varsa mevsimsel varyasyonu dikkate alır.

## Atık ve Verimlilik

Tam dokümantasyon için [Atık Takibi](./waste) sayfasına bakın. Filament analizi bir özet gösterir:

- **AMS temizleme** — gram ve toplam tüketimdeki pay
- **Destek malzemesi** — gram ve pay
- **Gerçek model malzemesi** — kalan pay (verimlilik %)
- **Tahmini atık maliyeti** — atığın size ne kadara mal olduğu

## Makara Günlüğü

Tüm makaralar (aktif ve boş) günlüğe kaydedilir:

| Alan | Açıklama |
|---|---|
| Makara adı | Malzeme adı ve rengi |
| Orijinal ağırlık | Başlangıçta kayıtlı ağırlık |
| Kalan ağırlık | Hesaplanan kalan miktar |
| Kullanılan | Toplam kullanılan gram |
| Son kullanım | Son baskının tarihi |
| Durum | Aktif / Boş / Depolanmış |

## Fiyat Kaydı

Doğru maliyet analizi için makara başına fiyatları kaydedin:

1. **Filament Deposu**'na gidin
2. Bir makara üzerine tıklayın → **Düzenle**
3. **Satın Alma Fiyatı** ve **Satın Alma Ağırlığı**'nı doldurun
4. Sistem gram başına fiyatı otomatik olarak hesaplar

Kayıtlı fiyatı olmayan makaralar **varsayılan gram başına fiyatı** kullanır (**Ayarlar → Filament → Varsayılan Fiyat** altında ayarlanır).

## Dışa Aktarma

1. **Filament Verilerini Dışa Aktar**'a tıklayın
2. Dönem ve format seçin (CSV / PDF)
3. CSV, baskı başına gram, maliyet ve malzemeyle birlikte bir satır içerir
