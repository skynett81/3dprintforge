---
sidebar_position: 7
title: PC
description: Bambu Lab ile PC (polikarbonat) baskı rehberi — yüksek mukavemet, ısı dayanımı ve gereksinimler
---

# PC (Polikarbonat)

Polikarbonat, FDM baskı için mevcut en güçlü termoplastik malzemelerden biridir. Son derece yüksek darbe dayanımı, 110–130 °C'ye kadar ısı dayanımı ve doğal şeffaflığı bir araya getirir. PC, baskısı zor bir malzeme olmasına rağmen, enjeksiyon kalıplama parçalarına yakın kalitede sonuçlar verir.

## Ayarlar

| Parametre | Saf PC | PC-ABS karışım | PC-CF |
|-----------|--------|-------------|-------|
| Nozül sıcaklığı | 260–280 °C | 250–270 °C | 270–290 °C |
| Tabla sıcaklığı | 100–120 °C | 90–110 °C | 100–120 °C |
| Kabin sıcaklığı | 50–60 °C (zorunlu) | 45–55 °C | 50–60 °C |
| Parça soğutma | 0–20% | 20–30% | 0–20% |
| Hız | 60–80% | 70–90% | 50–70% |
| Kurutma gerekli | Evet (kritik) | Evet | Evet (kritik) |

## Önerilen yapı plakaları

| Plaka | Uygunluk | Yapıştırıcı? |
|-------|---------|----------|
| High Temp Plate | Mükemmel (zorunlu) | Hayır |
| Engineering Plate | Kabul edilebilir | Evet |
| Textured PEI | Önerilmez | — |
| Cool Plate (Smooth PEI) | Kullanmayın | — |

:::danger High Temp Plate zorunludur
PC, 100–120 °C tabla sıcaklığı gerektirir. Cool Plate ve Textured PEI bu sıcaklıklara dayanamaz ve hasar görür. Saf PC için **her zaman** High Temp Plate kullanın.
:::

## Yazıcı ve ekipman gereksinimleri

### Kapalı kabin (zorunlu)

PC, 50–60 °C sabit sıcaklıkta **tamamen kapalı bir kabin** gerektirir. Bu olmadan ciddi eğilme, katman ayrılması ve delaminasyon yaşarsınız.

### Sertleştirilmiş nozül (şiddetle önerilir)

Saf PC aşındırıcı değildir, ancak PC-CF ve PC-GF **sertleştirilmiş çelik nozül** gerektirir (örn. Bambu Lab HS01). Saf PC için de yüksek sıcaklıklar nedeniyle sertleştirilmiş nozül önerilir.

### Yazıcı uyumluluğu

| Yazıcı | PC için uygun mu? | Not |
|---------|--------------|---------|
| X1C | Mükemmel | Tam kapalı, HS01 mevcut |
| X1E | Mükemmel | Mühendislik malzemeleri için tasarlanmış |
| P1S | Sınırlı | Kapalı, ancak aktif kabin ısıtması yok |
| P1P | Önerilmez | Kabin yok |
| A1 / A1 Mini | Kullanmayın | Açık çerçeve, düşük sıcaklıklar |

:::warning Yalnızca X1C ve X1E önerilir
PC, tutarlı sonuçlar için aktif kabin ısıtması gerektirir. P1S küçük parçalarda kabul edilebilir sonuçlar verebilir, ancak büyük parçalarda eğilme ve katman ayrılması beklenir.
:::

## Kurutma

PC **çok higroskopiktir** ve nemi hızla emer. Nemli PC, felaket düzeyinde baskı sonuçları verir.

| Parametre | Değer |
|-----------|-------|
| Kurutma sıcaklığı | 70–80 °C |
| Kurutma süresi | 6–8 saat |
| Higroskopik seviye | Yüksek |
| Maks. önerilen nem | < 0.02% |

- PC'yi baskıdan önce **her zaman** kurutun — yeni açılmış makaralar bile nem emmiş olabilir
- Mümkünse kurutma kutusundan doğrudan baskı yapın
- AMS, PC depolama için **yeterli değildir** — nem çok yüksek
- Aktif ısıtmalı özel filament kurutucu kullanın

:::danger Nem PC baskıları yok eder
Nemli PC belirtileri: şiddetli çıtırdama sesi, yüzeyde kabarcıklar, çok kötü katman yapışması, iplik çekme. Nemli PC ayarlarla telafi edilemez — önce **mutlaka** kurutulmalıdır.
:::

## Özellikler

