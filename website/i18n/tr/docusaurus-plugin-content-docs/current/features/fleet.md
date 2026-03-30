---
sidebar_position: 3
title: Filo Genel Bakışı
description: Sıralama, filtreleme ve gerçek zamanlı durum ile tüm Bambu Lab yazıcılarını tek bir ızgarada yönetin ve izleyin
---

# Filo Genel Bakışı

Filo genel bakışı, tüm bağlı yazıcıları tek bir sayfada kompakt bir şekilde sunar. Atölyeler, derslikler veya birden fazla yazıcısı olan herkes için idealdir.

Gidin: **https://localhost:3443/#fleet**

## Çok Yazıcılı Izgara

Tüm kayıtlı yazıcılar duyarlı bir ızgarada görüntülenir:

- **Kart boyutu** — Küçük (kompakt), Orta (standart), Büyük (ayrıntılı)
- **Sütun sayısı** — Ekran genişliğine göre otomatik ayarlanır veya manuel olarak ayarlanır
- **Güncelleme** — Her kart MQTT üzerinden bağımsız olarak güncellenir

Her yazıcı kartı gösterir:
| Alan | Açıklama |
|---|---|
| Yazıcı adı | Model simgesiyle yapılandırılmış ad |
| Durum | Boşta / Basıyor / Duraklatıldı / Hata / Bağlantı Kesildi |
| İlerleme | Kalan süreyle yüzde çubuğu |
| Sıcaklık | Nozül ve tabla (kompakt) |
| Aktif filament | AMS'den renk ve malzeme |
| Kamera küçük resmi | Her 30 saniyede bir güncellenen sabit görüntü |

## Yazıcı Başına Durum Göstergesi

Durum renkleri, durumu uzaktan görmeyi kolaylaştırır:

- **Yeşil nabız** — Aktif basıyor
- **Mavi** — Boşta ve hazır
- **Sarı** — Duraklatıldı (manuel veya Print Guard tarafından)
- **Kırmızı** — Hata tespit edildi
- **Gri** — Bağlantı kesildi veya erişilemiyor

:::tip Kiosk modu
Filo genel bakışını duvara monte edilmiş bir ekranda kiosk modunda kullanın. Kurulum için [Kiosk Modu](../system/kiosk) sayfasına bakın.
:::

## Sıralama

Sırayı seçmek için **Sırala**'ya tıklayın:

1. **Ad** — Alfabetik A–Z
2. **Durum** — Aktif yazıcılar üstte
3. **İlerleme** — En çok tamamlanan üstte
4. **Son aktif** — En son kullanılan üstte
5. **Model** — Yazıcı modeline göre gruplandırılmış

Sıralama bir sonraki ziyarete kadar hatırlanır.

## Filtreleme

Görünümü daraltmak için üstteki filtre alanını kullanın:

- Yazıcı adı veya adın bir kısmını yazın
- Açılır listeden **Durum** seçin (Tümü / Basıyor / Boşta / Hata)
- Yalnızca bir yazıcı türü görmek için **Model** seçin (X1C, P1S, A1 vb.)
- Tümünü göstermek için **Filtreyi Sıfırla**'ya tıklayın

:::info Arama
Arama, sayfayı yenilemeye gerek kalmadan gerçek zamanlı olarak filtreler.
:::

## Filo Genel Bakışından Eylemler

Hızlı eylemler için bir karta sağ tıklayın (veya üç noktaya tıklayın):

- **Dashboard'u aç** — Yazıcının ana paneline doğrudan gidin
- **Baskıyı duraklat** — Yazıcıyı duraklatır
- **Baskıyı durdur** — Devam eden baskıyı iptal eder (onay gerektirir)
- **Kamerayı görüntüle** — Kamera görünümünü açılır pencerede açar
- **Ayarlara git** — Yazıcı ayarlarını açar

:::danger Baskıyı Durdur
Baskıyı durdurmak geri alınamaz. Görünen iletişim kutusunda her zaman onaylayın.
:::

## Toplu İstatistikler

Filo genel bakışının üst kısmında bir özet satırı görüntülenir:

- Toplam yazıcı sayısı
- Aktif baskı sayısı
- Bugünkü toplam filament tüketimi
- En uzun süren baskının tahmini tamamlanma süresi
