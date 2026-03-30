---
sidebar_position: 3
title: Stringing
description: Stringing nedenleri ve çözümleri — geri çekme, sıcaklık ve kurutma
---

# Stringing

Stringing (veya "oozing"), nozülün ekstrüzyon yapmadan hareket ederken nesnenin ayrı bölümleri arasında oluşan ince plastik iplikleridir. Baskıda "örümcek ağı" görünümü verir.

## Stringing Nedenleri

1. **Nozül sıcaklığı çok yüksek** — sıcak plastik akışkan hale gelir ve damlalar
2. **Kötü geri çekme ayarları** — filament yeterince hızlı geri çekilmiyor
3. **Nemli filament** — nem buhar ve ekstra akışa neden olur
4. **Hız çok düşük** — nozül transit konumlarda uzun süre bekliyor

## Tanı

**Nemli filament mi?** Baskı sırasında çıtırtılı/patlama sesi duyuyor musunuz? Filament nemli demektir — diğer ayarları değiştirmeden önce filamenti kurutun.

**Sıcaklık çok yüksek mi?** "Duraklama" anlarında nozülden damlama görüyor musunuz? Sıcaklığı 5–10 °C düşürün.

## Çözümler

### 1. Filamenti Kurutun

Nemli filament, ayarlarla giderilemeyen stringing'in en yaygın nedenidir:

| Malzeme | Kurutma Sıcaklığı | Süre |
|---------|------------------|------|
| PLA | 45–55 °C | 4–6 saat |
| PETG | 60–65 °C | 6–8 saat |
| TPU | 55–60 °C | 6–8 saat |
| PA | 75–85 °C | 8–12 saat |

### 2. Nozül Sıcaklığını Düşürün

Birer 5 °C düşürerek başlayın:
- PLA: 210–215 °C deneyin (220 °C yerine)
- PETG: 235–240 °C deneyin (245 °C yerine)

:::warning Çok Düşük Sıcaklık Kötü Katman Füzyonuna Yol Açar
Sıcaklığı dikkatli düşürün. Çok düşük sıcaklık kötü katman füzyonuna, zayıf baskıya ve ekstrüzyon sorunlarına neden olur.
:::

### 3. Geri Çekme Ayarlarını Düzenleyin

Geri çekme, damlama önlemek için "travel" hareketi sırasında filamenti nozüle geri çeker:

```
Bambu Studio → Filament → Geri Çekme:
- Geri çekme mesafesi: 0.4–1.0 mm (direct drive)
- Geri çekme hızı: 30–45 mm/s
```

:::tip Bambu Lab Yazıcıları Direct Drive Kullanır
Tüm Bambu Lab yazıcıları (X1C, P1S, A1) direct drive ekstrüder kullanır. Direct drive, Bowden sistemlerine kıyasla **daha kısa** geri çekme mesafesi gerektirir (tipik olarak 0.5–1.5 mm vs. 3–7 mm).
:::

### 4. Travel Hızını Artırın

Noktalar arasında hızlı hareket, nozülün damlama için daha az zaman harcamasını sağlar:
- "Travel speed"i 200–300 mm/s'ye artırın
- Bambu Lab yazıcıları bunu iyi kaldırır

### 5. "Avoid Crossing Perimeters" Aktif Edin

Dilimleyici ayarı, nozülün stringing'in görüneceği açık alanları geçmesini engeller:
```
Bambu Studio → Kalite → Avoid crossing perimeters
```

### 6. Hızı Düşürün (TPU için)

TPU için çözüm diğer malzemelerin tersidir:
- Baskı hızını 20–35 mm/s'ye düşürün
- TPU esnektir ve çok yüksek hızda sıkışır — bu "sonraki akış"a neden olur

## Ayarlamalardan Sonra

Standart bir stringing test modeli ile test edin (örn. MakerWorld'den "torture tower"). Bir seferinde tek bir değişken ayarlayın ve sonucu gözlemleyin.

:::note Mükemmellik Nadiren Mümkündür
Çoğu malzeme için biraz stringing normaldir. Tamamen ortadan kaldırmak yerine kabul edilebilir seviyeye indirmeye odaklanın. PETG her zaman PLA'dan biraz daha fazla stringing yapar.
:::
