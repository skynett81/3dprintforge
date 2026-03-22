---
sidebar_position: 1
title: Kimlik Doğrulama
description: TOTP ile kullanıcılar, roller, izinler, API anahtarları ve iki faktörlü kimlik doğrulamayı yönetin
---

# Kimlik Doğrulama

Bambu Dashboard, rol tabanlı erişim kontrolü, API anahtarları ve TOTP aracılığıyla isteğe bağlı iki faktörlü kimlik doğrulama (2FA) ile çok kullanıcılı yapıyı destekler.

Gidin: **https://localhost:3443/#settings** → **Kullanıcılar ve Erişim**

## Kullanıcılar

### Kullanıcı Oluşturma

1. **Ayarlar → Kullanıcılar**'a gidin
2. **Yeni Kullanıcı**'ya tıklayın
3. Doldurun:
   - **Kullanıcı adı** — giriş için kullanılır
   - **E-posta adresi**
   - **Şifre** — minimum 12 karakter önerilir
   - **Rol** — aşağıdaki rollere bakın
4. **Oluştur**'a tıklayın

Yeni kullanıcı artık **https://localhost:3443/login** adresinden giriş yapabilir.

### Şifre Değiştirme

1. **Profil**'e gidin (sağ üst köşe → kullanıcı adına tıklayın)
2. **Şifre Değiştir**'e tıklayın
3. Mevcut şifre ve yeni şifre girin
4. **Kaydet**'e tıklayın

Yöneticiler başkalarının şifrelerini **Ayarlar → Kullanıcılar → [Kullanıcı] → Şifreyi Sıfırla** üzerinden sıfırlayabilir.

## Roller

| Rol | Açıklama |
|---|---|
| **Yönetici** | Tam erişim — tüm ayarlar, kullanıcılar ve özellikler |
| **Operatör** | Yazıcıları kontrol et, her şeyi gör, ancak sistem ayarlarını değiştirme |
| **Misafir** | Yalnızca okuma — panoyu, geçmişi ve istatistikleri görün |
| **API Kullanıcısı** | Yalnızca API erişimi — web arayüzü yok |

### Özel Roller

1. **Ayarlar → Roller**'e gidin
2. **Yeni Rol**'e tıklayın
3. İzinleri tek tek seçin:
   - Panoyu / geçmişi / istatistikleri görüntüle
   - Yazıcıları kontrol et (duraklat/durdur/başlat)
   - Filament deposunu yönet
   - Kuyruğu yönet
   - Kamera akışını görüntüle
   - Ayarları değiştir
   - Kullanıcıları yönet
4. **Kaydet**'e tıklayın

## API Anahtarları

API anahtarları, giriş yapmadan programlı erişim sağlar.

### API Anahtarı Oluşturma

1. **Ayarlar → API Anahtarları**'na gidin
2. **Yeni Anahtar**'a tıklayın
3. Doldurun:
   - **Ad** — açıklayıcı ad (örn. «Home Assistant», «Python Scripti»)
   - **Son kullanma tarihi** — isteğe bağlı, güvenlik için ayarlayın
   - **İzinler** — rol veya belirli izinleri seçin
4. **Oluştur**'a tıklayın
5. **Anahtarı şimdi kopyalayın** — yalnızca bir kez gösterilir

### API Anahtarını Kullanma

Tüm API çağrıları için HTTP başlığına ekleyin:
```
Authorization: Bearer API_ANAHTARINIZ
```

Test için [API Oyun Alanı](../verktoy/playground) sayfasına bakın.

:::danger Güvenli Depolama
API anahtarları bağlı oldukları kullanıcıyla aynı erişime sahiptir. Bunları güvenle saklayın ve düzenli olarak değiştirin.
:::

## TOTP 2FA

Bir kimlik doğrulayıcı uygulamasıyla iki faktörlü kimlik doğrulamayı etkinleştirin (Google Authenticator, Authy, Bitwarden vb.):

### 2FA'yı Etkinleştirme

1. **Profil → Güvenlik → İki Faktörlü Kimlik Doğrulama**'ya gidin
2. **2FA'yı Etkinleştir**'e tıklayın
3. QR kodunu kimlik doğrulayıcı uygulamasıyla tarayın
4. Onaylamak için oluşturulan 6 haneli kodu girin
5. **Kurtarma kodlarını** (10 tek kullanımlık kod) güvenli bir yerde saklayın
6. **Etkinleştir**'e tıklayın

### 2FA ile Giriş Yapma

1. Kullanıcı adı ve şifreyi normalde girin
2. Uygulamadan 6 haneli TOTP kodunu girin
3. **Giriş Yap**'a tıklayın

### Tüm Kullanıcılar için 2FA Zorunluluğu

Yöneticiler tüm kullanıcılar için 2FA gerektirebilir:

1. **Ayarlar → Güvenlik → 2FA'yı Zorla**'ya gidin
2. Ayarı etkinleştirin
3. 2FA'sı olmayan kullanıcılar bir sonraki girişte bunu ayarlamaya zorlanır

## Oturum Yönetimi

- Varsayılan oturum süresi: 24 saat
- **Ayarlar → Güvenlik → Oturum Süresi** altında ayarlayın
- Kullanıcı başına aktif oturumları görün ve bireysel oturumları sonlandırın
