---
sidebar_position: 8
title: Sunucu Günlüğü
description: Sunucu günlüğünü gerçek zamanlı görüntüleyin, seviye ve modüle göre filtreleyin ve Bambu Dashboard sorunlarını giderin
---

# Sunucu Günlüğü

Sunucu günlüğü, Bambu Dashboard'un içinde neler olduğuna ilişkin içgörü sağlar — sorun giderme, izleme ve tanılama için kullanışlıdır.

Gidin: **https://localhost:3443/#logs**

## Gerçek Zamanlı Görünüm

Günlük akışı WebSocket aracılığıyla gerçek zamanlı güncellenir:

1. **Sistem → Sunucu Günlüğü**'ne gidin
2. Yeni günlük satırları otomatik olarak en altta görünür
3. Her zaman son günlüğe kaydırmak için **Aşağıyı Kilitle**'ye tıklayın
4. Otomatik kaydırmayı durdurmak ve mevcut satırları okumak için **Dondur**'a tıklayın

Varsayılan görünüm son 500 günlük satırını gösterir.

## Günlük Seviyeleri

Her günlük satırının bir seviyesi vardır:

| Seviye | Renk | Açıklama |
|---|---|---|
| **ERROR** | Kırmızı | İşlevselliği etkileyen hatalar |
| **WARN** | Turuncu | Uyarılar — bir şeyler ters gidebilir |
| **INFO** | Mavi | Normal işletim bilgisi |
| **DEBUG** | Gri | Ayrıntılı geliştirici bilgisi |

:::info Günlük Seviyesi Yapılandırması
**Ayarlar → Sistem → Günlük Seviyesi** altında günlük seviyesini değiştirin. Normal işletim için **INFO** kullanın. Çok daha fazla veri oluşturduğundan **DEBUG**'ı yalnızca sorun giderme sırasında kullanın.
:::

## Filtreleme

Günlük görünümünün en üstündeki filtre araç çubuğunu kullanın:

1. **Günlük seviyesi** — yalnızca ERROR / WARN / INFO / DEBUG veya kombinasyon göster
2. **Modül** — sistem modülüne göre filtrele:
   - `mqtt` — yazıcılarla MQTT iletişimi
   - `api` — API istekleri
   - `db` — veritabanı işlemleri
   - `auth` — kimlik doğrulama olayları
   - `queue` — baskı kuyruğu olayları
   - `guard` — Print Guard olayları
   - `backup` — yedekleme işlemleri
3. **Serbest metin** — günlük metninde ara (regex destekler)
4. **Zaman** — tarih aralığına göre filtrele

Hassas sorun giderme için filtreleri birleştirin.

## Yaygın Hata Durumları

### MQTT Bağlantı Sorunları

`mqtt` modülünden günlük satırlarını arayın:

```
ERROR [mqtt] XXXX yazıcısına bağlantı başarısız: Connection refused
```

**Çözüm:** Yazıcının açık olduğunu, erişim anahtarının doğru olduğunu ve ağın çalıştığını kontrol edin.

### Veritabanı Hataları

```
ERROR [db] v95 taşıması başarısız: SQLITE_CONSTRAINT
```

**Çözüm:** Yedek alın ve **Ayarlar → Sistem → Veritabanını Onar** aracılığıyla veritabanı onarımı çalıştırın.

### Kimlik Doğrulama Hataları

```
WARN [auth] 192.168.1.x IP'sinden admin kullanıcısı için başarısız giriş
```

Çok sayıda başarısız giriş girişimi bir kaba kuvvet saldırısına işaret edebilir. IP beyaz listesinin etkinleştirilmesi gerekip gerekmediğini kontrol edin.

## Günlükleri Dışa Aktarma

1. **Günlüğü Dışa Aktar**'a tıklayın
2. Zaman aralığını seçin (varsayılan: son 24 saat)
3. Format seçin: **TXT** (insan tarafından okunabilir) veya **JSON** (makine tarafından okunabilir)
4. Dosya indirilir

Dışa aktarılan günlükler hata bildirirken veya destekle iletişime geçerken kullanışlıdır.

## Günlük Döndürme

Günlükler otomatik olarak döndürülür:

| Ayar | Varsayılan |
|---|---|
| Maks. günlük dosyası boyutu | 50 MB |
| Tutulacak döndürülmüş dosya sayısı | 5 |
| Toplam maks. günlük boyutu | 250 MB |

**Ayarlar → Sistem → Günlük Döndürme** altında ayarlayın. Eski günlük dosyaları otomatik olarak gzip ile sıkıştırılır.

## Günlük Dosyası Konumu

Günlük dosyaları sunucuda saklanır:

```
./data/logs/
├── bambu-dashboard.log          (aktif günlük)
├── bambu-dashboard.log.1.gz     (döndürülmüş)
├── bambu-dashboard.log.2.gz     (döndürülmüş)
└── ...
```

:::tip SSH Erişimi
Sunucudaki günlükleri doğrudan SSH aracılığıyla okumak için:
```bash
tail -f ./data/logs/bambu-dashboard.log
```
:::
