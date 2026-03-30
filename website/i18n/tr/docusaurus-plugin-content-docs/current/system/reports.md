---
sidebar_position: 7
title: Raporlar
description: İstatistikler, etkinlik özeti ve bakım hatırlatıcılarıyla otomatik haftalık ve aylık e-posta raporları
---

# Raporlar

Bambu Dashboard, istatistikler ve etkinlik özetleriyle otomatik e-posta raporları gönderebilir — haftalık, aylık veya her ikisi.

Gidin: **https://localhost:3443/#settings** → **Sistem → Raporlar**

## Ön Koşullar

Raporlar, yapılandırılmış e-posta bildirimlerini gerektirir. Raporları etkinleştirmeden önce **Ayarlar → Bildirimler → E-posta** altında SMTP'yi ayarlayın. [Bildirimler](../features/notifications) sayfasına bakın.

## Otomatik Raporları Etkinleştirme

1. **Ayarlar → Raporlar**'a gidin
2. **Haftalık rapor** ve/veya **Aylık rapor**'u etkinleştirin
3. **Gönderim zamanını** seçin:
   - Haftalık: haftanın günü ve saati
   - Aylık: ayın günü (örn. 1. Pazartesi / son Cuma)
4. **Alıcı e-postasını** doldurun (birden fazla için virgülle ayrılmış)
5. **Kaydet**'e tıklayın

Biçimlendirmeyi görmek için bir test raporu gönderin: **Şimdi Test Raporu Gönder**'e tıklayın.

## Haftalık Rapor İçeriği

Haftalık rapor son 7 günü kapsar:

### Özet
- Toplam baskı sayısı
- Başarılı / başarısız / iptal edilen sayısı
- Başarı oranı ve geçen haftadan değişim
- En aktif yazıcı

### Etkinlik
- Gün başına baskılar (mini grafik)
- Toplam baskı saatleri
- Toplam filament tüketimi (gram ve maliyet)

### Filament
- Malzeme ve tedarikçi başına tüketim
- Makara başına tahmini kalan (%20'nin altındaki makaralar vurgulanmış)

### Bakım
- Bu hafta gerçekleştirilen bakım görevleri
- Vadesi geçmiş bakım görevleri (kırmızı uyarı)
- Önümüzdeki hafta vadesi gelen görevler

### HMS Hataları
- Bu hafta yazıcı başına HMS hatası sayısı
- Onaylanmamış hatalar (ilgi gerektirir)

## Aylık Rapor İçeriği

Aylık rapor son 30 günü kapsar ve haftalık rapordan tüm içeriği ayrıca şunları içerir:

### Trend
- Geçen ayla karşılaştırma (%)
- Etkinlik haritası (ay için ısı haritası küçük resmi)
- Aylık başarı oranı gelişimi

### Maliyetler
- Toplam filament maliyeti
- Toplam elektrik maliyeti (güç ölçümü yapılandırılmışsa)
- Toplam aşınma maliyeti
- Birleşik bakım maliyeti

### Aşınma ve Sağlık
- Yazıcı başına sağlık puanı (geçen aydan değişimle)
- Değişim zamanına yaklaşan bileşenler

### İstatistik Öne Çıkanları
- En uzun başarılı baskı
- En çok kullanılan filament türü
- En yüksek aktiviteli yazıcı

## Raporu Özelleştirme

1. **Ayarlar → Raporlar → Özelleştirme**'ye gidin
2. Dahil etmek istediğiniz bölümleri işaretleyin/kaldırın
3. **Yazıcı filtresi** seçin: tüm yazıcılar veya bir seçim
4. **Logo görüntüleme** seçin: başlıkta Bambu Dashboard logosunu göster veya kapat
5. **Kaydet**'e tıklayın

## Rapor Arşivi

Gönderilen tüm raporlar saklanır ve yeniden açılabilir:

1. **Ayarlar → Raporlar → Arşiv**'e gidin
2. Listeden raporu seçin (tarihe göre sıralı)
3. HTML sürümünü görmek için **Aç**'a tıklayın
4. Raporu indirmek için **PDF'yi İndir**'e tıklayın

Raporlar **90 gün** sonra otomatik olarak silinir (yapılandırılabilir).
