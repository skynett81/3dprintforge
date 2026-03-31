---
sidebar_position: 8
title: Panoda gezinme
description: 3DPrintForge'da gezinmeyi öğrenin — kenar çubuğu, paneller, klavye kısayolları ve özelleştirme
---

# Panoda gezinme

Bu rehber, panonun nasıl organize edildiğine ve verimli gezinmeye dair hızlı bir giriş sunmaktadır.

## Kenar çubuğu

Soldaki kenar çubuğu, gezinme merkezinizdir. Bölümler halinde organize edilmiştir:

```
┌────────────────────┐
│ 🖨  Yazıcı durumları│  ← Yazıcı başına bir satır
├────────────────────┤
│ Genel bakış        │
│ Filo               │
│ Aktif baskı        │
├────────────────────┤
│ Filament           │
│ Geçmiş             │
│ Projeler           │
│ Kuyruk             │
│ Zamanlayıcı        │
├────────────────────┤
│ İzleme             │
│  └ Print Guard     │
│  └ Hatalar         │
│  └ Tanılama        │
│  └ Bakım           │
├────────────────────┤
│ Analiz             │
│ Araçlar            │
│ Entegrasyonlar     │
│ Sistem             │
├────────────────────┤
│ ⚙ Ayarlar         │
└────────────────────┘
```

**Kenar çubuğu gizlenebilir** — sol üstteki hamburger simgesine (☰) tıklayın. Daha küçük ekranlarda veya kiosk modunda kullanışlıdır.

## Ana panel

Kenar çubuğundaki bir öğeye tıkladığınızda içerik sağdaki ana panelde görüntülenir. Düzen değişiklik gösterir:

| Panel | Düzen |
|-------|-------|
| Genel bakış | Tüm yazıcılarla kart ızgarası |
| Aktif baskı | Büyük ayrıntı kartı + sıcaklık eğrileri |
| Geçmiş | Filtrelenebilir tablo |
| Filament | Makaralarla kart görünümü |
| Analiz | Grafikler ve diyagramlar |

## Ayrıntılar için yazıcı durumuna tıklama

Genel bakış panelindeki yazıcı kartı tıklanabilir:

**Tek tıklama** → O yazıcı için ayrıntı panelini açar:
- Gerçek zamanlı sıcaklıklar
- Aktif baskı (devam ediyorsa)
- Tüm slotlarla AMS durumu
- Son hatalar ve olaylar
- Hızlı düğmeler: Duraklat, Durdur, Işık açma/kapama

**Kamera simgesine tıklama** → Canlı kamera görünümünü açar

**⚙ simgesine tıklama** → Yazıcı ayarları

## Klavye kısayolu — komut paleti

Komut paleti, gezinmeye gerek kalmadan tüm işlevlere hızlı erişim sağlar:

| Kısayol | Eylem |
|---------|-------|
| `Ctrl + K` (Linux/Windows) | Komut paletini aç |
| `Cmd + K` (macOS) | Komut paletini aç |
| `Esc` | Paleti kapat |

Komut paletinde şunları yapabilirsiniz:
- Sayfa ve işlevleri arayın
- Doğrudan baskı başlatın
- Aktif baskıları duraklatın / sürdürün
- Temayı değiştirin (açık/koyu)
- Herhangi bir sayfaya gidin

**Örnek:** `Ctrl+K` tuşlarına basın, "duraklat" yazın → "Tüm aktif baskıları duraklat"ı seçin

## Widget özelleştirme

Genel bakış paneli, seçtiğiniz widget'larla özelleştirilebilir:

**Panoyu nasıl düzenlersiniz:**
1. Genel bakış panelinin sağ üstündeki **Düzeni düzenle** düğmesine (kalem simgesi) tıklayın
2. Widget'ları istediğiniz konuma sürükleyin
3. Yeniden boyutlandırmak için bir widget'ın köşesine tıklayıp sürükleyin
4. Yenilerini eklemek için **+ Widget ekle**'ye tıklayın:

Mevcut widget'lar:

| Widget | Gösterir |
|--------|---------|
| Yazıcı durumu | Tüm yazıcıların kartları |
| Aktif baskı (büyük) | Devam eden baskının ayrıntılı görünümü |
| AMS genel bakışı | Tüm slotlar ve filament seviyeleri |
| Sıcaklık eğrisi | Gerçek zamanlı grafik |
| Elektrik fiyatı | Sonraki 24 saat için fiyat grafiği |
| Filament ölçer | Son 30 günün toplam tüketimi |
| Geçmiş kısayolu | Son 5 baskı |
| Kamera akışı | Canlı kamera görüntüsü |

5. **Düzeni kaydet**'e tıklayın

:::tip Birden fazla düzeni kaydedin
Farklı amaçlar için farklı düzenleriniz olabilir — günlük kullanım için kompakt bir düzen, büyük ekranda asılması için büyük bir düzen. Düzen seçici ile aralarında geçiş yapın.
:::

## Tema — açık ve koyu arasında geçiş

**Hızlı geçiş:**
- Gezinmenin sağ üstündeki güneş/ay simgesine tıklayın
- Veya: `Ctrl+K` → "tema" yazın

**Kalıcı ayar:**
1. **Sistem → Temalar**'a gidin
2. Arasında seçim yapın:
   - **Açık** — beyaz arka plan
   - **Koyu** — koyu arka plan (gece önerilir)
   - **Otomatik** — cihazınızın sistem ayarını takip eder
3. Renk vurgusu seçin (mavi, yeşil, mor vb.)
4. **Kaydet**'e tıklayın

## Klavye ile gezinme

Fare kullanmadan verimli gezinme için:

| Kısayol | Eylem |
|---------|-------|
| `Tab` | Sonraki etkileşimli öğe |
| `Shift+Tab` | Önceki öğe |
| `Enter` / `Boşluk` | Düğme/bağlantıyı etkinleştir |
| `Esc` | Modal/açılır menüyü kapat |
| `Ctrl+K` | Komut paleti |
| `Alt+1` – `Alt+9` | İlk 9 sayfaya doğrudan gidin |

## PWA — uygulama olarak yükleyin

3DPrintForge, ilerici web uygulaması (PWA) olarak yüklenebilir ve tarayıcı menüleri olmadan bağımsız bir uygulama olarak çalışabilir:

1. Chrome, Edge veya Safari'de panoya gidin
2. Adres çubuğundaki **Uygulamayı yükle** simgesine tıklayın
3. Yüklemeyi onaylayın

Daha fazla ayrıntı için [PWA belgeleri](../system/pwa) sayfasına bakın.

## Kiosk modu

Kiosk modu tüm gezinmeyi gizler ve yalnızca panoyu gösterir — baskı atölyesindeki özel bir ekran için mükemmeldir:

1. **Sistem → Kiosk**'a gidin
2. **Kiosk modunu** etkinleştirin
3. Görüntülenecek widget'ları seçin
4. Yenileme aralığını ayarlayın

Tam kurulum için [Kiosk belgeleri](../system/kiosk) sayfasına bakın.
