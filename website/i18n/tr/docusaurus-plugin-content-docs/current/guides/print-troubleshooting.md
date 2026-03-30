---
sidebar_position: 5
title: Başarısız baskılarda sorun giderme
description: Bambu Dashboard'un hata günlükleri ve araçlarıyla yaygın baskı hatalarını teşhis edin ve çözün
---

# Başarısız baskılarda sorun giderme

Bir şeyler mi yanlış gitti? Paniklemeyın — çoğu baskı hatasının basit çözümleri vardır. Bambu Dashboard, nedeni hızlıca bulmanıza yardımcı olur.

## Adım 1 — HMS hata kodlarını kontrol edin

HMS (Handling, Monitoring, Sensing), Bambu Labs'ın hata sistemidir. Tüm hatalar panoda otomatik olarak kaydedilir.

1. **İzleme → Hatalar**'a gidin
2. Başarısız baskıyı bulun
3. Ayrıntılı açıklama ve önerilen çözüm için hata koduna tıklayın

Yaygın HMS kodları:

| Kod | Açıklama | Hızlı çözüm |
|-----|----------|-------------|
| 0700 1xxx | AMS hatası (sıkışma, motor sorunu) | AMS'deki filament yolunu kontrol edin |
| 0300 0xxx | Ekstrüzyon hatası (az/fazla ekstrüzyon) | Nozulu temizleyin, filamenti kontrol edin |
| 0500 xxxx | Kalibrasyon hatası | Yeniden kalibrasyon yapın |
| 1200 xxxx | Sıcaklık sapması | Kablo bağlantılarını kontrol edin |
| 0C00 xxxx | Kamera hatası | Yazıcıyı yeniden başlatın |

:::tip Geçmişteki hata kodları
**Geçmiş → [Baskı] → HMS günlüğü** altında, baskı "tamamlandı" olsa bile, baskı sırasında oluşan tüm hata kodlarını görebilirsiniz.
:::

## Yaygın hatalar ve çözümler

### Kötü yapışma (ilk katman yapışmıyor)

**Belirtiler:** Baskı plakadan ayrılıyor, kıvrılıyor, ilk katman eksik

**Nedenler ve çözümler:**

| Neden | Çözüm |
|-------|-------|
| Kirli plaka | IPA alkolle silin |
| Yanlış plaka sıcaklığı | 5°C artırın |
| Z-offset yanlış | Auto Bed Leveling'i yeniden yapın |
| Yapıştırıcı çubuk eksik (PETG/ABS) | İnce kat yapıştırıcı çubuk uygulayın |
| İlk katman hızı çok yüksek | İlk katman için 20–30 mm/s'ye düşürün |

**Hızlı kontrol listesi:**
1. Plaka temiz mi? (IPA + tüy bırakmayan kağıt havlu)
2. Filament türü için doğru plakayı kullanıyor musunuz? (bkz. [Doğru plakayı seçmek](./choosing-plate))
3. Son plaka değişiminden sonra Z kalibrasyonu yapıldı mı?

---

### Warping (köşeler kalkıyor)

**Belirtiler:** Köşeler plakadan yukarı kıvrılıyor, özellikle büyük düz modellerde

**Nedenler ve çözümler:**

| Neden | Çözüm |
|-------|-------|
| Sıcaklık farkı | Yazıcının ön kapağını kapatın |
| Brim eksik | Bambu Studio'da brim'i etkinleştirin (3–5 mm) |
| Plaka çok soğuk | Plaka sıcaklığını 5–10°C artırın |
| Yüksek büzülmeli filament (ABS) | Engineering Plate + hazne >40°C kullanın |

**ABS ve ASA özellikle hassastır.** Her zaman şunları sağlayın:
- Ön kapak kapalı
- Mümkün olduğunca az havalandırma
- Engineering Plate + yapıştırıcı çubuk
- Hazne sıcaklığı 40°C+

---

### Stringing (parçalar arasında iplikler)

**Belirtiler:** Modelin ayrı parçaları arasında ince plastik iplikler

**Nedenler ve çözümler:**

| Neden | Çözüm |
|-------|-------|
| Nemli filament | 6–8 saat filament kurutun (60–70°C) |
| Nozul sıcaklığı çok yüksek | 5°C düşürün |
| Yetersiz geri çekme | Bambu Studio'da geri çekme uzunluğunu artırın |
| Seyahat hızı çok düşük | Seyahat hızını 200+ mm/s'ye artırın |

