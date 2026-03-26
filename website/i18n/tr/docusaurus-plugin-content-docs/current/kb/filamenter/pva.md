---
sidebar_position: 8
title: PVA ve destek malzemeleri
description: Bambu Lab yazıcılar için PVA, HIPS, PVB ve diğer destek malzemeleri rehberi
---

# PVA ve destek malzemeleri

Destek malzemeleri, geçici destek olmadan basılamayan çıkıntı, köprü ve iç boşluklar içeren karmaşık geometrileri basmak için kullanılır. Baskı sonrasında destek malzemesi mekanik olarak veya bir çözücüde eritilerek çıkarılır.

## Genel bakış

| Malzeme | Çözücü | Birlikte kullanım | Erime süresi | Zorluk |
|-----------|-----------|-------------|----------------|-------------------|
| PVA | Su | PLA, PETG | 12–24 saat | Zor |
| HIPS | d-Limonen | ABS, ASA | 12–24 saat | Orta |
| PVB | İzopropanol (IPA) | PLA, PETG | 6–12 saat | Orta |
| BVOH | Su | PLA, PETG, PA | 4–8 saat | Zor |

---

## PVA (Polivinil Alkol)

PVA, karmaşık destek yapılarına sahip PLA tabanlı baskılar için en yaygın kullanılan suda çözünür destek malzemesidir.

### Ayarlar

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 190–210 °C |
| Tabla sıcaklığı | 45–60 °C |
| Parça soğutma | 100% |
| Hız | 60–80% |
| Geri çekme | Artırılmış (6–8 mm) |

### Önerilen yapı plakaları

| Plaka | Uygunluk | Yapıştırıcı? |
|-------|---------|----------|
| Cool Plate (Smooth PEI) | Mükemmel | Hayır |
| Textured PEI | İyi | Hayır |
| Engineering Plate | İyi | Hayır |
| High Temp Plate | Kaçının | — |

### Uyumluluk

PVA, **benzer sıcaklıklarda** basan malzemelerle en iyi çalışır:

| Ana malzeme | Uyumluluk | Not |
|---------------|---------------|---------|
| PLA | Mükemmel | İdeal kombinasyon |
| PETG | İyi | Tabla sıcaklığı PVA için biraz yüksek olabilir |
| ABS/ASA | Kötü | Kabin sıcaklığı çok yüksek — PVA bozulur |
| PA (Naylon) | Kötü | Sıcaklıklar çok yüksek |

### Eritme

- Bitmiş baskıyı **ılık suya** (yaklaşık 40 °C) koyun
- PVA, kalınlığa bağlı olarak **12–24 saat** içinde erir
- Süreci hızlandırmak için suyu düzenli aralıklarla karıştırın
- Daha hızlı eritme için 6–8 saatte bir suyu değiştirin
- Ultrasonik temizleyici önemli ölçüde daha hızlı sonuç verir (2–6 saat)

:::danger PVA aşırı higroskopiktir
PVA, havadaki nemi **çok hızlı** emer — saatler süren maruz kalma bile baskı sonucunu bozabilir. Nem emmiş PVA şunlara neden olur:

- Yoğun kabarcık ve çıtırdama sesleri
- Ana malzemeye kötü yapışma
- İplik çekme ve yapışkan yüzey
- Tıkanmış nozül

**PVA'yı kullanmadan hemen önce her zaman kurutun** ve kuru ortamdan (kurutma kutusu) baskı yapın.
:::

### PVA kurutma

| Parametre | Değer |
|-----------|-------|
| Kurutma sıcaklığı | 45–55 °C |
| Kurutma süresi | 6–10 saat |
| Higroskopik seviye | Son derece yüksek |
| Saklama yöntemi | Her zaman kurutucu maddeli mühürlü kutu |

---

## HIPS (Yüksek Darbe Dayanımlı Polistiren)

HIPS, d-limonen (narenciye bazlı çözücü) içinde eriyen bir destek malzemesidir. ABS ve ASA için tercih edilen destek malzemesidir.

### Ayarlar

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 220–240 °C |
| Tabla sıcaklığı | 90–100 °C |
| Kabin sıcaklığı | 40–50 °C (önerilen) |
| Parça soğutma | 20–40% |
| Hız | 70–90% |

### Uyumluluk

| Ana malzeme | Uyumluluk | Not |
|---------------|---------------|---------|
| ABS | Mükemmel | İdeal kombinasyon — benzer sıcaklıklar |
| ASA | Mükemmel | Çok iyi yapışma |
| PLA | Kötü | Sıcaklık farkı çok büyük |
| PETG | Kötü | Farklı termal davranış |

### d-Limonen'de eritme

- Baskıyı **d-limonen** (narenciye bazlı çözücü) içine koyun
- Eritme süresi: oda sıcaklığında **12–24 saat**
- 35–40 °C'ye ısıtma süreci hızlandırır
- d-Limonen 2–3 kez yeniden kullanılabilir
- Eritme sonrası parçayı suyla durulayın ve kurulayın

