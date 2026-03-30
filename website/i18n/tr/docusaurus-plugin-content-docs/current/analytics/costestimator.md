---
sidebar_position: 4
title: Maliyet Hesaplayıcı
description: 3MF veya GCode dosyası yükleyerek yazdırmadan önce filament, elektrik ve makine aşınması için toplam maliyeti hesaplayın
---

# Maliyet Hesaplayıcı

Maliyet hesaplayıcı, bir baskıyı yazıcıya göndermeden önce toplam maliyeti tahmin etmenizi sağlar — filament tüketimi, elektrik fiyatı ve makine aşınmasına göre.

Gidin: **https://localhost:3443/#cost-estimator**

## Dosya Yükleme

1. **Maliyet Hesaplayıcı**'ya gidin
2. Bir dosyayı yükleme alanına sürükleyip bırakın veya **Dosya Seç**'e tıklayın
3. Desteklenen formatlar: `.3mf`, `.gcode`, `.bgcode`
4. **Analiz Et**'e tıklayın

:::info Analiz
Sistem, filament tüketimini, tahmini baskı süresini ve malzeme profilini çıkarmak için G-kodunu analiz eder. Bu genellikle 2–10 saniye sürer.
:::

## Filament Hesaplama

Analizin ardından şunlar gösterilir:

| Alan | Değer (örnek) |
|---|---|
| Tahmini filament | 47,3 g |
| Malzeme (dosyadan) | PLA |
| Gram başına fiyat | 0,025 ₺ (filament deposundan) |
| **Filament maliyeti** | **1,18 ₺** |

Farklı filament türleri veya tedarikçilerle maliyetleri karşılaştırmak için açılır listeden malzemeyi değiştirin.

:::tip Malzeme Geçersiz Kılma
G-kodu malzeme bilgisi içermiyorsa, listeden malzemeyi manuel olarak seçin. Fiyat otomatik olarak filament deposundan alınır.
:::

## Elektrik Hesaplama

Elektrik maliyeti şunlara göre hesaplanır:

- **Tahmini baskı süresi** — G-kodu analizinden
- **Yazıcı gücü** — yazıcı modeli başına yapılandırılmış (W)
- **Elektrik fiyatı** — sabit fiyat (₺/kWh) veya Tibber/Nordpool'dan canlı

| Alan | Değer (örnek) |
|---|---|
| Tahmini baskı süresi | 3 saat 22 dk |
| Yazıcı gücü | 350 W (X1C) |
| Tahmini tüketim | 1,17 kWh |
| Elektrik fiyatı | 1,85 ₺/kWh |
| **Elektrik maliyeti** | **2,16 ₺** |

İstenen başlangıç zamanına göre planlanan saatlik fiyatları kullanmak için Tibber veya Nordpool entegrasyonunu etkinleştirin.

## Makine Aşınması

Aşınma maliyeti şunlara göre tahmin edilir:

- Baskı süresi × yazıcı modeli başına saatlik maliyet
- Aşındırıcı malzeme için ekstra aşınma (CF, GF vb.)

| Alan | Değer (örnek) |
|---|---|
| Baskı süresi | 3 saat 22 dk |
| Saatlik maliyet (aşınma) | 0,80 ₺/saat |
| **Aşınma maliyeti** | **2,69 ₺** |

Saatlik maliyet, bileşen fiyatları ve beklenen ömürden hesaplanır ([Aşınma Tahmini](../monitoring/wearprediction) sayfasına bakın).

## Toplam

| Maliyet Kalemi | Tutar |
|---|---|
| Filament | 1,18 ₺ |
| Elektrik | 2,16 ₺ |
| Makine aşınması | 2,69 ₺ |
| **Toplam** | **6,03 ₺** |
| + Kar marjı (%30) | 1,81 ₺ |
| **Satış fiyatı** | **7,84 ₺** |

Müşteriye önerilen satış fiyatını hesaplamak için yüzde alanında kar marjını ayarlayın.

## Tahmini Kaydetme

Analizi bir projeye bağlamak için **Tahmini Kaydet**'e tıklayın:

1. Mevcut projeyi seçin veya yeni bir proje oluşturun
2. Tahmin kaydedilir ve fatura için temel olarak kullanılabilir
3. Gerçek maliyet (baskıdan sonra) tahminle otomatik olarak karşılaştırılır

## Toplu Hesaplama

Eksiksiz bir set için toplam maliyeti hesaplamak üzere birden fazla dosyayı aynı anda yükleyin:

1. **Toplu Mod**'a tıklayın
2. Tüm `.3mf`/`.gcode` dosyalarını yükleyin
3. Sistem bireysel ve toplam maliyeti hesaplar
4. Özeti PDF veya CSV olarak dışa aktarın
