---
sidebar_position: 6
title: ASA
description: Bambu Lab ile ASA baskı rehberi — UV dayanımı, dış mekan kullanımı, sıcaklık ve ipuçları
---

# ASA

ASA (Acrylonitrile Styrene Acrylate), özellikle dış mekan kullanımı için geliştirilmiş, ABS'nin UV dayanımlı bir varyantıdır. Malzeme, ABS'nin mukavemeti ve sertliğini, UV radyasyonuna, yaşlanmaya ve hava koşullarına karşı önemli ölçüde daha iyi dayanıklılıkla birleştirir.

## Ayarlar

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 240–260 °C |
| Tabla sıcaklığı | 90–110 °C |
| Kabin sıcaklığı | 40–50 °C (önerilen) |
| Parça soğutma | 30–50% |
| Hız | 80–100% |
| Kurutma gerekli | Evet |

## Önerilen yapı plakaları

| Plaka | Uygunluk | Yapıştırıcı? |
|-------|---------|----------|
| Engineering Plate | Mükemmel | Hayır |
| High Temp Plate | İyi | Evet |
| Textured PEI | Kabul edilebilir | Evet |
| Cool Plate (Smooth PEI) | Önerilmez | — |

:::tip Engineering Plate ASA için en iyisi
Engineering Plate, yapıştırıcı olmadan ASA için en güvenilir yapışmayı sağlar. Plaka yüksek tabla sıcaklıklarına dayanır ve parçanın kalıcı olarak yapışmadan iyi tutunmasını sağlar.
:::

## Yazıcı gereksinimleri

ASA, en iyi sonuçlar için **kapalı kabin (enclosure)** gerektirir. Kabinsiz yaşanacak sorunlar:

- **Eğilme (warping)** — köşeler yapı plakasından kalkar
- **Katman ayrılması** — katmanlar arası zayıf bağlanma
- **Yüzey çatlakları** — baskı boyunca görünür çatlaklar

| Yazıcı | ASA için uygun mu? | Not |
|---------|---------------|---------|
| X1C | Mükemmel | Tam kapalı, aktif ısıtma |
| X1E | Mükemmel | Tam kapalı, aktif ısıtma |
| P1S | İyi | Kapalı, pasif ısıtma |
| P1P | Ek aksesuar ile mümkün | Kabin aksesuarı gerekli |
| A1 | Önerilmez | Açık çerçeve |
| A1 Mini | Önerilmez | Açık çerçeve |

## ASA vs ABS — karşılaştırma

| Özellik | ASA | ABS |
|----------|-----|-----|
| UV dayanımı | Mükemmel | Kötü |
| Dış mekan kullanımı | Evet | Hayır (sararır ve kırılganlaşır) |
| Eğilme | Orta | Yüksek |
| Yüzey | Mat, düzgün | Mat, düzgün |
| Kimyasal dayanım | İyi | İyi |
| Fiyat | Biraz daha yüksek | Düşük |
| Baskı sırasında koku | Orta | Güçlü |
| Darbe dayanımı | İyi | İyi |
| Sıcaklık dayanımı | ~95–105 °C | ~95–105 °C |

:::warning Havalandırma
ASA, baskı sırasında tahriş edici gazlar yayar. İyi havalandırılan bir odada veya hava filtreleme sistemi olan bir yerde baskı yapın. Havalandırmasız bir odada uzun süre kalırken ASA baskı yapmayın.
:::

## Kurutma

ASA **orta düzeyde higroskopiktir** ve zamanla havadaki nemi emer.

| Parametre | Değer |
|-----------|-------|
| Kurutma sıcaklığı | 65 °C |
| Kurutma süresi | 4–6 saat |
| Higroskopik seviye | Orta |
| Nem belirtileri | Çıtırtı sesleri, kabarcıklar, kötü yüzey |

- Açıldıktan sonra silika jel ile birlikte mühürlü poşette saklayın
- Kurutucu maddeli AMS, kısa süreli depolama için yeterlidir
- Uzun süreli depolama: vakum poşet veya filament kurutma kutusu kullanın

## Kullanım alanları

ASA, **dış mekanda** kullanılacak her şey için tercih edilen malzemedir:

- **Otomotiv bileşenleri** — ayna muhafazaları, gösterge paneli detayları, valf kapakları
- **Bahçe aletleri** — klipsler, kelepçeler, bahçe mobilyası parçaları
- **Dış mekan tabelaları** — tabelalar, harfler, logolar
- **Drone parçaları** — iniş takımı, kamera bağlantıları
- **Güneş paneli montajları** — braketler ve açı parçaları
- **Posta kutusu parçaları** — mekanizmalar ve dekorasyonlar

## Başarılı ASA baskı ipuçları

### Brim ve yapışma

- **Büyük parçalar** ve temas alanı küçük parçalar için brim kullanın
- 5–8 mm brim, eğilmeyi etkili şekilde önler
- Küçük parçalar için brimsiz deneyebilirsiniz, ancak yedek olarak hazır tutun

### Esintiden kaçının

- Baskı sırasında odanın **tüm kapı ve pencerelerini kapatın**
- Esinti ve soğuk hava ASA'nın en büyük düşmanıdır
- Baskı sırasında kabin kapısını açmayın

### Sıcaklık stabilitesi

- Baskı başlamadan önce kabini **10–15 dakika** ısıtın
- Stabil kabin sıcaklığı daha düzgün sonuçlar verir
- Yazıcıyı pencerelerin veya havalandırma çıkışlarının yakınına koymayın

### Soğutma

- ASA **sınırlı parça soğutma** gerektirir — 30–50% tipiktir
- Çıkıntılar ve köprüler için 60–70%'e çıkarabilirsiniz, ancak bir miktar katman ayrılması bekleyin
- Mekanik parçalar için: soğutmayı azaltarak detay yerine katman bağlanmasını önceliklendirin

:::tip ASA ile ilk deneyiminiz mi?
Ayarlarınızı kalibre etmek için küçük bir test parçası (örn. 30 mm küp) ile başlayın. ASA, ABS'ye çok benzer davranır ancak eğilme eğilimi biraz daha düşüktür. ABS deneyiminiz varsa, ASA bir yükseltme gibi hissedilecektir.
:::

---

## Büzülme

ASA, PLA ve PETG'den daha fazla büzülür, ancak genellikle ABS'den biraz daha az:

| Malzeme | Büzülme |
|-----------|----------|
| PLA | ~0.3–0.5% |
| PETG | ~0.3–0.6% |
| ASA | ~0.5–0.7% |
| ABS | ~0.7–0.8% |

Sıkı toleranslı parçalar için: dilimleyicide 0.5–0.7% telafi yapın veya önce test parçalarıyla deneyin.

---

## Son işlem

- **Aseton buharı ile düzleştirme** — ASA, tıpkı ABS gibi aseton buharıyla düzleştirilebilir
- **Zımparalama** — 200–400 kum zımpara ile iyi zımparalanır
- **Yapıştırma** — CA yapıştırıcı veya aseton yapıştırma mükemmel çalışır
- **Boyama** — hafif zımparalama sonrası boyayı iyi tutar

:::danger Aseton kullanımı
Aseton yanıcıdır ve zehirli gazlar yayar. Her zaman iyi havalandırılan bir odada kullanın, açık alevden kaçının ve koruyucu ekipman (eldiven ve gözlük) kullanın.
:::
