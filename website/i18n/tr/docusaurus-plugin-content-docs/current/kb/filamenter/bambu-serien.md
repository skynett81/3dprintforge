---
sidebar_position: 9
title: Bambu Lab filamentleri
description: Bambu Lab'ın kendi filament serilerinin tam rehberi — ayarlar, RFID ve AMS uyumluluğu
---

# Bambu Lab filamentleri

Bambu Lab, yazıcıları için özel olarak optimize edilmiş geniş bir filament yelpazesi üretmektedir. Tüm Bambu Lab filamentleri, yazıcı tarafından otomatik olarak algılanan ve doğru ayarları yapan **RFID etiketiyle** birlikte gelir.

## RFID ve AMS

Tüm Bambu Lab filamentlerinde makaraya gömülü bir **RFID çipi** bulunur. Bu sayede:

- **Otomatik tanıma** — yazıcı malzeme türünü, rengi ve ayarları okur
- **Kalan miktar** — makarada tahmini kalan filament
- **Doğru ayarlar** — sıcaklık, hız ve soğutma otomatik ayarlanır
- **AMS uyumluluğu** — AMS'de sorunsuz malzeme değişimi

:::tip AMS'de üçüncü parti filamentler
AMS, üçüncü parti filamentlerle de çalışır, ancak ayarları Bambu Studio'da manuel olarak yapmanız gerekir. RFID otomatik algılama yalnızca Bambu Lab filamentlerine özeldir.
:::

---

## PLA serisi

Bambu Lab'ın PLA serisi en kapsamlı olanıdır ve temel ürünlerden özel efektlere kadar her şeyi kapsar.

### PLA Basic

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 220 °C |
| Tabla sıcaklığı | 35–45 °C |
| Soğutma | 100% |
| RFID | Evet |
| AMS uyumlu | Evet |
| Fiyat | Bütçe dostu |

Günlük baskılar için standart filament. Geniş renk yelpazesinde mevcut.

### PLA Matte

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 220 °C |
| Tabla sıcaklığı | 35–45 °C |
| Soğutma | 100% |
| Yüzey | Mat, parlaklıksız |

Standart PLA'dan daha iyi katman çizgilerini gizleyen düzgün, mat yüzey sağlar. Estetik baskılar için popüler seçim.

### PLA Silk

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 230 °C |
| Tabla sıcaklığı | 45–55 °C |
| Soğutma | 80% |
| Yüzey | Parlak, metalik görünüm |

Metalik efektli parlak, ipeksi yüzey sağlar. Standart PLA'dan biraz daha düşük soğutma ve hız gerektirir.

### PLA Sparkle

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 220–230 °C |
| Tabla sıcaklığı | 35–45 °C |
| Soğutma | 100% |
| Yüzey | Simli parçacıklar |

Parıldayan efekt veren sim parçacıkları içerir. Standart PLA ayarlarıyla basılır.

### PLA Marble

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 220 °C |
| Tabla sıcaklığı | 35–45 °C |
| Soğutma | 100% |
| Yüzey | Mermer deseni |

Baskı boyunca renk varyasyonlarıyla benzersiz mermer efekti sağlar. Her baskı biraz farklıdır.

### PLA Tough (PLA-S)

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 220–230 °C |
| Tabla sıcaklığı | 35–55 °C |
| Soğutma | 100% |
| Mukavemet | Standart PLA'dan %20–30 daha güçlü |

Artırılmış darbe dayanımına sahip güçlendirilmiş PLA. Standart PLA'dan daha fazla mukavemet gerektiren mekanik parçalar için uygundur.

### PLA Galaxy

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 220–230 °C |
| Tabla sıcaklığı | 35–45 °C |
| Soğutma | 100% |
| Yüzey | Sim + renk geçişi |

Benzersiz görsel efekt için sim efektini renk geçişleriyle birleştirir. Standart PLA ayarlarıyla basılır.

---

## PETG serisi

### PETG Basic

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 240–250 °C |
| Tabla sıcaklığı | 70–80 °C |
| Soğutma | 50–70% |
| RFID | Evet |
| AMS uyumlu | Evet |

İyi mukavemet ve esnekliğe sahip standart PETG. İyi renk yelpazesinde mevcut.

### PETG HF (High Flow)

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 240–260 °C |
| Tabla sıcaklığı | 70–80 °C |
| Soğutma | 50–70% |
| Hız | 300 mm/s'ye kadar |

Kaliteden ödün vermeden daha hızlı ekstrüzyon için formüle edilmiş yüksek hızlı PETG. Büyük parçalar ve seri üretim için ideal.

### PETG-CF

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 250–270 °C |
| Tabla sıcaklığı | 70–80 °C |
| Soğutma | 40–60% |
| Nozül | Sertleştirilmiş çelik zorunlu |

Artırılmış sertlik ve boyutsal kararlılığa sahip karbon fiber takviyeli PETG. Sertleştirilmiş nozül (HS01 veya eşdeğeri) gerektirir.

:::warning CF varyantları için sertleştirilmiş nozül
Tüm karbon fiber takviyeli filamentler (PLA-CF, PETG-CF, PA-CF, PC-CF) sertleştirilmiş çelik nozül gerektirir. Pirinç, CF malzemelerle saatler içinde aşınır.
:::

