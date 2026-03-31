---
sidebar_position: 1
title: Print Guard
description: XCam olay algılama, sensör izleme ve sapmalarda yapılandırılabilir eylemlerle otomatik izleme
---

# Print Guard

Print Guard, 3DPrintForge'un gerçek zamanlı izleme sistemidir. Kamera, sensörler ve yazıcı verilerini sürekli olarak izler ve bir şeyler yanlış gittiğinde yapılandırılmış eylemleri gerçekleştirir.

Gidin: **https://localhost:3443/#protection**

## XCam Olay Algılama

Bambu Lab yazıcıları, AI kamera sorunları tespit ettiğinde MQTT üzerinden XCam olayları gönderir:

| Olay | Kod | Önem |
|---|---|---|
| Spagetti tespit edildi | `xcam_spaghetti` | Kritik |
| Tabla yapışması | `xcam_detach` | Yüksek |
| İlk katman arızası | `xcam_first_layer` | Yüksek |
| Stringing | `xcam_stringing` | Orta |
| Ekstrüzyon hatası | `xcam_extrusion` | Yüksek |

Her olay türü için bir veya daha fazla eylem yapılandırabilirsiniz:

- **Bildir** — aktif bildirim kanalları aracılığıyla bildirim gönder
- **Duraklat** — manuel kontrol için baskıyı duraklat
- **Durdur** — baskıyı hemen iptal et
- **Hiçbir şey** — olayı yoksay (yine de kaydet)

:::danger Varsayılan Davranış
Varsayılan olarak, XCam olayları **Bildir** ve **Duraklat** olarak ayarlanmıştır. AI algılamaya tam güveniyorsanız **Durdur** olarak değiştirin.
:::

## Sensör İzleme

Print Guard, sensör verilerini sürekli izler ve sapmada alarm verir:

### Sıcaklık Sapması

1. **Print Guard → Sıcaklık**'a gidin
2. **Hedef sıcaklıktan maksimum sapma**'yı ayarlayın (önerilen: nozül için ±5°C, tabla için ±3°C)
3. **Sapma durumunda eylem**'i seçin: Bildir / Duraklat / Durdur
4. **Gecikme** (saniye) ayarlayın — sıcaklığın stabilize olması için zaman tanır

### Düşük Filament

Sistem, makaralardaki kalan filamenti hesaplar:

1. **Print Guard → Filament**'e gidin
2. **Minimum limit**'i gram olarak ayarlayın (ör. 50 g)
3. Eylem seçin: **Duraklat ve Bildir** (manuel makara değişimi için önerilir)

### Baskı Durma Tespiti

Beklenmedik şekilde durduğunda (MQTT zaman aşımı, filament kırılması vb.) baskıyı tespit eder:

1. **Durma Tespiti**'ni etkinleştirin
2. **Zaman Aşımı**'nı ayarlayın (önerilen: 120 saniye veri yok = durdu)
3. Eylem: Her zaman bildir — baskı zaten durmuş olabilir

## Yapılandırma

### Print Guard'ı Etkinleştirme

1. **Ayarlar → Print Guard**'a gidin
2. **Print Guard'ı Etkinleştir**'i açın
3. Hangi yazıcıların izleneceğini seçin
4. **Kaydet**'e tıklayın

### Yazıcı Başına Kurallar

Farklı yazıcıların farklı kuralları olabilir:

1. Print Guard genel bakışında bir yazıcıya tıklayın
2. **Global Kuralları Devral**'ı kapatın
3. Bu yazıcı için kendi kurallarını yapılandırın

## Kayıt ve Olay Geçmişi

Tüm Print Guard olayları kaydedilir:

- **Print Guard → Kayıt**'a gidin
- Yazıcı, olay türü, tarih ve önem derecesine göre filtreleyin
- Ayrıntılı bilgi ve gerçekleştirilen eylemleri görmek için bir olaya tıklayın
- Kaydı CSV'ye aktarın

:::tip Yanlış Pozitifler
Print Guard gereksiz duraklamalara neden oluyorsa, **Print Guard → Ayarlar → Hassasiyet** altında hassasiyeti ayarlayın. "Düşük" ile başlayın ve kademeli olarak artırın.
:::
