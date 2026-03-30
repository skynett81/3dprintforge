---
sidebar_position: 3
title: Günlük kullanım
description: Bambu Dashboard'un günlük kullanımına yönelik pratik bir rehber — sabah rutini, izleme, baskı sonrası ve bakım
---

# Günlük kullanım

Bu rehber, günlük yaşamda Bambu Dashboard'u nasıl verimli kullanacağınızı anlatır — günün başından sonuna kadar.

## Sabah rutini

Panoyu açın ve şu noktalara hızlıca göz atın:

### 1. Yazıcı durumunu kontrol edin
Genel bakış paneli tüm yazıcılarınızın durumunu gösterir. Şunlara dikkat edin:
- **Kırmızı simgeler** — dikkat gerektiren hatalar
- **Bekleyen mesajlar** — geceden gelen HMS uyarıları
- **Tamamlanmamış baskılar** — gece baskısı yaptıysanız, bitti mi?

### 2. AMS seviyelerini kontrol edin
**Filament**'e gidin veya panodaki AMS widget'ını kontrol edin:
- 100 g'ın altında makara var mı? Değiştirin veya yeni sipariş verin
- Bugünkü baskılar için doğru slotta doğru filament var mı?

### 3. Bildirimleri ve olayları kontrol edin
**Bildirim günlüğü** altında (zil simgesi) şunları göreceksiniz:
- Gece yaşanan olaylar
- Otomatik kaydedilen hatalar
- Alarm tetikleyen HMS kodları

## Baskı başlatma

### Dosyadan (Bambu Studio)
1. Bambu Studio'yu açın
2. Modeli yükleyin ve dilimleyin
3. Yazıcıya gönderin — pano otomatik olarak güncellenir

### Kuyruktan
Önceden planlanmış baskılarınız varsa:
1. **Kuyruk**'a gidin
2. **Sonrakini başlat**'a tıklayın veya bir işi üste sürükleyin
3. **Yazıcıya gönder** ile onaylayın

Kuyruk yönetimi hakkında tam bilgi için [Baskı kuyruğu belgeleri](../features/queue) sayfasına bakın.

### Zamanlanmış baskı (zamanlayıcı)
Belirli bir saatte baskı başlatmak için:
1. **Zamanlayıcı**'ya gidin
2. **+ Yeni iş** düğmesine tıklayın
3. Dosya, yazıcı ve saat seçin
4. En ucuz saati otomatik seçmek için **Elektrik fiyatı optimizasyonu**'nu etkinleştirin

Ayrıntılar için [Zamanlayıcı](../features/scheduler) sayfasına bakın.

## Aktif baskıyı izleme

### Kamera görünümü
Yazıcı kartındaki kamera simgesine tıklayın. Şunları yapabilirsiniz:
- Panoda canlı akışı izleyin
- Arka planda izleme için ayrı sekmede açın
- Manuel ekran görüntüsü alın

### İlerleme bilgisi
Aktif baskı kartı şunları gösterir:
- Tamamlanma yüzdesi
- Tahmini kalan süre
- Mevcut katman / toplam katman sayısı
- Aktif filament ve rengi

### Sıcaklıklar
Gerçek zamanlı sıcaklık eğrileri ayrıntı panelinde görüntülenir:
- Nozul sıcaklığı — ±2°C içinde sabit kalmalı
- Tabla sıcaklığı — iyi yapışma için önemli
- Hazne sıcaklığı — kademeli olarak yükselir, özellikle ABS/ASA için önemli

### Print Guard
**Print Guard** etkinleştirildiğinde, pano otomatik olarak spagetti ve hacimsel sapmaları izler. Bir şey tespit edilirse:
1. Baskı duraklatılır
2. Bildirim alırsınız
3. Kamera görüntüleri sonradan incelenmek üzere kaydedilir

## Baskı sonrası — kontrol listesi

### Kaliteyi kontrol edin
1. Kamerayı açın ve sonucu tabla üzerindeyken inceleyin
2. İstatistikleri görmek için **Geçmiş → Son baskı**'ya gidin
3. Not kaydedin: ne iyi gitti, ne geliştirilebilir

### Arşivleme
Geçmişte kalan baskılar otomatik olarak arşivlenmez — olduğu gibi kalır. Düzenlemek istiyorsanız:
- Bir baskıya tıklayın → **Arşivle** ile arşive taşıyın
- İlgili baskıları gruplandırmak için **Projeler**'i kullanın

### Filament ağırlığını güncelleyin
Doğruluk için makarayı tartıyorsanız (önerilen):
1. Makarayı tartın
2. **Filament → [Makara]** bölümüne gidin
3. **Kalan ağırlık**'ı güncelleyin

## Bakım hatırlatıcıları

Pano, bakım aralıklarını otomatik olarak takip eder. **Bakım** altında şunları görürsünüz:

| Görev | Aralık | Durum |
|-------|--------|-------|
| Nozul temizliği | Her 50 saatte bir | Otomatik kontrol edilir |
| Mil yağlama | Her 200 saatte bir | Panoda takip edilir |
| Tabla kalibrasyonu | Plaka değişiminden sonra | Manuel hatırlatıcı |
| AMS temizliği | Aylık | Takvim bildirimi |

**İzleme → Bakım → Bildirimler** altında bakım bildirimlerini etkinleştirin.

:::tip Haftalık bakım günü belirleyin
Haftada bir sabit bakım günü (örn. Pazar akşamı), gereksiz arıza süresini önler. Panodaki hatırlatıcı işlevini kullanın.
:::

## Elektrik fiyatı — baskı yapmak için en iyi zaman

Elektrik fiyatı entegrasyonunu bağladıysanız (Nordpool / Home Assistant):

1. **Analiz → Elektrik fiyatı**'na gidin
2. Sonraki 24 saat için fiyat grafiğine bakın
3. En ucuz saatler yeşil ile işaretlenmiştir

**Elektrik fiyatı optimizasyonu** etkinleştirilmiş **Zamanlayıcı**'yı kullanın — pano işi otomatik olarak en ucuz mevcut pencerede başlatır.

:::info Tipik olarak en ucuz saatler
Gece (01:00–06:00) genellikle en ucuz saatlerdir. Önceki akşam kuyruğa gönderilen 8 saatlik bir baskı, elektrik maliyetinden %30–50 tasarruf sağlayabilir.
:::
