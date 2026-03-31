---
sidebar_position: 6
title: Bildirimler
description: Tüm yazıcı olayları için Telegram, Discord, e-posta, webhook, ntfy, Pushover ve SMS üzerinden bildirimleri yapılandırın
---

# Bildirimler

3DPrintForge, evde ya da hareket halinde yazıcılarınızla ilgili her zaman haberdar olmanızı sağlayan çok sayıda kanal aracılığıyla bildirimleri destekler.

Gidin: **https://localhost:3443/#settings** → **Bildirimler** sekmesi

## Mevcut Kanallar

| Kanal | Gereksinim | Görsel Destekler |
|---|---|---|
| Telegram | Bot token + Chat ID | ✅ |
| Discord | Webhook URL | ✅ |
| E-posta | SMTP sunucusu | ✅ |
| Webhook | URL + isteğe bağlı anahtar | ✅ (base64) |
| ntfy | ntfy sunucusu + konu | ❌ |
| Pushover | API token + Kullanıcı anahtarı | ✅ |
| SMS (Twilio) | Hesap SID + Auth token | ❌ |
| Tarayıcı push | Yapılandırma gerekmez | ❌ |

## Kanal Başına Kurulum

### Telegram

1. [@BotFather](https://t.me/BotFather) üzerinden bir bot oluşturun — `/newbot` gönderin
2. **Bot token**'ı kopyalayın (format: `123456789:ABC-def...`)
3. Botle bir konuşma başlatın ve `/start` gönderin
4. **Chat ID**'nizi bulun: `https://api.telegram.org/bot<TOKEN>/getUpdates` adresine gidin
5. 3DPrintForge'da: token ve Chat ID'yi yapıştırın, **Test**'e tıklayın

:::tip Grup kanalı
Telegram grubunu alıcı olarak kullanabilirsiniz. Grupların Chat ID'leri `-` ile başlar.
:::

### Discord

1. Bildirim göndermek istediğiniz Discord sunucusunu açın
2. Kanal ayarları → **Entegrasyonlar → Webhooks**'a gidin
3. **Yeni Webhook**'a tıklayın, bir ad verin ve kanal seçin
4. Webhook URL'sini kopyalayın
5. URL'yi 3DPrintForge'a yapıştırın ve **Test**'e tıklayın

### E-posta

1. SMTP sunucusunu, portu doldurun (TLS için genellikle 587)
2. SMTP hesabı için kullanıcı adı ve şifre
3. **Kimden** ve **Kime** adresi(leri) (birden fazla için virgülle ayrılmış)
4. Güvenli gönderim için **TLS/STARTTLS**'yi etkinleştirin
5. Test e-postası göndermek için **Test**'e tıklayın

:::warning Gmail
Gmail için normal şifre değil **Uygulama şifresi** kullanın. Önce Google hesabınızda 2 faktörlü kimlik doğrulamayı etkinleştirin.
:::

### ntfy

1. [ntfy.sh](https://ntfy.sh)'de bir konu oluşturun veya kendi ntfy sunucunuzu çalıştırın
2. Sunucu URL'sini (ör. `https://ntfy.sh`) ve konu adını doldurun
3. Telefona ntfy uygulamasını yükleyin ve aynı konuya abone olun
4. **Test**'e tıklayın

### Pushover

1. [pushover.net](https://pushover.net)'de bir hesap oluşturun
2. Yeni bir uygulama oluşturun — **API Token**'ı kopyalayın
3. Pushover dashboard'unuzda **User Key**'inizi bulun
4. Her ikisini de 3DPrintForge'a doldurun ve **Test**'e tıklayın

### Webhook (özel)

3DPrintForge, JSON yüküyle bir HTTP POST gönderir:

```json
{
  "event": "print_complete",
  "printer": "Benim X1C'm",
  "printer_id": "abc123",
  "timestamp": "2026-03-22T14:30:00Z",
  "data": {
    "file": "benchy.3mf",
    "duration_minutes": 47,
    "filament_used_g": 12.4
  }
}
```

İstekleri `X-Bambu-Signature` başlığındaki HMAC-SHA256 imzasıyla doğrulamak için bir **Gizli Anahtar** ekleyin.

## Olay Filtresi

Kanal başına hangi olayların bildirimleri tetikleyeceğini seçin:

| Olay | Açıklama |
|---|---|
| Baskı başladı | Yeni baskı başlıyor |
| Baskı tamamlandı | Baskı bitti (görüntülü) |
| Baskı başarısız | Baskı hatayla iptal edildi |
| Baskı duraklatıldı | Manuel veya otomatik duraklama |
| Print Guard uyardı | XCam veya sensör bir eylem tetikledi |
| Filament azaldı | Makara neredeyse boş |
| AMS hatası | Tıkanma, nemli filament vb. |
| Yazıcı bağlantısı kesildi | MQTT bağlantısı kaybedildi |
| Kuyruk işi gönderildi | Kuyruktan iş gönderildi |

Her kanal için ayrı ayrı istediğiniz olayları işaretleyin.

## Sessiz Saatler

Gece bildirimi almamak için:

1. Bildirim ayarları altında **Sessiz Saatler**'i etkinleştirin
2. **Başlangıç** ve **Bitiş** saatlerini ayarlayın (ör. 23:00 → 07:00)
3. Süreç için **Saat Dilimi** seçin
4. Kritik bildirimler (Print Guard hatası) geçersiz kılınabilir — **Her zaman kritik gönder**'i işaretleyin

## Tarayıcı Push Bildirimleri

Uygulama olmadan doğrudan tarayıcıda bildirim alın:

1. **Ayarlar → Bildirimler → Tarayıcı Push**'a gidin
2. **Push bildirimlerini etkinleştir**'e tıklayın
3. Tarayıcının izin iletişim kutusunu kabul edin
4. Dashboard simge durumuna küçültülmüş olsa bile bildirimler çalışır (sekmenin açık olmasını gerektirir)

:::info PWA
Arka planda açık sekme olmadan push bildirimleri için 3DPrintForge'u PWA olarak yükleyin. [PWA](../system/pwa) sayfasına bakın.
:::
