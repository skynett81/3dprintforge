---
sidebar_position: 10
title: OBS ile yayın yapma
description: Profesyonel 3D baskı yayını için 3DPrintForge'u OBS Studio'da overlay olarak kurun
---

# 3D baskıyı OBS'ye yayınlama

3DPrintForge, yazıcı durumunu, ilerlemeyi, sıcaklıkları ve kamera akışını doğrudan yayınınızda gösteren yerleşik bir OBS overlay'e sahiptir.

## Ön koşullar

- OBS Studio yüklü ([obsproject.com](https://obsproject.com))
- 3DPrintForge çalışıyor ve yazıcıya bağlı
- (İsteğe bağlı) Canlı akış için Bambu kamerası etkin

## Adım 1 — OBS Tarayıcı Kaynağı

OBS'de sahnenize doğrudan bir web sayfası gösteren yerleşik bir **Tarayıcı Kaynağı** bulunmaktadır.

**OBS'de overlay ekleme:**

1. OBS Studio'yu açın
2. **Kaynaklar** (Sources) altında **+**'ya tıklayın
3. **Tarayıcı** (Browser) seçin
4. Kaynağa bir ad verin, örn. "Bambu Overlay"
5. Doldurun:

| Ayar | Değer |
|------|-------|
| URL | `http://localhost:3000/obs/overlay` |
| Genişlik | `1920` |
| Yükseklik | `1080` |
| FPS | `30` |
| Özel CSS | Aşağıya bakın |

6. **Sesi OBS aracılığıyla kontrol et**'i işaretleyin
7. **Tamam**'a tıklayın

:::info URL'yi sunucunuza göre ayarlayın
Pano, OBS'den farklı bir makinede mi çalışıyor? `localhost`'u sunucunun IP adresiyle değiştirin, örn. `http://192.168.1.50:3000/obs/overlay`
:::

## Adım 2 — Şeffaf arka plan

Overlay'in görüntüyle bütünleşmesi için arka plan şeffaf olmalıdır:

**OBS Tarayıcı Kaynağı ayarlarında:**
- **Arka planı kaldır**'ı işaretleyin (Shutdown source when not visible / Remove background)

**Şeffaflığı zorlamak için özel CSS:**
```css
body {
  background-color: rgba(0, 0, 0, 0) !important;
  margin: 0;
  overflow: hidden;
}
```

Bunu Tarayıcı Kaynağı ayarlarındaki **Özel CSS** alanına yapıştırın.

Overlay artık yalnızca widget'ın kendisini gösterir — beyaz veya siyah arka plan olmadan.

## Adım 3 — Overlay'i özelleştirme

3DPrintForge'da overlay'in ne göstereceğini yapılandırabilirsiniz:

1. **Özellikler → OBS Overlay**'e gidin
2. Yapılandırın:

| Ayar | Seçenekler |
|------|-----------|
| Konum | Sol üst, sağ üst, sol alt, sağ alt |
| Boyut | Küçük, orta, büyük |
| Tema | Koyu, açık, şeffaf |
| Vurgu rengi | Yayın stilinize uyan rengi seçin |
| Öğeler | Neyin gösterileceğini seçin (aşağıya bakın) |

**Mevcut overlay öğeleri:**

- Yazıcı adı ve durumu (çevrimiçi/baskı yapıyor/hata)
- Yüzde ve kalan süreyle ilerleme çubuğu
- Filament ve rengi
- Nozul ve tabla sıcaklığı
- Kullanılan filament (gram)
- AMS genel bakışı (kompakt)
- Print Guard durumu

3. OBS'ye geçmeden sonucu görmek için **Önizleme**'ye tıklayın
4. **Kaydet**'e tıklayın

:::tip Yazıcı başına URL
Birden fazla yazıcınız mı var? Ayrı overlay URL'leri kullanın:
```
/obs/overlay?printer=1
/obs/overlay?printer=2
```
:::

## OBS'de kamera akışı (ayrı kaynak)

Bambu kamerası OBS'e overlay'den bağımsız olarak ayrı bir kaynak olarak eklenebilir:

**Seçenek 1: Pano kamera proxy'si aracılığıyla**

1. **Sistem → Kamera**'ya gidin
2. **RTSP veya MJPEG yayın URL'sini** kopyalayın
3. OBS'de: **+**'ya tıklayın → **Medya Kaynağı** (Media Source)
4. URL'yi yapıştırın
5. **Döngü** (Loop)'u işaretleyin ve yerel dosyaları devre dışı bırakın

**Seçenek 2: Kamera görünümüyle Tarayıcı Kaynağı**

1. OBS'de: **Tarayıcı Kaynağı** ekleyin
2. URL: `http://localhost:3000/obs/camera?printer=1`
3. Genişlik/yükseklik: kamera çözünürlüğüyle eşleşsin (1080p veya 720p)

Artık kamera akışını sahnede serbestçe konumlandırabilir ve overlay'i üstüne yerleştirebilirsiniz.

## İyi yayın için ipuçları

### Yayın sahnesi kurulumu

3D baskı yayını için tipik bir sahne:

```
┌─────────────────────────────────────────┐
│                                         │
│      [Yazıcıdan kamera akışı]           │
│                                         │
│  ┌──────────────────┐                  │
│  │ Bambu Overlay    │  ← Sol alt       │
│  │ Baskı: Logo.3mf  │                  │
│  │ ████████░░ %82   │                  │
│  │ 1s 24d kaldı     │                  │
│  │ 220°C / 60°C     │                  │
│  └──────────────────┘                  │
└─────────────────────────────────────────┘
```

### Önerilen ayarlar

| Parametre | Önerilen değer |
|-----------|---------------|
| Overlay boyutu | Orta (çok baskın değil) |
| Güncelleme sıklığı | 30 FPS (OBS ile eşleşir) |
| Overlay konumu | Sol alt (yüz/sohbetten kaçınır) |
| Renk teması | Mavi vurgulu koyu |

### Sahneler ve sahne değiştirme

Kendi OBS sahnelerinizi oluşturun:

- **"Baskı devam ediyor"** — kamera görünümü + overlay
- **"Duraklatıldı / bekleniyor"** — statik görüntü + overlay
- **"Tamamlandı"** — sonuç görüntüsü + "Tamamlandı" gösteren overlay

OBS'de klavye kısayoluyla veya Sahne Koleksiyonu aracılığıyla sahneler arasında geçiş yapın.

### Kamera görüntüsü stabilizasyonu

Bambu kamerası bazen donabilir. **Sistem → Kamera** altındaki panoda:
- **Otomatik yeniden bağlan**'ı etkinleştirin — pano otomatik olarak yeniden bağlanır
- **Yeniden bağlanma aralığı**'nı 10 saniye olarak ayarlayın

### Ses

3D yazıcılar ses çıkarır — özellikle AMS ve soğutma. Şunları göz önünde bulundurun:
- Mikrofonu yazıcıdan uzağa yerleştirin
- OBS'de mikrofona gürültü filtresi ekleyin (Noise Suppression)
- Veya bunun yerine arka plan müziği / sohbet sesi kullanın

:::tip Otomatik sahne değiştirme
OBS'de başlıklara dayalı sahne değiştirme için yerleşik destek bulunmaktadır. Bir baskı başladığında ve durduğunda otomatik olarak sahne değiştirmek için bir eklentiyle (örn. obs-websocket) ve 3DPrintForge API'siyle birleştirin.
:::
