---
sidebar_position: 7
title: Bildirimleri ayarlama
description: 3DPrintForge'da Telegram, Discord, e-posta ve push bildirimlerini yapılandırın
---

# Bildirimleri ayarlama

3DPrintForge, tamamlanan baskılardan kritik hatalara kadar her şey için sizi bilgilendirebilir — Telegram, Discord, e-posta veya tarayıcı push bildirimleri aracılığıyla.

## Bildirim kanallarına genel bakış

| Kanal | En iyi kullanım | Gereksinim |
|-------|----------------|------------|
| Telegram | Hızlı, her yerden | Telegram hesabı + bot token |
| Discord | Ekip/topluluk | Discord sunucusu + webhook URL'si |
| E-posta (SMTP) | Resmi bildirimler | SMTP sunucusu |
| Tarayıcı push | Masaüstü bildirimleri | Push destekli tarayıcı |

---

## Telegram botu

### Adım 1 — Botu oluşturun

1. Telegram'ı açın ve **@BotFather**'ı arayın
2. `/newbot` gönderin
3. Bota bir isim verin (örn. "Bambu Bildirimler")
4. Bota bir kullanıcı adı verin (örn. `bambu_bildirimler_bot`) — `bot` ile bitmelidir
5. BotFather bir **API token** ile yanıtlar: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
6. Bu tokeni kopyalayın ve saklayın

### Adım 2 — Chat ID'nizi bulun

1. Botunuzla bir konuşma başlatın (kullanıcı adını arayın ve **Başlat**'a tıklayın)
2. Bota bir mesaj gönderin (örn. "merhaba")
3. Tarayıcıda `https://api.telegram.org/bot<TOKEN'INIZ>/getUpdates` adresine gidin
4. `"chat":{"id": 123456789}` ifadesini bulun — bu sizin Chat ID'nizdir

### Adım 3 — Panoya bağlayın

1. **Ayarlar → Bildirimler → Telegram**'a gidin
2. **Bot token**'ı yapıştırın
3. **Chat ID**'yi yapıştırın
4. **Bildirimi test et**'e tıklayın — Telegram'da test mesajı almanız gerekir
5. **Kaydet**'e tıklayın

:::tip Grup bildirimi
Tüm bir grubu bilgilendirmek mi istiyorsunuz? Botu bir Telegram grubuna ekleyin, grup Chat ID'sini bulun (negatif sayı, örn. `-100123456789`) ve bunun yerine onu kullanın.
:::

---

## Discord webhook

### Adım 1 — Discord'da webhook oluşturun

1. Discord sunucunuza gidin
2. Bildirimlerin gelmesini istediğiniz kanala sağ tıklayın → **Kanalı düzenle**
3. **Entegrasyonlar → Webhook'lar**'a gidin
4. **Yeni Webhook**'a tıklayın
5. Bir isim verin (örn. "3DPrintForge")
6. Bir avatar seçin (isteğe bağlı)
7. **Webhook URL'sini kopyala**'ya tıklayın

URL şöyle görünür:
```
https://discord.com/api/webhooks/123456789/abcdefghijk...
```

### Adım 2 — Panoya ekleyin

1. **Ayarlar → Bildirimler → Discord**'a gidin
2. **Webhook URL**'sini yapıştırın
3. **Bildirimi test et**'e tıklayın — Discord kanalı test mesajı almalıdır
4. **Kaydet**'e tıklayın

---

## E-posta (SMTP)

### Gerekli bilgiler

E-posta sağlayıcınızdan SMTP ayarlarına ihtiyacınız var:

| Sağlayıcı | SMTP sunucusu | Port | Şifreleme |
|-----------|--------------|------|-----------|
| Gmail | smtp.gmail.com | 587 | TLS |
| Outlook/Hotmail | smtp-mail.outlook.com | 587 | TLS |
| Yahoo | smtp.mail.yahoo.com | 587 | TLS |
| Kendi alan adı | smtp.alanadiniz.com | 587 | TLS |

:::warning Gmail uygulama parolası gerektirir
Gmail, normal parola ile girişi engeller. Google hesabı → Güvenlik → 2 adımlı doğrulama → Uygulama parolaları altında bir **Uygulama parolası** oluşturmanız gerekir.
:::

### Panoda yapılandırma

1. **Ayarlar → Bildirimler → E-posta**'ya gidin
2. Doldurun:
   - **SMTP sunucusu**: örn. `smtp.gmail.com`
   - **Port**: `587`
   - **Kullanıcı adı**: e-posta adresiniz
   - **Parola**: uygulama parolası veya normal parola
   - **Kimden adresi**: bildirimin gönderileceği e-posta
   - **Kime adresi**: bildirimleri almak istediğiniz e-posta
3. **E-postayı test et**'e tıklayın
4. **Kaydet**'e tıklayın

---

## Tarayıcı push bildirimleri

Push bildirimleri, tarayıcı sekmesi arka planda olsa bile masaüstünde sistem bildirimleri olarak görünür.

**Etkinleştirme:**
1. **Ayarlar → Bildirimler → Push bildirimleri**'ne gidin
2. **Push bildirimleri etkinleştir**'e tıklayın
3. Tarayıcı izin ister — **İzin ver**'e tıklayın
4. **Bildirimi test et**'e tıklayın

:::info Yalnızca etkinleştirdiğiniz tarayıcıda
Push bildirimleri belirli tarayıcıya ve cihaza bağlıdır. Bildirim almak istediğiniz her cihazda etkinleştirin.
:::

---

## Bildirim alınacak olayları seçme

Bir bildirim kanalı ayarladıktan sonra, hangi olayların bildirimi tetikleyeceğini tam olarak seçebilirsiniz:

**Ayarlar → Bildirimler → Olaylar altında:**

| Olay | Önerilen |
|------|----------|
| Baskı tamamlandı | Evet |
| Baskı başarısız / iptal edildi | Evet |
| Print Guard: spagetti algılandı | Evet |
| HMS hatası (kritik) | Evet |
| HMS uyarısı | İsteğe bağlı |
| Filament düşük seviye | Evet |
| AMS hatası | Evet |
| Yazıcı bağlantısı kesildi | İsteğe bağlı |
| Bakım hatırlatıcısı | İsteğe bağlı |
| Gece yedeklemesi tamamlandı | Hayır (rahatsız edici) |

---

## Sessiz saatler (geceleri bildirim gönderme)

Saat 03:00'te tamamlanan bir baskı tarafından uyandırılmaktan kaçının:

1. **Ayarlar → Bildirimler → Sessiz saatler**'e gidin
2. **Sessiz saatler**'i etkinleştirin
3. Başlangıç ve bitiş saatini ayarlayın (örn. **22:00 ile 07:00 arası**)
4. Sessiz dönemde hangi olayların hâlâ bildirim göndereceğini seçin:
   - **Kritik HMS hataları** — açık tutulması önerilir
   - **Print Guard** — açık tutulması önerilir
   - **Baskı tamamlandı** — geceleri kapatılabilir

:::tip Sessiz gece baskıları
Sessiz saatler etkinken geceleri baskı yapın. Print Guard gözetleme yapar — sabah bir özet alırsınız.
:::