**Nem testi:** Ekstrüzyonda çatırtı sesleri veya kabarcıklar arayın — bu nemli filamente işaret eder. Bambu AMS yerleşik nem ölçümüne sahiptir; **AMS durumu** altında nemi kontrol edin.

:::tip Filament kurutucusu
Naylon veya TPU ile çalışıyorsanız bir filament kurutucusuna (örn. Bambu Filament Dryer) yatırım yapın — bunlar 12 saatten kısa sürede nemi emer.
:::

---

### Spagetti (baskı yumağa dönüşüyor)

**Belirtiler:** Filament havada gevşek iplikler halinde asılıyor, baskı tanınamaz hâlde

**Nedenler ve çözümler:**

| Neden | Çözüm |
|-------|-------|
| Erken kötü yapışma → ayrıldı → çöktü | Yukarıdaki yapışma bölümüne bakın |
| Hız çok yüksek | Hızı %20–30 düşürün |
| Yanlış destek yapılandırması | Bambu Studio'da destekleri etkinleştirin |
| Çıkıntı çok dik | Modeli bölün veya 45° döndürün |

**Spagettiyi otomatik olarak durdurmak için Print Guard kullanın** — sonraki bölüme bakın.

---

### Az ekstrüzyon (ince, zayıf katmanlar)

**Belirtiler:** Katmanlar sağlam değil, duvarlarda delikler, zayıf model

**Nedenler ve çözümler:**

| Neden | Çözüm |
|-------|-------|
| Kısmen tıkalı nozul | Cold Pull yapın (bakım bölümüne bakın) |
| Filament çok nemli | Filamenti kurutun |
| Sıcaklık çok düşük | Nozul sıcaklığını 5–10°C artırın |
| Hız çok yüksek | %20–30 düşürün |
| PTFE borusu hasarlı | PTFE borusunu inceleyin ve değiştirin |

## Otomatik koruma için Print Guard kullanma

Print Guard, görüntü tanıma ile kamera görüntülerini izler ve spagetti tespit edilirse baskıyı otomatik olarak durdurur.

**Print Guard'ı etkinleştirme:**
1. **İzleme → Print Guard**'a gidin
2. **Otomatik algılama**'yı etkinleştirin
3. Eylem seçin: **Duraklat** (önerilen) veya **İptal et**
4. Hassasiyeti ayarlayın (**Orta** ile başlayın)

**Print Guard müdahale ettiğinde:**
1. Tespit edilenin kamera görüntüsüyle birlikte bildirim alırsınız
2. Baskı duraklatılır
3. Şu seçeneklerden birini seçebilirsiniz: **Devam et** (yanlış pozitifse) veya **Baskıyı iptal et**

:::info Yanlış pozitifler
Print Guard, bazen çok sayıda ince sütunlu modellere tepki verebilir. Karmaşık modeller için hassasiyeti düşürün veya geçici olarak devre dışı bırakın.
:::

## Panodaki tanılama araçları

### Sıcaklık günlüğü
**Geçmiş → [Baskı] → Sıcaklıklar** altında tüm baskı boyunca sıcaklık eğrisini görebilirsiniz. Şunlara dikkat edin:
- Ani sıcaklık düşüşleri (nozul veya tabla sorunu)
- Düzensiz sıcaklıklar (kalibrasyon ihtiyacı)

### Filament istatistikleri
Tüketilen filamentin tahminiyle örtüşüp örtüşmediğini kontrol edin. Büyük sapmalar, az ekstrüzyon veya filament kırılmasına işaret edebilir.

## Destek ile ne zaman iletişime geçilmeli?

Aşağıdaki durumlarda Bambu Labs desteğiyle iletişime geçin:
- Tüm önerilen çözümleri uyguladıktan sonra HMS kodu tekrarlanıyorsa
- Yazıcıda mekanik hasar görüyorsanız (eğilmiş miller, kırık dişliler)
- Sıcaklık değerleri imkânsızsa (örn. nozul -40°C okuyor)
- Ürün yazılımı güncellemesi sorunu çözmüyorsa

**Destek için hazırda bulundurmak yararlı bilgiler:**
- Panodaki hata günlüğünden HMS hata kodları
- Hatanın kamera görüntüsü
- Hangi filament ve ayarların kullanıldığı (geçmişten dışa aktarılabilir)
- Yazıcı modeli ve ürün yazılımı sürümü (**Ayarlar → Yazıcı → Bilgi** altında gösterilir)
