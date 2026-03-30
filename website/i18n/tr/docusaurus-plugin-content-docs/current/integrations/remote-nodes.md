---
sidebar_position: 4
title: Uzak Sunucu
description: Tüm yazıcıları tek bir merkezi panodan görüntülemek için birden fazla Bambu Dashboard örneğini birbirine bağlayın
---

# Uzak Sunucu (Remote Nodes)

Uzak sunucu özelliği, birden fazla Bambu Dashboard örneğini birbirine bağlamanıza olanak tanır; böylece tüm yazıcıları tek bir merkezi arayüzden görüntüleyebilir ve kontrol edebilirsiniz — aynı ağda veya farklı konumlarda olsun.

Gidin: **https://localhost:3443/#settings** → **Entegrasyonlar → Uzak Sunucular**

## Kullanım Senaryoları

- **Ev + ofis** — Her iki konumdaki yazıcıları aynı panodan görün
- **Makerspace** — Odadaki tüm örnekler için merkezi pano
- **Misafir örnekleri** — Tam erişim olmaksızın müşterilere sınırlı görüntüleme erişimi verin

## Mimari

```
Birincil örnek (PC'niz)
  ├── Yazıcı A (yerel MQTT)
  ├── Yazıcı B (yerel MQTT)
  └── Uzak sunucu: İkincil örnek
        ├── Yazıcı C (uzak konumda MQTT)
        └── Yazıcı D (uzak konumda MQTT)
```

Birincil örnek, uzak sunucuları REST API aracılığıyla sorgular ve verileri yerel olarak toplar.

## Uzak Sunucu Ekleme

### Adım 1: Uzak Örnekte API Anahtarı Oluşturun

1. Uzak örneğe giriş yapın (örn. `https://192.168.2.50:3443`)
2. **Ayarlar → API Anahtarları**'na gidin
3. **Yeni Anahtar**'a tıklayın → «Birincil düğüm» adını verin
4. İzinleri ayarlayın: **Okuma** (minimum) veya **Okuma + Yazma** (uzaktan kontrol için)
5. Anahtarı kopyalayın

### Adım 2: Birincil Örnekten Bağlanın

1. **Ayarlar → Uzak Sunucular**'a gidin
2. **Uzak Sunucu Ekle**'ye tıklayın
3. Doldurun:
   - **Ad**: örn. «Ofis» veya «Garaj»
   - **URL**: `https://192.168.2.50:3443` veya harici URL
   - **API anahtarı**: 1. adımdaki anahtar
4. **Bağlantıyı Test Et**'e tıklayın
5. **Kaydet**'e tıklayın

:::warning Kendinden İmzalı Sertifika
Uzak örnek kendinden imzalı bir sertifika kullanıyorsa, **TLS Hatalarını Yoksay**'ı etkinleştirin — ancak bunu yalnızca dahili ağ bağlantıları için yapın.
:::

## Toplu Görünüm

Bağlantıdan sonra uzak yazıcılar şuralarda görünür:

- **Filo genel bakışı** — uzak sunucunun adı ve bir bulut simgesiyle işaretlenmiş
- **İstatistikler** — tüm örnekler genelinde toplanmış
- **Filament deposu** — birleşik genel bakış

## Uzaktan Kontrol

**Okuma + Yazma** izniyle uzak yazıcıları doğrudan kontrol edebilirsiniz:

- Duraklat / Devam et / Durdur
- Baskı kuyruğuna ekle (iş uzak örneğe gönderilir)
- Kamera akışını görüntüle (uzak örnek üzerinden proxy)

:::info Gecikme
Uzak sunucu üzerinden kamera akışı, ağ hızına ve mesafeye bağlı olarak belirgin gecikmeye sahip olabilir.
:::

## Erişim Kontrolü

Uzak sunucunun hangi verileri paylaşacağını sınırlayın:

1. Uzak örnekte: **Ayarlar → API Anahtarları → [Anahtar Adı]**'na gidin
2. Erişimi sınırlayın:
   - Yalnızca belirli yazıcılar
   - Kamera akışı yok
   - Salt okunur (yalnızca okuma)

## Sağlık ve İzleme

Her uzak sunucunun durumu **Ayarlar → Uzak Sunucular**'da gösterilir:

- **Bağlı** — son sorgulama başarılı
- **Bağlantı kesildi** — uzak sunucuya ulaşılamıyor
- **Kimlik doğrulama hatası** — API anahtarı geçersiz veya süresi dolmuş
- **Son senkronizasyon** — son başarılı veri senkronizasyonunun zaman damgası
