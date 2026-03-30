---
sidebar_position: 2
title: Ana Panel
description: 3D model görüntüleme, AMS durumu, kamera ve özelleştirilebilir widget'larla aktif yazıcının gerçek zamanlı genel bakışı
---

# Ana Panel

Ana panel, Bambu Dashboard'un merkezi kontrol merkezidir. Seçilen yazıcının gerçek zamanlı durumunu gösterir ve ihtiyaca göre izlemenize, yönetmenize ve görünümü özelleştirmenize olanak tanır.

Gidin: **https://localhost:3443/**

## Gerçek Zamanlı Genel Bakış

Bir yazıcı aktif olduğunda, tüm değerler MQTT üzerinden sürekli güncellenir:

- **Nozül sıcaklığı** — hedef sıcaklıklı animasyonlu SVG halka göstergesi
- **Tabla sıcaklığı** — yapı tablası için benzer halka göstergesi
- **İlerleme yüzdesi** — kalan süreyle büyük yüzde göstergesi
- **Katman sayacı** — mevcut katman / toplam katman sayısı
- **Hız** — kaydırma çubuğuyla Sessiz / Standart / Spor / Turbo

:::tip Gerçek zamanlı güncelleme
Tüm değerler, sayfayı yenilemeye gerek kalmadan MQTT üzerinden doğrudan yazıcıdan güncellenir. Gecikme genellikle 1 saniyenin altındadır.
:::

## 3D Model Görüntüleme

Yazıcı modeli içeren bir `.3mf` dosyası gönderirse, etkileşimli bir 3D önizleme görüntülenir:

1. Baskı başladığında model otomatik olarak yüklenir
2. Fareyle sürükleyerek modeli döndürün
3. Yakınlaştırmak/uzaklaştırmak için kaydırın
4. Varsayılan görünüme dönmek için **Sıfırla**'ya tıklayın

:::info Destek
3D görüntüleme, yazıcının model verisi göndermesini gerektirir. Tüm baskı işleri bunu içermez.
:::

## AMS Durumu

AMS paneli, tüm takılı AMS birimlerini yuvalar ve filamentlerle gösterir:

- **Yuva rengi** — Bambu meta verilerinden görsel renk temsili
- **Filament adı** — malzeme ve marka
- **Aktif yuva** — baskı sırasında nabız animasyonuyla işaretlendi
- **Hatalar** — AMS hatalarında kırmızı gösterge (tıkanma, boş, nemli)

Tam filament bilgisini görmek ve filament deposuna bağlamak için bir yuvaya tıklayın.

## Kamera Akışı

Canlı kamera görüntüsü ffmpeg aracılığıyla dönüştürülür (RTSPS → MPEG1):

1. Dashboard açıldığında kamera otomatik olarak başlar
2. Tam ekran açmak için kamera görüntüsüne tıklayın
3. Fotoğraf çekmek için **Anlık Görüntü** düğmesini kullanın
4. Alan açmak için **Kamerayı Gizle**'ye tıklayın

:::warning Performans
Kamera akışı yaklaşık 2–5 Mbit/s kullanır. Yavaş ağ bağlantılarında kamerayı devre dışı bırakın.
:::

## Sıcaklık Sparkline'ları

AMS panelinin altında son 30 dakikaya ait mini grafikler (sparkline'lar) gösterilir:

- Zaman içindeki nozül sıcaklığı
- Zaman içindeki tabla sıcaklığı
- Kamera sıcaklığı (mevcut olduğunda)

Tam telemetri grafik görünümünü açmak için bir sparkline'a tıklayın.

## Widget Özelleştirme

Dashboard, sürükle-bırak ızgara düzeni kullanır:

1. **Düzeni Özelleştir**'e tıklayın (sağ üstteki kalem simgesi)
2. Widget'ları istenen konuma sürükleyin
3. Köşeyi sürükleyerek boyutu değiştirin
4. Konumu dondurmak için **Düzeni Kilitle**'ye tıklayın
5. Düzeni korumak için **Kaydet**'e tıklayın

Mevcut widget'lar:
| Widget | Açıklama |
|---|---|
| Kamera | Canlı kamera görüntüsü |
| AMS | Makara ve filament durumu |
| Sıcaklık | Nozül ve tabla için halka göstergeleri |
| İlerleme | Yüzde göstergesi ve süre tahmini |
| Telemetri | Fanlar, basınç, hız |
| 3D Model | Etkileşimli model görüntüleme |
| Sparkline'lar | Mini sıcaklık grafikleri |

:::tip Kaydetme
Düzen, tarayıcıda kullanıcı başına (localStorage) kaydedilir. Farklı kullanıcıların farklı düzenleri olabilir.
:::
