---
sidebar_position: 4
title: API Oyun Alanı
description: Yerleşik OpenAPI belgeleri ve kimlik doğrulamasıyla tarayıcıda doğrudan tüm 177 API uç noktasını test edin
---

# API Oyun Alanı

API oyun alanı, Bambu Dashboard'daki tüm 177 API uç noktasını doğrudan tarayıcıda — kod yazmadan — keşfetmenizi ve test etmenizi sağlar.

Gidin: **https://localhost:3443/api/docs**

## API Oyun Alanı Nedir?

Oyun alanı, panoyla tamamen entegre edilmiş OpenAPI belgelerinin (Swagger UI) interaktif bir sürümüdür. Giriş yaptığınızda zaten kimliğiniz doğrulanmıştır, bu nedenle uç noktaları doğrudan test edebilirsiniz.

## Dokümantasyonda Gezinme

Uç noktalar kategorilere göre düzenlenmiştir:

| Kategori | Uç Nokta Sayısı | Açıklama |
|---|---|---|
| Yazıcılar | 24 | Durumu al, kontrol et, yapılandır |
| Baskılar / Geçmiş | 18 | Geçmişi al, ara, dışa aktar |
| Filament | 22 | Depo, makaralar, profiller |
| Kuyruk | 12 | Baskı kuyruğunu yönet |
| İstatistikler | 15 | Toplanmış istatistikler ve dışa aktarma |
| Bildirimler | 8 | Bildirim kanallarını yapılandır ve test et |
| Kullanıcılar | 10 | Kullanıcılar, roller, API anahtarları |
| Ayarlar | 14 | Yapılandırmayı oku ve değiştir |
| Bakım | 12 | Bakım görevleri ve günlük |
| Entegrasyonlar | 18 | HA, Tibber, webhook'lar vb. |
| Dosya Kütüphanesi | 14 | Yükle, analiz et, yönet |
| Sistem | 10 | Yedekleme, sağlık, günlük |

Tüm uç noktaları görmek için genişletmek üzere bir kategoriye tıklayın.

## Bir Uç Noktayı Test Etme

1. Bir uç noktaya tıklayın (örn. `GET /api/printers`)
2. **Try it out** (deneyin) üzerine tıklayın
3. İsteğe bağlı parametreleri doldurun (filtre, sayfalama, yazıcı kimliği vb.)
4. **Execute**'a tıklayın
5. Altındaki yanıtı görün: HTTP durum kodu, başlıklar ve JSON gövdesi

### Örnek: Tüm Yazıcıları Al

```
GET /api/printers
```
Gerçek zamanlı durumuyla tüm kayıtlı yazıcıların listesini döndürür.

### Örnek: Yazıcıya Komut Gönder

```
POST /api/printers/{id}/command
Body: {"command": "pause"}
```

:::warning Üretim Ortamı
API oyun alanı gerçek sisteme bağlıdır. Komutlar gerçek yazıcılara gönderilir. `DELETE` ve `POST /command` gibi yıkıcı işlemlerde dikkatli olun.
:::

## Kimlik Doğrulama

### Oturum Kimlik Doğrulaması (giriş yapmış kullanıcı)
Panoda giriş yapmışken oyun alanı, oturum çerezi aracılığıyla zaten kimliği doğrulanmıştır. Ekstra yapılandırma gerekmez.

### API Anahtarı Kimlik Doğrulaması

Harici erişim için:

1. Oyun alanının en üstündeki **Authorize**'a (kilit simgesi) tıklayın
2. **ApiKeyAuth** alanına API anahtarınızı girin: `Bearer ANAHTARINIZ`
3. **Authorize**'a tıklayın

API anahtarlarını **Ayarlar → API Anahtarları** altında oluşturun ([Kimlik Doğrulama](../system/auth) sayfasına bakın).

## Hız Sınırlaması

API'nin kullanıcı/anahtar başına **dakikada 200 istek** hız sınırlaması vardır. Oyun alanı, yanıt başlığı `X-RateLimit-Remaining` içinde kalan istek sayısını gösterir.

:::info OpenAPI Belirtimi
Tüm OpenAPI belirtimini YAML veya JSON olarak indirin:
- `https://localhost:3443/api/docs/openapi.yaml`
- `https://localhost:3443/api/docs/openapi.json`

Python, TypeScript, Go vb. dillerinde istemci kütüphaneleri oluşturmak için belirtimi kullanın.
:::

## Webhook Testi

Webhook entegrasyonlarını doğrudan test edin:

1. `POST /api/webhooks/test`'e gidin
2. Açılır listeden olay türünü seçin
3. Sistem, yapılandırılmış webhook URL'sine bir test olayı gönderir
4. Oyun alanında istek/yanıtı görün
