---
sidebar_position: 3
title: Baskı Geçmişi
description: İstatistikler, filament takibi ve dışa aktarmayla tüm baskıların eksiksiz kaydı
---

# Baskı Geçmişi

Baskı geçmişi, istatistikler, filament tüketimi ve model kaynaklarına bağlantılarla dashboard üzerinden gerçekleştirilen tüm baskıların eksiksiz kaydını sunar.

## Geçmiş Tablosu

Tablo, tüm baskıları şunlarla gösterir:

| Sütun | Açıklama |
|---------|-------------|
| Tarih/saat | Başlangıç zamanı |
| Model adı | Dosya adı veya MakerWorld başlığı |
| Yazıcı | Hangi yazıcının kullanıldığı |
| Süre | Toplam baskı süresi |
| Filament | Kullanılan malzeme ve gram |
| Tablolar | Katman sayısı ve ağırlık (g) |
| Durum | Tamamlandı, iptal edildi, başarısız oldu |
| Görsel | Küçük resim (bulut entegrasyonuyla) |

## Arama ve Filtreleme

Baskıları bulmak için arama alanını ve filtreleri kullanın:

- Model adında serbest metin araması
- Yazıcı, malzeme, durum, tarihe göre filtrele
- Tüm sütunlarda sırala

## Model Kaynak Bağlantıları

Baskı MakerWorld'den başlatılmışsa, model sayfasına doğrudan bir bağlantı görüntülenir. Yeni sekmede MakerWorld'ü açmak için model adına tıklayın.

:::info Bambu Cloud
Model bağlantıları ve küçük resimler Bambu Cloud entegrasyonu gerektirir. [Bambu Cloud](../kom-i-gang/bambu-cloud) sayfasına bakın.
:::

## Filament Takibi

Her baskı için şunlar kaydedilir:

- **Malzeme** — PLA, PETG, ABS vb.
- **Kullanılan gram** — tahmini tüketim
- **Makara** — hangi makaranın kullanıldığı (depoya kayıtlıysa)
- **Renk** — rengin hex kodu

Bu, zaman içindeki filament tüketiminin doğru bir resmini verir ve satın alma planlamanıza yardımcı olur.

## İstatistikler

**Geçmiş → İstatistikler** altında toplu verileri bulursunuz:

- **Toplam baskı sayısı** — ve başarı oranı
- **Toplam baskı süresi** — saat ve gün
- **Filament tüketimi** — malzeme başına gram ve km
- **Günlük baskılar** — kayan grafik
- **En çok kullanılan malzemeler** — pasta grafiği
- **Baskı süresi dağılımı** — histogram

İstatistikler zaman dilimine göre filtrelenebilir (7g, 30g, 90g, 1yıl, tümü).

## Dışa Aktarma

### CSV Dışa Aktarma
Tüm geçmişi veya filtrelenmiş sonuçları dışa aktarın:
**Geçmiş → Dışa Aktar → CSV İndir**

CSV dosyaları tüm sütunları içerir ve Excel, LibreOffice Calc'ta açılabilir veya diğer araçlara içe aktarılabilir.

### Otomatik Yedekleme
Geçmiş, güncellemeler sırasında otomatik olarak yedeklenen SQLite veritabanının bir parçasıdır. Manuel yedek **Ayarlar → Yedek** altında alınabilir.

## Düzenleme

Baskı geçmişi kayıtlarını sonradan düzenleyebilirsiniz:

- Model adını düzeltme
- Not ekleme
- Filament tüketimini düzeltme
- Yanlış kaydedilen baskıları silme

Bir satıra sağ tıklayın ve **Düzenle**'yi seçin veya kalem simgesine tıklayın.
