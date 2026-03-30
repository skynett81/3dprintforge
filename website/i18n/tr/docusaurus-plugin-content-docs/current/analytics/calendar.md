---
sidebar_position: 2
title: Etkinlik Takvimi
description: Yıl boyunca yazıcı aktivitesini yıl seçici ve ayrıntı görünümüyle gün bazında gösteren GitHub tarzı ısı haritası takvimi
---

# Etkinlik Takvimi

Etkinlik takvimi, yıl boyunca yazıcı aktivitenizin görsel bir genel bakışını sunar — GitHub'ın katkı genel bakışından ilham alınmıştır.

Gidin: **https://localhost:3443/#calendar**

## Isı Haritası Genel Bakışı

Takvim, 365 günü (52 hafta) renkli karelerden oluşan bir ızgara olarak gösterir:

- **Gri** — o gün baskı yok
- **Açık yeşil** — 1–2 baskı
- **Yeşil** — 3–5 baskı
- **Koyu yeşil** — 6–10 baskı
- **Derin yeşil** — 11+ baskı

Kareler, dikey olarak haftanın günleriyle (Pzt–Paz) ve yatay olarak soldan (Ocak) sağa (Aralık) haftalarla düzenlenir.

:::tip Renk Kodlaması
Takvimin üzerindeki seçiciyle ısı haritası metriğini **Baskı Sayısı**'ndan **Saatler** veya **Gram Filament**'e değiştirebilirsiniz.
:::

## Yıl Seçici

Yıllar arasında geçiş yapmak için **< Yıl >**'a tıklayın:

- Kayıtlı baskı aktivitesi olan tüm yıllar mevcuttur
- Mevcut yıl varsayılan olarak gösterilir
- Gelecek gri (veri yok)

## Gün Bazında Ayrıntı Görünümü

İlgili günün ayrıntılarını görmek için bir kareye tıklayın:

- **Tarih** ve haftanın günü
- **Baskı sayısı** — başarılı ve başarısız
- **Toplam kullanılan filament** (gram)
- **Toplam baskı saatleri**
- **Baskı listesi** — geçmişte açmak için tıklayın

## Aylık Genel Bakış

Isı haritasının altında aylık genel bakış gösterilir:
- Sütun diyagramı olarak aylık toplam baskılar
- Aydaki en iyi gün vurgulanmış
- Geçen yılın aynı ayıyla karşılaştırma (%)

## Yazıcı Filtresi

Yalnızca bir yazıcının aktivitesini göstermek için üstteki açılır listeden yazıcı seçin veya toplu görünüm için **Tümü**'nü seçin.

Çok yazıcılı görünüm, görünüm seçicisinde **Yığılmış**'a tıklayarak renkleri yığılmış gösterir.

## Seriler ve Rekorlar

Takvimin altında gösterilir:

| İstatistik | Açıklama |
|---|---|
| **En uzun seri** | En az bir baskıyla art arda en çok gün |
| **Mevcut seri** | Devam eden aktif günler dizisi |
| **En aktif gün** | Toplamda en çok baskı olan gün |
| **En aktif hafta** | En çok baskı olan hafta |
| **En aktif ay** | En çok baskı olan ay |

## Dışa Aktarma

Takvim verilerini indirmek için **Dışa Aktar**'a tıklayın:

- **PNG** — ısı haritasının görüntüsü (paylaşım için)
- **CSV** — gün başına bir satırla ham veriler (tarih, sayı, gram, saatler)

PNG dışa aktarma, sosyal medyada paylaşım için yazıcı adı ve yılı alt başlık olarak optimizedir.
