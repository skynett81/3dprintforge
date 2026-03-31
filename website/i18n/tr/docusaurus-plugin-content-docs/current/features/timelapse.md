---
sidebar_position: 7
title: Timelapse
description: 3D baskıların otomatik timelapse kaydını etkinleştirin, videoları yönetin ve doğrudan dashboard'da oynatın
---

# Timelapse

3DPrintForge, baskı sırasında otomatik olarak fotoğraf çekebilir ve bunları bir timelapse videosuna dönüştürebilir. Videolar yerel olarak saklanır ve doğrudan dashboard'da oynatılabilir.

Gidin: **https://localhost:3443/#timelapse**

## Etkinleştirme

1. **Ayarlar → Timelapse**'e gidin
2. **Timelapse kaydını etkinleştir**'i açın
3. **Kayıt Modunu** seçin:
   - **Katman başına** — her katman için bir fotoğraf (yüksek kalite için önerilir)
   - **Zamana dayalı** — her N saniyede bir fotoğraf (ör. her 30 saniyede)
4. Hangi yazıcıların timelapse etkin olacağını seçin
5. **Kaydet**'e tıklayın

:::tip Fotoğraf aralığı
"Katman başına" hareketi tutarlı olduğundan en düzgün animasyonu sağlar. "Zamana dayalı" daha az depolama alanı kullanır.
:::

## Kayıt Ayarları

| Ayar | Varsayılan | Açıklama |
|---|---|---|
| Çözünürlük | 1280×720 | Görüntü boyutu (640×480 / 1280×720 / 1920×1080) |
| Görüntü kalitesi | %85 | JPEG sıkıştırma kalitesi |
| Videoda FPS | 30 | Bitmiş videodaki saniyedeki kare sayısı |
| Video formatı | MP4 (H.264) | Çıkış formatı |
| Görüntüyü döndür | Kapalı | Montaj yönü için 90°/180°/270° döndür |

:::warning Depolama alanı
1080p'de 500 fotoğraflı bir timelapse, birleştirmeden önce yaklaşık 200–400 MB kullanır. Bitmiş MP4 video genellikle 20–80 MB'dır.
:::

## Depolama

Timelapse fotoğrafları ve videoları proje klasörü altında `data/timelapse/` klasöründe saklanır. Yapı yazıcı ve baskıya göre düzenlenir:

```
data/timelapse/
├── <yazici-id>/                     ← Benzersiz yazıcı ID'si
│   ├── 2026-03-22_modeladi/         ← Baskı oturumu (tarih_modeladi)
│   │   ├── frame_0001.jpg
│   │   ├── frame_0002.jpg
│   │   ├── frame_0003.jpg
│   │   └── ...                      ← Ham görüntüler (birleştirmeden sonra silinir)
│   ├── 2026-03-22_modeladi.mp4      ← Bitmiş timelapse videosu
│   ├── 2026-03-20_3dbenchy.mp4
│   └── 2026-03-15_telefonstandi.mp4
├── <yazici-id-2>/                   ← Daha fazla yazıcı (çok yazıcılıda)
│   └── ...
```

:::tip Harici depolama
Sistem diskinde yer kazanmak için timelapse klasörünü harici bir diske sembolik bağlayabilirsiniz:
```bash
# Örnek: /mnt/storage üzerine monte edilmiş harici bir diske taşı
mv data/timelapse /mnt/storage/timelapse

# Geri sembolik bağlantı oluştur
ln -s /mnt/storage/timelapse data/timelapse
```
Dashboard sembolik bağlantıyı otomatik olarak takip eder. Herhangi bir disk veya ağ paylaşımı kullanabilirsiniz.
:::

## Otomatik Birleştirme

Baskı tamamlandığında, fotoğraflar ffmpeg ile otomatik olarak bir videoya birleştirilir:

1. 3DPrintForge, MQTT'den "baskı tamamlandı" olayını alır
2. ffmpeg toplanan fotoğraflarla çağrılır
3. Video depolama klasörüne kaydedilir
4. Timelapse sayfası yeni videoyla güncellenir

İlerlemeyi **Timelapse → İşleniyor** sekmesinde görebilirsiniz.

## Oynatma

1. **https://localhost:3443/#timelapse** adresine gidin
2. Açılır listeden bir yazıcı seçin
3. Oynatmak için listeden bir videoya tıklayın
4. Oynatma kontrollerini kullanın:
   - ▶ / ⏸ — Oynat / Duraklat
   - ⏪ / ⏩ — Geri sar / İleri sar
   - Hız düğmeleri: 0.5× / 1× / 2× / 4×
5. Tam ekranda açmak için **Tam Ekran**'a tıklayın
6. MP4 dosyasını indirmek için **İndir**'e tıklayın

## Timelapse Silme

1. Listeden videoyu seçin
2. **Sil**'e tıklayın (çöp kutusu simgesi)
3. İletişim kutusunda onaylayın

:::danger Kalıcı silme
Silinen timelapse videoları ve ham görüntüler kurtarılamaz. Saklamak istiyorsanız önce videoyu indirin.
:::

## Timelapse Paylaşma

Timelapse videoları, süresi sınırlı bir bağlantı aracılığıyla paylaşılabilir:

1. Videoyu seçin ve **Paylaş**'a tıklayın
2. Bitiş süresini ayarlayın (1 saat / 24 saat / 7 gün / bitiş yok)
3. Oluşturulan bağlantıyı kopyalayıp paylaşın
4. Alıcının videoyu görmek için oturum açması gerekmez
