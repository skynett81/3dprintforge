---
sidebar_position: 4
title: Tema
description: Bambu Dashboard'un görünümünü açık/koyu/otomatik mod, 6 renk paleti ve özel vurgu rengiyle özelleştirin
---

# Tema

Bambu Dashboard, görünümü zevkinize ve kullanım durumunuza göre özelleştirmenize olanak tanıyan esnek bir tema sistemine sahiptir.

Gidin: **https://localhost:3443/#settings** → **Tema**

## Renk Modu

Üç mod arasından seçin:

| Mod | Açıklama |
|---|---|
| **Açık** | Açık arka plan, koyu metin — iyi aydınlatılmış odalarda iyidir |
| **Koyu** | Koyu arka plan, açık metin — izleme için standart ve önerilen |
| **Otomatik** | İşletim sistemi ayarını izler (OS koyu/açık) |

Modu tema ayarlarının en üstünde veya gezinme çubuğundaki kısayol tuşuyla (ay/güneş simgesi) değiştirin.

## Renk Paletleri

Altı ön ayarlı renk paleti mevcuttur:

| Palet | Birincil Renk | Stil |
|---|---|---|
| **Bambu** | Yeşil (#00C853) | Varsayılan, Bambu Lab'den ilham alınmış |
| **Mavi gece** | Mavi (#2196F3) | Sakin ve profesyonel |
| **Günbatımı** | Turuncu (#FF6D00) | Sıcak ve enerjik |
| **Mor** | Mor (#9C27B0) | Yaratıcı ve belirgin |
| **Kırmızı** | Kırmızı (#F44336) | Yüksek kontrast, dikkat çekici |
| **Monokrom** | Gri (#607D8B) | Nötr ve minimalist |

Hemen önizlemek ve etkinleştirmek için bir palete tıklayın.

## Özel Vurgu Rengi

Kendi renginizi vurgu rengi olarak kullanın:

1. Palet seçicinin altındaki **Özel Renk**'e tıklayın
2. Renk seçiciyi kullanın veya onaltılık kod girin (örn. `#FF5722`)
3. Önizleme gerçek zamanlı olarak güncellenir
4. Etkinleştirmek için **Uygula**'ya tıklayın

:::tip Kontrast
Vurgu renginin arka planla iyi kontrasta sahip olduğundan emin olun. Renk okunabilirlik sorunlarına yol açabiliyorsa sistem uyarı verir (WCAG AA standardı).
:::

## Yuvarlama

Düğmeler, kartlar ve öğeler üzerindeki yuvarlamayı ayarlayın:

| Ayar | Açıklama |
|---|---|
| **Keskin** | Yuvarlama yok (dikdörtgen stil) |
| **Küçük** | İnce yuvarlama (4 px) |
| **Orta** | Standart yuvarlama (8 px) |
| **Büyük** | Belirgin yuvarlama (16 px) |
| **Hap** | Maksimum yuvarlama (50 px) |

0–50 px arasında manuel olarak ayarlamak için kaydırıcıyı kaydırın.

## Yoğunluk

Arayüz yoğunluğunu özelleştirin:

| Ayar | Açıklama |
|---|---|
| **Ferah** | Öğeler arasında daha fazla alan |
| **Standart** | Dengeli, standart ayar |
| **Kompakt** | Daha sıkı paketleme — ekranda daha fazla bilgi |

Kompakt mod, 1080p'nin altındaki ekranlar veya kiosk görünümü için önerilir.

## Tipografi

Yazı tipi seçin:

- **Sistem** — işletim sisteminin varsayılan yazı tipini kullanır (yüklemesi hızlı)
- **Inter** — açık ve modern (varsayılan seçim)
- **JetBrains Mono** — monospace, veri değerleri için iyi
- **Nunito** — daha yumuşak ve daha yuvarlak stil

## Animasyonlar

Animasyonları kapatın veya özelleştirin:

- **Tam** — tüm geçişler ve animasyonlar aktif (varsayılan)
- **Azaltılmış** — yalnızca gerekli animasyonlar (OS tercihini dikkate alır)
- **Kapalı** — maksimum performans için animasyon yok

:::tip Kiosk Modu
Kiosk görünümü için uzaktan optimal performans ve okunabilirlik için **Kompakt** + **Koyu** + **Azaltılmış animasyonlar**'ı etkinleştirin. [Kiosk Modu](./kiosk) sayfasına bakın.
:::

## Tema Ayarlarını Dışa ve İçe Aktarma

Temanızı başkalarıyla paylaşın:

1. **Temayı Dışa Aktar**'a tıklayın — bir `.json` dosyası indirir
2. Dosyayı diğer Bambu Dashboard kullanıcılarıyla paylaşın
3. Onlar **Temayı İçe Aktar** → dosyayı seç ile içe aktarır