---

## ABS ve ASA

### ABS

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 250–270 °C |
| Tabla sıcaklığı | 90–110 °C |
| Kabin sıcaklığı | 40 °C+ önerilen |
| Soğutma | 20–40% |
| Kapalı kabin | Önerilen |

### ASA

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 240–260 °C |
| Tabla sıcaklığı | 90–110 °C |
| Kabin sıcaklığı | 40 °C+ önerilen |
| Soğutma | 30–50% |
| Kapalı kabin | Önerilen |
| UV dayanımı | Mükemmel |

---

## TPU 95A

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 220–240 °C |
| Tabla sıcaklığı | 35–50 °C |
| Soğutma | 50–80% |
| Hız | 50–70% (düşürülmüş) |
| Shore sertliği | 95A |
| AMS uyumlu | Sınırlı (doğrudan besleme önerilir) |

Lastik benzeri parçalar için esnek filament. AMS, TPU 95A'yı idare edebilir, ancak daha yumuşak varyantlar için doğrudan besleme daha iyi sonuç verir.

:::tip AMS'de TPU
Bambu Lab'ın TPU 95A'sı özellikle AMS ile çalışmak üzere formüle edilmiştir. Daha yumuşak TPU (85A ve altı) doğrudan ekstrüdere beslenmelidir.
:::

---

## PA serisi (Naylon)

### PA6-CF

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 270–290 °C |
| Tabla sıcaklığı | 90–100 °C |
| Kabin sıcaklığı | 50 °C+ (zorunlu) |
| Soğutma | 0–20% |
| Nozül | Sertleştirilmiş çelik zorunlu |
| Kapalı kabin | Zorunlu |
| Kurutma | 70–80 °C'de 8–12 saat |

Son derece yüksek mukavemet ve sertliğe sahip karbon fiber takviyeli naylon. Mevcut en güçlü FDM malzemelerinden biri.

### PA6-GF

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 270–290 °C |
| Tabla sıcaklığı | 90–100 °C |
| Kabin sıcaklığı | 50 °C+ (zorunlu) |
| Soğutma | 0–20% |
| Nozül | Sertleştirilmiş çelik zorunlu |
| Kapalı kabin | Zorunlu |
| Kurutma | 70–80 °C'de 8–12 saat |

Cam fiber takviyeli naylon — PA6-CF'den daha ucuz, iyi sertlik ve boyutsal kararlılık.

---

## PC

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 260–280 °C |
| Tabla sıcaklığı | 100–120 °C |
| Kabin sıcaklığı | 50–60 °C (zorunlu) |
| Soğutma | 0–20% |
| Kapalı kabin | Zorunlu |
| Kurutma | 70–80 °C'de 6–8 saat |

Maksimum mukavemet ve ısı dayanımı için Bambu Lab polikarbonatı.

---

## Destek malzemeleri

### PVA

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 190–210 °C |
| Tabla sıcaklığı | 45–60 °C |
| Çözücü | Su |
| Birlikte kullanım | PLA, PETG |

### HIPS

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 220–240 °C |
| Tabla sıcaklığı | 90–100 °C |
| Çözücü | d-Limonen |
| Birlikte kullanım | ABS, ASA |

---

## Kalite kontrol ve renk tutarlılığı

Bambu Lab, filamentlerinde sıkı kalite kontrol uygular:

- **Çap toleransı** — ±0.02 mm (endüstri lideri)
- **Renk tutarlılığı** — parti kontrolü makaralar arasında aynı rengi sağlar
- **Makara kalitesi** — düğüm veya üst üste binme olmadan düzgün sarım
- **Vakum mühürlü** — her makara kurutucu ile vakumlu paketlenir
- **Sıcaklık profili testi** — her parti optimum sıcaklıkta test edilir

:::tip Tutarlılık için renk numarası
Bambu Lab, parti kontrolüyle renk numaraları (örn. "Bambu PLA Matte Charcoal") kullanır. Büyük bir proje için birden fazla makarada aynı renk gerekiyorsa, aynı partiden sipariş verin veya parti eşleştirme için destek ile iletişime geçin.
:::

---

## Fiyat ve bulunabilirlik

| Seri | Fiyat aralığı | Bulunabilirlik |
|-------|-----------|----------------|
| PLA Basic | Bütçe dostu | İyi — geniş çeşit |
| PLA Matte/Silk/Sparkle | Orta | İyi |
| PLA Tough | Orta | İyi |
| PETG Basic/HF | Orta | İyi |
| PETG-CF | Yüksek | Orta |
| ABS/ASA | Orta | İyi |
| TPU 95A | Orta | Sınırlı çeşit |
| PA6-CF/GF | Yüksek | Orta |
| PC | Yüksek | Sınırlı |
| PVA/HIPS | Yüksek | İyi |

Bambu Lab filamentleri, Bambu Lab'ın resmi çevrimiçi mağazasından ve seçilmiş bayilerden temin edilebilir. Fiyatlar genellikle diğer premium markalarla rekabetçidir, özellikle PLA Basic bütçe pazarına yöneliktir.
