---
sidebar_position: 3
title: Ayarlar
description: Bambu Dashboard'daki tüm ayarlara kapsamlı genel bakış — yazıcı, bildirimler, tema, OBS, enerji, webhook'lar ve daha fazlası
---

# Ayarlar

Bambu Dashboard'daki tüm ayarlar, açık kategorilerle tek bir sayfada toplanmıştır. Her kategoride neler bulunduğuna ilişkin genel bir bakış sunulmaktadır.

Gidin: **https://localhost:3443/#settings**

## Yazıcılar

Kayıtlı yazıcıları yönetin:

| Ayar | Açıklama |
|---|---|
| Yazıcı ekle | Seri numarası ve erişim anahtarıyla yeni bir yazıcı kaydedin |
| Yazıcı adı | Özel görünen ad |
| Yazıcı modeli | X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C |
| MQTT bağlantısı | Bambu Cloud MQTT veya yerel MQTT |
| Erişim anahtarı | Bambu Lab uygulamasından LAN Erişim Kodu |
| IP adresi | Yerel (LAN) mod için |
| Kamera ayarları | Etkinleştir/devre dışı bırak, çözünürlük |

İlk yazıcının adım adım kurulumu için [Başlangıç](../getting-started/setup) sayfasına bakın.

## Bildirimler

Tam dokümantasyon için [Bildirimler](../features/notifications) sayfasına bakın.

Hızlı genel bakış:
- Bildirim kanallarını etkinleştir/devre dışı bırak (Telegram, Discord, e-posta vb.)
- Kanal başına olay filtresi
- Sessiz saatler (bildirim olmayan zaman aralığı)
- Kanal başına test düğmesi

## Tema

Tam dokümantasyon için [Tema](./themes) sayfasına bakın.

- Açık / Koyu / Otomatik mod
- 6 renk paleti
- Özel vurgu rengi
- Yuvarlama ve yoğunluk

## OBS Örtüsü

OBS örtüsü yapılandırması:

| Ayar | Açıklama |
|---|---|
| Varsayılan tema | dark / light / minimal |
| Varsayılan konum | Örtü için köşe |
| Varsayılan ölçek | Ölçekleme (0,5–2,0) |
| QR kodu göster | Örtüde panoya QR kodu göster |

Tam URL sözdizimi ve kurulum için [OBS Örtüsü](../features/obs-overlay) sayfasına bakın.

## Enerji ve Güç

| Ayar | Açıklama |
|---|---|
| Tibber API Tokeni | Tibber spot fiyatlarına erişim |
| Nordpool fiyat bölgesi | Fiyat bölgesi seçin |
| Şebeke ücreti (₺/kWh) | Şebeke ücreti tarifiniz |
| Yazıcı gücü (W) | Yazıcı modeli başına güç tüketimini yapılandırın |

## Home Assistant

| Ayar | Açıklama |
|---|---|
| MQTT aracısı | IP, port, kullanıcı adı, şifre |
| Discovery ön eki | Varsayılan: `homeassistant` |
| Discovery'yi etkinleştir | Varlıkları HA'ya yayınla |

## Webhook'lar

Genel webhook ayarları:

| Ayar | Açıklama |
|---|---|
| Webhook URL | Olaylar için alıcı URL |
| Gizli anahtar | HMAC-SHA256 imzası |
| Olay filtresi | Hangi olayların gönderileceği |
| Yeniden deneme sayısı | Hata durumunda deneme sayısı (varsayılan: 3) |
| Zaman aşımı | İsteğin vazgeçmeden önce beklediği saniye (varsayılan: 10) |

## Kuyruk Ayarları

| Ayar | Açıklama |
|---|---|
| Otomatik gönderim | Etkinleştir/devre dışı bırak |
| Gönderim stratejisi | İlk boş / En az kullanılan / Döngüsel |
| Onay gerektir | Göndermeden önce manuel onay |
| Kademeli başlatma | Kuyruktaki yazıcılar arasında gecikme |

## Güvenlik

| Ayar | Açıklama |
|---|---|
| Oturum süresi | Otomatik çıkış öncesi saat/gün |
| 2FA'yı zorla | Tüm kullanıcılar için 2FA gerektir |
| IP beyaz listesi | Erişimi belirli IP adreslerine kısıtla |
| HTTPS sertifikası | Özel sertifika yükle |

## Sistem

| Ayar | Açıklama |
|---|---|
| Sunucu portu | Varsayılan: 3443 |
| Günlük formatı | JSON / Metin |
| Günlük seviyesi | Hata / Uyarı / Bilgi / Hata ayıklama |
| Veritabanı temizliği | Eski geçmişin otomatik silinmesi |
| Güncellemeler | Yeni sürümleri kontrol et |
