---
sidebar_position: 1
title: İlk baskınız
description: İlk 3D baskınızı başlatmak ve 3DPrintForge'da izlemek için adım adım rehber
---

# İlk baskınız

Bu rehber, bağlı yazıcıdan tamamlanmış baskıya kadar tüm süreci — 3DPrintForge'ı kontrol merkezi olarak kullanarak — anlatmaktadır.

## Adım 1 — Yazıcının bağlı olduğunu kontrol edin

Panoyu açtığınızda, yazıcınızın durum kartını kenar çubuğunun üstünde veya genel bakış panelinde göreceksiniz.

**Yeşil durum**, yazıcının çevrimiçi ve hazır olduğu anlamına gelir.

| Durum | Renk | Anlam |
|-------|------|-------|
| Çevrimiçi | Yeşil | Baskıya hazır |
| Boşta | Gri | Bağlı ama etkin değil |
| Baskı yapıyor | Mavi | Baskı devam ediyor |
| Hata | Kırmızı | Dikkat gerektirir |

Yazıcı kırmızı durum gösteriyorsa:
1. Yazıcının açık olduğunu kontrol edin
2. Panoyla aynı ağa bağlı olduğunu doğrulayın
3. **Ayarlar → Yazıcılar** bölümüne gidin ve IP adresi ile erişim kodunu onaylayın

:::tip Daha hızlı yanıt için LAN modunu kullanın
LAN modu, bulut moduna göre daha düşük gecikme sağlar. Yazıcı ve pano aynı ağdaysa yazıcı ayarlarından etkinleştirin.
:::

## Adım 2 — Modelinizi yükleyin

3DPrintForge baskıları doğrudan başlatmaz — bu Bambu Studio veya MakerWorld'ün işidir. Pano, baskı başlar başlamaz devreye girer.

**Bambu Studio aracılığıyla:**
1. Bilgisayarınızda Bambu Studio'yu açın
2. `.stl` veya `.3mf` dosyanızı içe aktarın ya da açın
3. Modeli dilimleme yapın (filament, destek, dolgu vb. seçin)
4. Sağ üstteki **Yazdır** düğmesine tıklayın

**MakerWorld aracılığıyla:**
1. [makerworld.com](https://makerworld.com) adresinde modeli bulun
2. Web sitesinden doğrudan **Yazdır** düğmesine tıklayın
3. Bambu Studio, model hazır hâlde otomatik olarak açılır

## Adım 3 — Baskıyı başlatın

Bambu Studio'da gönderme yöntemini seçin:

| Yöntem | Gereksinimler | Avantajlar |
|--------|--------------|------------|
| **Bulut** | Bambu hesabı + internet | Her yerden çalışır |
| **LAN** | Aynı ağ | Daha hızlı, bulut gerektirmez |
| **SD Kart** | Fiziksel erişim | Ağ gerektirmez |

**Gönder**'e tıklayın — yazıcı işi alır ve ısınma aşamasını otomatik olarak başlatır.

:::info Baskı panoda görünür
Bambu Studio işi gönderdikten sonra birkaç saniye içinde aktif baskı, panoda **Aktif baskı** altında görüntülenir.
:::

## Adım 4 — Panoda izleme

Baskı devam ederken pano size tam bir genel bakış sunar:

### İlerleme
- Tamamlanma yüzdesi ve tahmini kalan süre yazıcı kartında gösterilir
- Katman bilgileriyle ayrıntılı görünüm için karta tıklayın

### Sıcaklıklar
Ayrıntı paneli gerçek zamanlı sıcaklıkları gösterir:
- **Nozul** — mevcut ve hedef sıcaklık
- **Yapı tablası** — mevcut ve hedef sıcaklık
- **Hazne** — yazıcının içindeki hava sıcaklığı (ABS/ASA için önemli)

### Kamera
Panoda doğrudan canlı görüntü izlemek için yazıcı kartındaki kamera simgesine tıklayın. Başka işler yaparken kamerayı ayrı bir pencerede açık tutabilirsiniz.

:::warning İlk katmanları kontrol edin
İlk 3–5 katman kritiktir. Şu an kötü yapışma, sonraki bir başarısız baskı anlamına gelir. Kamerayı izleyin ve filamentin düzgün ve eşit şekilde yatırıldığını doğrulayın.
:::

### Print Guard
3DPrintForge, otomatik olarak spagetti hatalarını algılayan ve baskıyı duraklatabilecek yapay zeka destekli bir **Print Guard** özelliğine sahiptir. **İzleme → Print Guard** bölümünden etkinleştirin.

## Adım 5 — Baskı bittikten sonra

Baskı tamamlandığında, pano bir tamamlanma mesajı gösterir (ve [bildirimler](./notification-setup) ayarladıysanız bildirim gönderir).

### Geçmişi kontrol edin
Tamamlanan baskıyı görmek için kenar çubuğundaki **Geçmiş** bölümüne gidin:
- Toplam baskı süresi
- Filament tüketimi (kullanılan gram, tahmini maliyet)
- Baskı sırasında hatalar veya HMS olayları
- Kapanıştaki kamera görüntüsü (etkinleştirilmişse)

### Not ekleyin
Geçmişte baskıya tıklayın ve bir not ekleyin — örn. "Biraz daha kenar boşluğu gerekti" veya "Mükemmel sonuç". Aynı modeli tekrar yazdırdığınızda bu kullanışlıdır.

### Filament tüketimini kontrol edin
**Filament** bölümünde, makara ağırlığının kullanılana göre güncellendiğini görebilirsiniz. Pano bunu otomatik olarak düşer.

## Yeni başlayanlar için ipuçları

:::tip İlk baskıyı yalnız bırakmayın
İlk 10–15 dakikayı takip edin. Baskının iyi yapıştığından emin olduktan sonra, geri kalanı panonun izlemesine bırakabilirsiniz.
:::

- **Boş makaraları tartın** — doğru kalan hesaplama için makaraların başlangıç ağırlığını girin (bkz. [Filament yönetimi](./filament-setup))
- **Telegram bildirimi kurun** — baskı bittiğinde beklemeden mesaj alın (bkz. [Bildirimler](./notification-setup))
- **Yapı tablasını kontrol edin** — temiz tabla = daha iyi yapışma. Baskılar arasında IPA (izopropanol) ile temizleyin
- **Doğru plakayı kullanın** — filamentinize uygun olanı öğrenmek için [Doğru yapı plakasını seçmek](./choosing-plate) bölümüne bakın