### PVA'ya göre avantajları

- **Neme karşı çok daha az hassas** — saklaması ve kullanması daha kolay
- **Destek malzemesi olarak daha güçlü** — parçalanmadan daha fazla yük taşır
- **ABS/ASA ile daha iyi termal uyumluluk**
- **Baskısı daha kolay** — daha az tıkanma ve sorun

:::warning d-Limonen bir çözücüdür
Eldiven kullanın ve havalandırılmış ortamda çalışın. d-Limonen cildi ve mukoza zarlarını tahriş edebilir. Çocukların erişemeyeceği yerde saklayın.
:::

---

## PVB (Polivinil Bütiral)

PVB, izopropanol (IPA) içinde eriyen ve IPA buharıyla yüzey düzleştirmede kullanılabilen benzersiz bir destek malzemesidir.

### Ayarlar

| Parametre | Değer |
|-----------|-------|
| Nozül sıcaklığı | 200–220 °C |
| Tabla sıcaklığı | 55–75 °C |
| Parça soğutma | 80–100% |
| Hız | 70–80% |

### Uyumluluk

| Ana malzeme | Uyumluluk | Not |
|---------------|---------------|---------|
| PLA | İyi | Kabul edilebilir yapışma |
| PETG | Orta | Tabla sıcaklığı değişebilir |
| ABS/ASA | Kötü | Sıcaklıklar çok yüksek |

### IPA buharıyla yüzey düzleştirme

PVB'nin benzersiz özelliği, yüzeyinin IPA buharıyla düzleştirilebilmesidir:

1. Parçayı kapalı bir kaba yerleştirin
2. IPA ile ıslatılmış bez parçayı alta koyun (parçayla doğrudan temas etmeden)
3. Buharın **30–60 dakika** etkileşmesine izin verin
4. Çıkarıp 24 saat kurumaya bırakın
5. Sonuç pürüzsüz, yarı parlak bir yüzeydir

:::tip PVB yüzey kaplaması olarak
PVB esas olarak bir destek malzemesi olsa da, IPA buharıyla düzleştirilebilecek bir yüzey elde etmek için PLA parçaların dış katmanı olarak basılabilir. Bu, aseton düzleştirilmiş ABS'ye benzer bir son işlem sağlar.
:::

---

## Destek malzemeleri karşılaştırması

| Özellik | PVA | HIPS | PVB | BVOH |
|----------|-----|------|-----|------|
| Çözücü | Su | d-Limonen | IPA | Su |
| Eritme süresi | 12–24 s | 12–24 s | 6–12 s | 4–8 s |
| Nem hassasiyeti | Son derece yüksek | Düşük | Orta | Son derece yüksek |
| Zorluk | Zor | Orta | Orta | Zor |
| Fiyat | Yüksek | Orta | Yüksek | Çok yüksek |
| En uygun | PLA, PETG | ABS, ASA | PLA | PLA, PETG, PA |
| Bulunabilirlik | İyi | İyi | Sınırlı | Sınırlı |
| AMS uyumlu | Evet (kurutucu ile) | Evet | Evet | Sorunlu |

---

## Çift ekstrüzyon ve çok renkli ipuçları

### Genel yönergeler

- **Temizleme miktarı** — destek malzemeleri malzeme değişiminde iyi temizleme gerektirir (en az 150–200 mm³)
- **Arayüz katmanları** — temiz yüzey için destek ve ana parça arasında 2–3 arayüz katmanı kullanın
- **Mesafe** — eritme sonrası kolay çıkarma için destek mesafesini 0.1–0.15 mm olarak ayarlayın
- **Destek deseni** — PVA/BVOH için üçgen desen, HIPS için ızgara kullanın

### AMS kurulumu

- Destek malzemesini **kurutucu maddeli AMS yuvasına** yerleştirin
- PVA için: Bowden bağlantılı harici kurutma kutusu düşünün
- Bambu Studio'da doğru malzeme profilini yapılandırın
- Karmaşık parçalardan önce basit bir çıkıntı modeli ile test edin

### Yaygın sorunlar ve çözümleri

| Sorun | Neden | Çözüm |
|---------|-------|---------|
| Destek yapışmıyor | Mesafe çok büyük | Arayüz mesafesini 0.05 mm'ye düşürün |
| Destek çok sıkı yapışıyor | Mesafe çok küçük | Arayüz mesafesini 0.2 mm'ye artırın |
| Destek malzemesinde kabarcıklar | Nem | Filamenti iyice kurutun |
| Malzemeler arası iplik çekme | Yetersiz geri çekme | Geri çekmeyi 1–2 mm artırın |
| Destek tarafında kötü yüzey | Yetersiz arayüz katmanı | 3–4 arayüz katmanına artırın |

:::tip Basit başlayın
Destek malzemesi ile ilk baskınız için: PLA + PVA, belirgin çıkıntılı (45°+) basit bir model ve Bambu Studio'daki standart ayarları kullanın. Deneyim kazandıkça optimize edin.
:::
