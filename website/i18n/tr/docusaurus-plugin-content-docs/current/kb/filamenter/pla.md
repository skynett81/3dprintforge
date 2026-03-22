---
sidebar_position: 1
title: PLA
description: Bambu Lab ile PLA baskı kılavuzu — sıcaklık, tablalar, ipuçları ve varyantlar
---

# PLA

PLA (Polilaktik Asit), en yeni başlayan dostu filamenttir. Kolayca yazdırılır, güzel yüzeyler verir ve kapalı kasa veya özel ısıtma işlemi gerektirmez.

## Ayarlar

| Parametre | Standart PLA | PLA+ | PLA İpekli |
|-----------|-------------|------|---------|
| Nozül sıcaklığı | 220 °C | 230 °C | 230 °C |
| Tabla sıcaklığı | 35–45 °C | 45–55 °C | 45–55 °C |
| Kasa sıcaklığı | — | — | — |
| Parça soğutma | %100 | %100 | %80 |
| Hız | Standart | Standart | %80 |
| Kurutma gerekli | Hayır | Hayır | Hayır |

## Önerilen Yapı Tabaları

| Tabla | Uygunluk | Yapıştırıcı? |
|-------|---------|----------|
| Cool Plate (Düz PEI) | Mükemmel | Hayır |
| Textured PEI | İyi | Hayır |
| Engineering Plate | İyi | Hayır |
| High Temp Plate | Kaçının | — |

## Başarılı Baskı İpuçları

- **Yapıştırıcı gerekmez** — PLA çoğu tablaya yapıştırıcı olmadan iyi yapışır
- **Tablanın soğumasını bekleyin** — PLA tabla oda sıcaklığına soğuduğunda daha kolay ayrılır
- **İlk katman hızı** — daha iyi yapışma için %50–70'e ayarlayın
- **Parça soğutma** — daha keskin ayrıntılar ve daha iyi köprüler için %100'de tutun

:::tip Z Offset
İlk katman için Z offset'i dikkatlice kalibre edin. Cool Plate'de PLA için: ilk katman hafif şeffaf ve iyi yapışmış görünene kadar canlı ayar yapın, sıkıştırılmış değil.
:::

## Varyantlar

### PLA+
Standart PLA'dan daha güçlü ve daha ısıya dayanıklı. Biraz daha sıcak çalışır (225–235 °C). Biraz daha esnek ve son işlem yapmak daha kolay.

### PLA İpekli
Parlak, metalik yüzeyler verir. En iyi sonuç için daha düşük soğutma ve biraz daha düşük hız gerektirir. Köprüler daha zorludur.

### PLA-CF (Karbon Fiber)
Karbon fiber takviyeli PLA artan sertlik sağlar ve hafiftir. **Sertleştirilmiş çelik nozül** gerektirir — CF malzemeleriyle asla standart pirinç nozül kullanmayın.

### PLA Mat
Parlaklık olmadan mat yüzey. Standart PLA ile aynı ayarlarda yazdırılır.

## Depolama

PLA, PETG ve PA kadar hızlı nem çekmez, ancak yine de kuru tutulmalıdır:

- **Önerilen:** Silika jelli kapalı poşet
- **Nemli filament belirtileri:** Patlama sesleri, köpüren yüzey, zayıf baskı

Gerekirse **45–55 °C'de 4–6 saat** kurutun.
