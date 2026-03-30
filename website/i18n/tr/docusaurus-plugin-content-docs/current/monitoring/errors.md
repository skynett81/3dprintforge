---
sidebar_position: 2
title: Hata Kaydı
description: Yazıcılardan gelen tüm HMS hata kodlarının önem derecesi, arama ve Bambu Wiki bağlantılarıyla eksiksiz genel bakışı
---

# Hata Kaydı

Hata kaydı, yazıcılarınızdan gelen tüm hataları ve HMS uyarılarını (Sağlık, Bakım, Güvenlik) toplar. Bambu Dashboard, Bambu Lab yazıcıları için 269+ HMS koduyla yerleşik bir veritabanına sahiptir.

Gidin: **https://localhost:3443/#errors**

## HMS Kodları

Bambu Lab yazıcıları, bir sorun olduğunda MQTT üzerinden HMS kodları gönderir. Bambu Dashboard bunları otomatik olarak okunabilir hata mesajlarına çevirir:

| Kod | Örnek | Kategori |
|---|---|---|
| `0700 0100 0001 0001` | Nozzle heatbreak clogged | Nozül/Ekstrüder |
| `0700 0200 0002 0001` | AMS filament stuck | AMS |
| `0700 0300 0003 0001` | Bed leveling failed | Yapı Tablası |
| `0700 0500 0001 0001` | MC disconnect | Elektronik |

Eksiksiz liste, X1C, X1C Combo, X1E, P1S, P1S Combo, P1P, P2S, P2S Combo, A1, A1 Combo, A1 mini, H2S, H2D ve H2C için bilinen 269+ kodun tamamını kapsar.

## Önem Derecesi

Hatalar dört düzeyde sınıflandırılır:

| Düzey | Renk | Açıklama |
|---|---|---|
| **Kritik** | Kırmızı | Anında müdahale gerektirir — baskı durduruldu |
| **Yüksek** | Turuncu | Hızla ele alınmalı — baskı devam edebilir |
| **Orta** | Sarı | İncelenmalı — anlık tehlike yok |
| **Bilgi** | Mavi | Bilgi mesajı, işlem gerekmiyor |

## Arama ve Filtreleme

Hata kaydının üst kısmındaki araç çubuğunu kullanın:

1. **Serbest metin arama** — hata mesajı, HMS kodu veya yazıcı açıklamasında ara
2. **Yazıcı** — yalnızca bir yazıcıdan gelen hataları göster
3. **Kategori** — AMS / Nozül / Tabla / Elektronik / Kalibrasyon / Diğer
4. **Önem Derecesi** — Tümü / Kritik / Yüksek / Orta / Bilgi
5. **Tarih** — tarih aralığına göre filtrele
6. **Onaysız** — yalnızca onaylanmamış hataları göster

Tüm hataları görmek için **Filtreyi Sıfırla**'ya tıklayın.

## Wiki Bağlantıları

Her HMS kodu için şunlarla Bambu Lab Wiki'ye bir bağlantı gösterilir:

- Tam hata açıklaması
- Olası nedenler
- Adım adım sorun giderme kılavuzu
- Resmi Bambu Lab önerileri

İlgili wiki sayfasını yeni sekmede açmak için hata kaydında **Wiki'yi Aç**'a tıklayın.

:::tip Yerel Kopya
Bambu Dashboard, wiki içeriğini çevrimdışı kullanım için yerel olarak önbelleğe alır. İçerik haftalık olarak otomatik güncellenir.
:::

## Hataları Onaylama

Onaylama, silmeden bir hatayı işlenmiş olarak işaretler:

1. Listedeki bir hataya tıklayın
2. **Onayla**'ya tıklayın (onay işareti simgesi)
3. Yapılanlar hakkında isteğe bağlı bir not girin
4. Hata onay işaretiyle işaretlenir ve "Onaylananlar" listesine taşınır

### Toplu Onaylama

1. Onay kutularıyla birden fazla hata seçin
2. **Seçilenleri Onayla**'ya tıklayın
3. Seçilen tüm hatalar aynı anda onaylanır

## İstatistikler

Hata kaydının üst kısmında gösterilir:

- Son 30 günde toplam hata sayısı
- Onaylanmamış hata sayısı
- En sık görülen HMS kodu
- En çok hata olan yazıcı

## Dışa Aktarma

1. **Dışa Aktar**'a tıklayın (indirme simgesi)
2. Format seçin: **CSV** veya **JSON**
3. Filtre dışa aktarma için geçerlidir — önce istediğiniz filtreyi ayarlayın
4. Dosya otomatik olarak indirilir

## Yeni Hatalar için Bildirimler

Yeni HMS hataları için bildirimleri etkinleştirin:

1. **Ayarlar → Bildirimler**'e gidin
2. **Yeni HMS Hataları**'nı işaretleyin
3. Bildirim için minimum önem derecesi seçin (önerilen: **Yüksek** ve üzeri)
4. Bildirim kanalını seçin

Kanal kurulumu için [Bildirimler](../features/notifications) sayfasına bakın.
