---
sidebar_position: 4
title: TPU
description: TPU baskı kılavuzu — sıcaklık, hız ve geri çekme ayarları
---

# TPU

TPU (Termoplastik Poliüretan), kılıflar, contalar, tekerlekler ve esneklik gerektiren diğer parçalar için kullanılan esnek bir malzemedir.

## Ayarlar

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 220–240 °C |
| Tabla sıcaklığı | 30–45 °C |
| Parça soğutma | %50–80 |
| Hız | %30–50 (ÖNEMLİ) |
| Geri çekme | Minimal veya devre dışı |
| Kurutma | Önerilen (60 °C'de 6–8 saat) |

:::danger Düşük Hız Kritiktir
TPU yavaş yazdırılmalıdır. Çok yüksek hız malzemenin ekstrüderde sıkışmasına ve tıkanmaya neden olur. %30 hızla başlayın ve dikkatlice artırın.
:::

## Önerilen Yapı Tabaları

| Tabla | Uygunluk | Yapıştırıcı? |
|-------|---------|----------|
| Textured PEI | Mükemmel | Hayır |
| Cool Plate (Düz PEI) | İyi | Hayır |
| Engineering Plate | İyi | Hayır |

## Geri Çekme Ayarları

TPU esnektir ve agresif geri çekmeye kötü tepki verir:

- **Direct drive (X1C/P1S/A1):** Geri çekme 0,5–1,0 mm, 25 mm/s
- **Bowden (TPU ile kaçının):** Son derece zorlu, önerilmez

Çok yumuşak TPU için (Shore A 85 veya daha düşük): geri çekmeyi tamamen devre dışı bırakın ve sıcaklık ve hız kontrolüne güvenin.

## İpuçları

- **Filamenti kurutun** — nemli TPU yazdırmak son derece zordur
- **Doğrudan ekstrüder kullanın** — Bambu Lab P1S/X1C/A1'in hepsinde direct drive bulunur
- **Yüksek sıcaklıktan kaçının** — 250 °C üzerinde TPU bozunur ve renkli baskı verir
- **Eğim** — TPU ip oluşturmaya eğilimlidir; sıcaklığı 5 °C düşürün veya soğutmayı artırın

:::tip Shore Sertliği
TPU farklı Shore sertliklerinde gelir (A85, A95, A98). Shore A ne kadar düşükse, o kadar yumuşak ve yazdırması o kadar zorludur. Bambu Lab'ın TPU'su Shore A 95'tir — iyi bir başlangıç noktası.
:::

## Depolama

TPU son derece higroskopiktir (nemi çeker). Nemli TPU şunlara yol açar:
- Kabarcıklar ve ıslık
- Zayıf ve kırılgan baskı (esnek bir malzeme için paradoksal)
- Stringing

**Her zaman** yazdırmadan önce 60 °C'de 6–8 saat kurutun. Silika jelli kapalı kutuda saklayın.
