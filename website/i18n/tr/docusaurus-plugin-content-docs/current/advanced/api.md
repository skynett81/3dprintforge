---
sidebar_position: 1
title: API Referansı
description: 284+ uç nokta, kimlik doğrulama ve hız sınırlamasıyla REST API
---

# API Referansı

3DPrintForge, 284'ten fazla uç noktayla tam özellikli bir REST API sunar. API belgeleri doğrudan panoda mevcuttur.

## İnteraktif Belgeleme

Tarayıcıda OpenAPI belgelerini açın:

```
https://sunucunuz:3443/api/docs
```

Burada tüm uç noktaları, parametreleri, istek/yanıt şemalarını ve API'yi doğrudan test etme imkânını bulursunuz.

## Kimlik Doğrulama

API, **Bearer token** kimlik doğrulaması (JWT) kullanır:

```bash
# Giriş yapın ve token alın
curl -X POST https://sunucunuz:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "şifreniz"}'

# Yanıt
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

Sonraki tüm çağrılarda tokeni kullanın:

```bash
curl https://sunucunuz:3443/api/printers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Hız Sınırlaması

API, sunucuyu korumak için hız sınırlamasına tabidir:

| Sınır | Değer |
|--------|-------|
| Dakika başına istek | 200 |
| Patlama (saniye başına maks.) | 20 |
| Aşılma yanıtı | `429 Too Many Requests` |

Yanıttaki `Retry-After` başlığı, bir sonraki isteğin izin verilmesine kadar kaç saniye kaldığını belirtir.

## Uç Nokta Özeti

### Kimlik Doğrulama
| Yöntem | Uç Nokta | Açıklama |
|--------|-----------|-------------|
| POST | `/api/auth/login` | Giriş yap, JWT al |
| POST | `/api/auth/logout` | Çıkış yap |
| GET | `/api/auth/me` | Giriş yapan kullanıcıyı al |

### Yazıcılar
| Yöntem | Uç Nokta | Açıklama |
|--------|-----------|-------------|
| GET | `/api/printers` | Tüm yazıcıları listele |
| POST | `/api/printers` | Yazıcı ekle |
| GET | `/api/printers/:id` | Yazıcı al |
| PUT | `/api/printers/:id` | Yazıcıyı güncelle |
| DELETE | `/api/printers/:id` | Yazıcıyı sil |
| GET | `/api/printers/:id/status` | Gerçek zamanlı durum |
| POST | `/api/printers/:id/command` | Komut gönder |

### Filament
| Yöntem | Uç Nokta | Açıklama |
|--------|-----------|-------------|
| GET | `/api/filaments` | Tüm makaraları listele |
| POST | `/api/filaments` | Makara ekle |
| PUT | `/api/filaments/:id` | Makarayı güncelle |
| DELETE | `/api/filaments/:id` | Makarayı sil |
| GET | `/api/filaments/stats` | Tüketim istatistikleri |

### Baskı Geçmişi
| Yöntem | Uç Nokta | Açıklama |
|--------|-----------|-------------|
| GET | `/api/history` | Geçmişi listele (sayfalı) |
| GET | `/api/history/:id` | Tek baskı al |
| GET | `/api/history/export` | CSV olarak dışa aktar |
| GET | `/api/history/stats` | İstatistikler |

### Baskı Kuyruğu
| Yöntem | Uç Nokta | Açıklama |
|--------|-----------|-------------|
| GET | `/api/queue` | Kuyruğu al |
| POST | `/api/queue` | İş ekle |
| PUT | `/api/queue/:id` | İşi güncelle |
| DELETE | `/api/queue/:id` | İşi kaldır |
| POST | `/api/queue/dispatch` | Gönderimi zorla |

## WebSocket API

REST'e ek olarak gerçek zamanlı veriler için bir WebSocket API mevcuttur:

```javascript
const ws = new WebSocket('wss://sunucunuz:3443/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
```

### Mesaj Türleri (gelen)
- `printer.status` — güncellenmiş yazıcı durumu
- `print.progress` — ilerleme yüzdesi güncellemesi
- `ams.update` — AMS durum değişikliği
- `notification` — bildirim mesajı

## Hata Kodları

| Kod | Anlamı |
|------|-------|
| 200 | Tamam |
| 201 | Oluşturuldu |
| 400 | Geçersiz istek |
| 401 | Kimlik doğrulanmamış |
| 403 | Yetki yok |
| 404 | Bulunamadı |
| 429 | Çok fazla istek |
| 500 | Sunucu hatası |
