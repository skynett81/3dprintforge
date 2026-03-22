---
sidebar_position: 2
title: İlk Kurulum
description: Bambu Lab yazıcınızı bağlayın ve dashboard'u yapılandırın
---

# İlk Kurulum

Dashboard ilk kez çalıştırıldığında kurulum sihirbazı otomatik olarak açılır.

## Kurulum Sihirbazı

Sihirbaz `https://din-server:3443/setup` adresinde bulunur ve şu adımları yönlendirir:

1. Yönetici kullanıcısı oluşturma
2. Yazıcı ekleme
3. Bağlantı testi
4. Bildirimleri yapılandırma (isteğe bağlı)

## Yazıcı Ekleme

Yazıcıya bağlanmak için üç şeye ihtiyacınız var:

| Alan | Açıklama | Örnek |
|------|-------------|---------|
| IP adresi | Yazıcının yerel IP'si | `192.168.1.100` |
| Seri numarası | 15 karakter, yazıcının altında bulunur | `01P09C123456789` |
| Erişim Kodu | 8 karakter, yazıcının ağ ayarlarında bulunur | `12345678` |

### Yazıcıda Erişim Kodunu Bulma

**X1C / P1S / P1P:**
1. Ekranda **Ayarlar**'a gidin
2. **WLAN** veya **LAN** seçin
3. **Erişim Kodu**'nu arayın

**A1 / A1 Mini:**
1. Ekrana dokunun ve **Ayarlar**'ı seçin
2. **WLAN**'a gidin
3. **Erişim Kodu**'nu arayın

:::tip Sabit IP adresi
Yazıcıya yönlendiricinizde sabit bir IP adresi atayın (DHCP rezervasyonu). Böylece yazıcı her yeni IP aldığında dashboard'u güncellemenize gerek kalmaz.
:::

## AMS Yapılandırması

Yazıcı bağlandıktan sonra AMS durumu otomatik olarak güncellenir. Şunları yapabilirsiniz:

- Her yuvaya ad ve renk verme
- Yuvaları filament deponuza bağlama
- Yuva başına filament tüketimini görme

Manuel yapılandırma için **Ayarlar → Yazıcı → AMS**'e gidin.

## HTTPS Sertifikaları {#https-sertifikater}

### Kendinden İmzalı Sertifika (Varsayılan)

Dashboard başlangıçta otomatik olarak kendinden imzalı bir sertifika oluşturur. Tarayıcıda güvenmek için:

- **Chrome/Edge:** "Gelişmiş" → "Siteye git" tıklayın
- **Firefox:** "Gelişmiş" → "Riski kabul et ve devam et" tıklayın

### Kendi Sertifikanız

Sertifika dosyalarını klasöre yerleştirin ve `config.json`'da yapılandırın:

```json
{
  "ssl": {
    "cert": "/yol/cert.pem",
    "key": "/yol/key.pem"
  }
}
```

:::info Let's Encrypt
Bir alan adı kullanıyor musunuz? Let's Encrypt ve Certbot ile ücretsiz sertifika oluşturun ve `cert` ile `key` dosyalarını `/etc/letsencrypt/live/alan-adiniz/` içindeki dosyalara yönlendirin.
:::

## Ortam Değişkenleri

Tüm ayarlar ortam değişkenleriyle geçersiz kılınabilir:

| Değişken | Varsayılan | Açıklama |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP portu |
| `HTTPS_PORT` | `3443` | HTTPS portu |
| `NODE_ENV` | `production` | Ortam |
| `AUTH_SECRET` | (otomatik) | JWT gizli anahtarı |

## Çok Yazıcılı Kurulum

**Ayarlar → Yazıcılar → Yazıcı Ekle** bölümünden birden fazla yazıcı ekleyebilirsiniz. Aralarında geçiş yapmak için dashboard'un üst kısmındaki yazıcı seçiciyi kullanın.