| Özellik | Değer |
|----------|-------|
| Çekme mukavemeti | 55–75 MPa |
| Darbe dayanımı | Son derece yüksek |
| Isı dayanımı (HDT) | 110–130 °C |
| Şeffaflık | Evet (doğal/şeffaf varyant) |
| Kimyasal dayanım | Orta |
| UV dayanımı | Orta (zamanla sararır) |
| Büzülme | ~0.5–0.7% |

## PC karışımları

### PC-ABS

Her iki malzemenin mukavemetini birleştiren polikarbonat ve ABS karışımı:

- **Saf PC'den daha kolay baskı** — daha düşük sıcaklıklar ve daha az eğilme
- **Darbe dayanımı** ABS ve PC arasında
- **Endüstride popüler** — otomotiv iç mekanları ve elektronik kasalarda kullanılır
- 250–270 °C nozül, 90–110 °C tabla ile baskı

### PC-CF (karbon fiber)

Maksimum sertlik ve mukavemet için karbon fiber takviyeli PC:

- **Son derece sert** — yapısal parçalar için ideal
- **Hafif** — karbon fiber ağırlığı azaltır
- **Sertleştirilmiş nozül gerekli** — pirinç saatler içinde aşınır
- 270–290 °C nozül, 100–120 °C tabla ile baskı
- Saf PC'den daha pahalı, ancak alüminyuma yakın mekanik özellikler sunar

### PC-GF (cam fiber)

Cam fiber takviyeli PC:

- **PC-CF'den daha ucuz** ve iyi sertlik
- PC-CF'den **daha beyaz yüzey**
- **Sertleştirilmiş nozül gerekli** — cam fiberler çok aşındırıcıdır
- PC-CF'den biraz daha az sertlik, ancak daha iyi darbe dayanımı

## Kullanım alanları

PC, **maksimum mukavemet ve/veya ısı dayanımı** gereken yerlerde kullanılır:

- **Mekanik parçalar** — dişliler, bağlantı elemanları, yük altında kaplinler
- **Optik parçalar** — lensler, ışık kılavuzları, şeffaf kapaklar (şeffaf PC)
- **Isıya dayanıklı parçalar** — motor bölmesi, ısıtma elemanları yakınında
- **Elektronik kasalar** — iyi darbe dayanımlı koruyucu muhafaza
- **Alet ve kalıplar** — hassas montaj aletleri

## Başarılı PC baskı ipuçları

### İlk katman

- İlk katman hızını **%30–40**'a düşürün
- İlk 3–5 katman için tabla sıcaklığını standarttan 5 °C artırın
- **Brim çoğu PC parçası için zorunludur** — 8–10 mm kullanın

### Kabin sıcaklığı

- Baskı başlamadan önce kabinin **50 °C+** ulaşmasını bekleyin
- Baskı sırasında **kabin kapısını açmayın** — sıcaklık düşüşü anında eğilmeye neden olur
- Baskı sonrası: parçayı kabinde **yavaşça** soğutun (1–2 saat)

### Soğutma

- En iyi katman yapışması için **minimum parça soğutma** (0–20%) kullanın
- Köprüler ve çıkıntılar için geçici olarak 30–40%'a artırın
- PC'de estetiğe göre katman mukavemetini önceliklendirin

### Tasarım hususları

- **Keskin köşelerden kaçının** — minimum 1 mm yarıçapla yuvarlayın
- **Düzgün et kalınlığı** — düzensiz kalınlık iç gerilmelere neden olur
- **Büyük, düz yüzeyler** zordur — bölün veya nervürler ekleyin

:::tip PC'de yeni misiniz? PC-ABS ile başlayın
Daha önce PC basmadıysanız, PC-ABS karışımı ile başlayın. Saf PC'den çok daha hoşgörülüdür ve aşırı gereksinimler olmadan malzeme deneyimi kazanmanızı sağlar. PC-ABS'de ustalaştığınızda saf PC'ye geçin.
:::

---

## Son işlem

- **Zımparalama** — PC iyi zımparalanır, ancak şeffaf PC için ıslak zımparalama kullanın
- **Cilalama** — şeffaf PC neredeyse optik kaliteye kadar cilalanabilir
- **Yapıştırma** — diklorometan yapıştırma görünmez derzler oluşturur (koruyucu ekipman kullanın!)
- **Boyama** — iyi yapışma için astar gerektirir
- **Tavlama** — 120 °C'de 1–2 saat iç gerilmeleri azaltır

:::warning Diklorometan yapıştırma
Diklorometan toksiktir ve havalandırma, kimyasallara dayanıklı eldiven ve koruyucu gözlük gerektirir. Her zaman iyi havalandırılan bir ortamda veya çeker ocakta çalışın.
:::
