---
sidebar_position: 3
title: Bambu Cloud Entegrasyonu
description: Model görselleri ve baskı geçmişini senkronize etmek için dashboard'u Bambu Lab Cloud'a bağlayın
---

# Bambu Cloud Entegrasyonu

Bambu Dashboard, model görselleri, baskı geçmişi ve filament verilerini almak için **Bambu Lab Cloud**'a bağlanabilir. Dashboard bulut bağlantısı olmadan da çalışır, ancak bulut entegrasyonu ek avantajlar sunar.

## Bulut Entegrasyonunun Faydaları

| Özellik | Bulutsuz | Bulutlu |
|---------|-----------|----------|
| Canlı yazıcı durumu | Evet | Evet |
| Baskı geçmişi (yerel) | Evet | Evet |
| MakerWorld'den model görselleri | Hayır | Evet |
| Bambu filament profilleri | Hayır | Evet |
| Baskı geçmişi senkronizasyonu | Hayır | Evet |
| Buluttan AMS filamenti | Hayır | Evet |

## Bambu Cloud'a Bağlanma

1. **Ayarlar → Bambu Cloud**'a gidin
2. Bambu Lab e-posta ve şifrenizi girin
3. **Giriş Yap**'a tıklayın
4. Hangi verilerin senkronize edileceğini seçin

:::warning Gizlilik
Kullanıcı adı ve şifre düz metin olarak saklanmaz. Dashboard, yerel olarak saklanan bir OAuth token almak için Bambu Labs API'sini kullanır. Verileriniz asla sunucunuzu terk etmez.
:::

## Senkronizasyon

### Model Görselleri

Bulut bağlandığında, model görselleri **MakerWorld**'den otomatik olarak alınır ve şuralarda gösterilir:
- Baskı geçmişi
- Dashboard (aktif baskı sırasında)
- 3D model görüntüleyici

### Baskı Geçmişi

Bulut senkronizasyonu, Bambu Lab uygulamasından baskı geçmişini içe aktarır. Yinelenenler, zaman damgası ve seri numarasına göre otomatik olarak filtrelenir.

### Filament Profilleri

Bambu Labs'ın resmi filament profilleri senkronize edilir ve filament deposunda gösterilir. Bunları kendi profilleriniz için başlangıç noktası olarak kullanabilirsiniz.

## Bulut Olmadan Ne Çalışır?

Tüm temel işlevler bulut bağlantısı olmadan çalışır:

- LAN üzerinden yazıcıya doğrudan MQTT bağlantısı
- Canlı durum, sıcaklık, kamera
- Yerel baskı geçmişi ve istatistikleri
- Filament deposu (manuel yönetim)
- Bildirimler ve zamanlayıcı

:::tip Yalnızca LAN modu
Dashboard'u internet bağlantısı olmadan kullanmak ister misiniz? İzole bir ağda mükemmel çalışır — sadece yazıcıya IP üzerinden bağlanın ve bulut entegrasyonunu kapalı bırakın.
:::

## Sorun Giderme

**Giriş başarısız:**
- Bambu Lab uygulaması için e-posta ve şifrenin doğru olduğunu kontrol edin
- Hesabın iki faktörlü kimlik doğrulama kullanıp kullanmadığını kontrol edin (henüz desteklenmiyor)
- Çıkış yapıp tekrar giriş yapmayı deneyin

**Senkronizasyon durur:**
- Token süresi dolmuş olabilir — Ayarlar'da çıkış yapıp tekrar giriş yapın
- Sunucunuzdan internet bağlantısını kontrol edin
