---
sidebar_position: 6
title: Baskı Karşılaştırma
description: Ayrıntılı metrikler, grafikler ve galeri resimleriyle iki baskıyı yan yana karşılaştırın — A/B analizi için
---

# Baskı Karşılaştırma

Baskı karşılaştırma, iki baskıyı yan yana analiz etmenizi sağlar — ayarları, malzemeleri, yazıcıları veya aynı modelin farklı sürümlerini karşılaştırmak için kullanışlıdır.

Gidin: **https://localhost:3443/#comparison**

## Karşılaştırılacak Baskıları Seçme

1. **Baskı Karşılaştırma**'ya gidin
2. **Baskı A'yı Seç**'e tıklayın ve geçmişte arama yapın
3. **Baskı B'yi Seç**'e tıklayın ve geçmişte arama yapın
4. Karşılaştırma görünümünü yüklemek için **Karşılaştır**'a tıklayın

:::tip Daha Hızlı Erişim
**Geçmiş**'ten bir baskıya sağ tıklayıp **Baskı A Olarak Ayarla** veya **Şununla Karşılaştır...** seçeneğini belirleyerek doğrudan karşılaştırma moduna geçebilirsiniz.
:::

## Metrik Karşılaştırma

Metrikler iki sütunda (A ve B) gösterilir ve hangisinin daha iyi olduğu vurgulanır:

| Metrik | Açıklama |
|---|---|
| Başarı | Tamamlandı / İptal edildi / Başarısız |
| Süre | Toplam baskı süresi |
| Filament tüketimi | Toplam gram ve renk başına |
| Filament verimliliği | Toplam tüketimde model yüzdesi |
| Maks. nozül sıcaklığı | Kaydedilen en yüksek nozül sıcaklığı |
| Maks. tabla sıcaklığı | Kaydedilen en yüksek tabla sıcaklığı |
| Hız ayarı | Sessiz / Standart / Spor / Turbo |
| AMS değişimleri | Renk değişimi sayısı |
| HMS hataları | Baskı sırasındaki olası hatalar |
| Yazıcı | Hangi yazıcının kullanıldığı |

En iyi değere sahip hücreler yeşil arka planla gösterilir.

## Sıcaklık Grafikleri

İki sıcaklık grafiği yan yana (veya üst üste) gösterilir:

- **Ayrı görünüm** — grafik A solda, grafik B sağda
- **Üst üste görünüm** — her ikisi aynı grafikte farklı renklerle

Sıcaklık kararlılığını ve ısınma hızını doğrudan görmek için üst üste görünümü kullanın.

## Galeri Resimleri

Her iki baskının kilometre taşı ekran görüntüleri varsa bir ızgarada gösterilir:

| Baskı A | Baskı B |
|---|---|
| %25 resim A | %25 resim B |
| %50 resim A | %50 resim B |
| %75 resim A | %75 resim B |
| %100 resim A | %100 resim B |

Tam ekran önizlemesini slayt animasyonuyla açmak için bir resme tıklayın.

## Timelapse Karşılaştırma

Her iki baskının timelapse'i varsa videolar yan yana gösterilir:

- Senkronize oynatma — her ikisi aynı anda başlar ve duraklar
- Bağımsız oynatma — her videoyu ayrı ayrı kontrol edin

## Ayar Farklılıkları

Sistem, baskı ayarlarındaki farklılıkları otomatik olarak vurgular (G-kodu meta verilerinden alınır):

- Farklı katman kalınlıkları
- Farklı dolgu desenleri veya yüzdeleri
- Farklı destek ayarları
- Farklı hız profilleri

Farklılıklar, ayarlar tablosunda turuncu vurgulamayla gösterilir.

## Karşılaştırmayı Kaydetme

1. **Karşılaştırmayı Kaydet**'e tıklayın
2. Karşılaştırmaya bir ad verin (örn. «PLA vs PETG - Benchy»)
3. Karşılaştırma kaydedilir ve **Geçmiş → Karşılaştırmalar** aracılığıyla erişilebilir

## Dışa Aktarma

1. **Dışa Aktar**'a tıklayın
2. Tüm metrikler ve resimlerle bir rapor için **PDF** seçin
3. Rapor, malzeme seçiminin belgelenmesi için bir projeye bağlanabilir
