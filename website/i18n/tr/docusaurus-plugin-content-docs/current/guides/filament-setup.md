---
sidebar_position: 2
title: Filament deposu kurulumu
description: Bambu Dashboard'da filament makaralarınızı nasıl oluşturacağınız, yapılandıracağınız ve takip edeceğiniz
---

# Filament deposu kurulumu

Bambu Dashboard'daki filament deposu, tüm makaralarınıza tam bir genel bakış sunar — ne kaldığını, ne kullandığınızı ve şu anda AMS'de hangi makaraların bulunduğunu.

## AMS'den otomatik oluşturma

AMS'li bir yazıcı bağladığınızda pano, Bambu makaralarındaki RFID çiplerinden otomatik olarak bilgi okur:

- Filament türü (PLA, PETG, ABS, TPU vb.)
- Renk (hex kodu ile birlikte)
- Marka (Bambu Lab)
- Makara ağırlığı ve kalan miktar

**Bu makaralar depoda otomatik olarak oluşturulur** — hiçbir şey yapmanız gerekmez. **Filament → Depo** altında görüntüleyin.

:::info Yalnızca Bambu makaralarında RFID bulunur
Üçüncü taraf makaralar (örn. eSUN, Polymaker, çipsiz Bambu dolum makaraları) otomatik olarak tanınmaz. Bunların manuel olarak eklenmesi gerekir.
:::

## Makaraları manuel olarak ekleme

RFID'siz makaralar veya AMS'de olmayan makaralar için:

1. **Filament → Depo** bölümüne gidin
2. Sağ üstteki **+ Yeni makara** düğmesine tıklayın
3. Alanları doldurun:

| Alan | Örnek | Zorunlu |
|------|-------|---------|
| Marka | eSUN, Polymaker, Bambu | Evet |
| Tür | PLA, PETG, ABS, TPU | Evet |
| Renk | #FF5500 veya renk tekerleğinden seçin | Evet |
| Başlangıç ağırlığı | 1000 g | Önerilen |
| Kalan | 850 g | Önerilen |
| Çap | 1,75 mm | Evet |
| Not | "2025-01'de satın alındı, iyi çalışıyor" | İsteğe bağlı |

4. **Kaydet**'e tıklayın

## Renkleri ve markaları yapılandırma

Depo genel görünümündeki bir makaraya tıklayarak istediğiniz zaman düzenleyebilirsiniz:

- **Renk** — Renk tekerleğinden seçin veya hex değeri girin. Renk, AMS genel görünümünde görsel işaretçi olarak kullanılır
- **Marka** — İstatistiklerde ve filtrelemede gösterilir. **Filament → Markalar** altında özel markalar oluşturun
- **Sıcaklık profili** — Filament üreticisinden önerilen nozul ve tabla sıcaklığını girin. Pano, yanlış sıcaklık seçerseniz uyarı verebilir

## AMS senkronizasyonunu anlama

Pano, AMS durumunu gerçek zamanlı olarak senkronize eder:

```
AMS Slot 1 → Makara: Bambu PLA Beyaz  [███████░░░] %72 kaldı
AMS Slot 2 → Makara: eSUN PETG Gri    [████░░░░░░] %41 kaldı
AMS Slot 3 → (boş)
AMS Slot 4 → Makara: Bambu PLA Kırmızı [██████████] %98 kaldı
```

Senkronizasyon şu durumlarda güncellenir:
- **Baskı sırasında** — tüketim gerçek zamanlı olarak düşülür
- **Baskı sonunda** — nihai tüketim geçmişe kaydedilir
- **Manuel olarak** — güncel verileri AMS'den almak için bir makaradaki senkronize simgesine tıklayın

:::tip AMS tahminini düzeltme
İlk kullanımdan sonra RFID'den gelen AMS tahmini her zaman %100 doğru olmayabilir. En iyi hassasiyet için makarayı tartın ve ağırlığı manuel olarak güncelleyin.
:::

## Tüketimi ve kalanı kontrol etme

### Makara başına
Depodaki bir makaraya tıklayarak şunları görebilirsiniz:
- Toplam kullanım (gram, tüm baskılar)
- Tahmini kalan miktar
- Bu makarayı kullanan tüm baskıların listesi

### Toplu istatistikler
**Analiz → Filament analizi** altında şunları göreceksiniz:
- Zaman içinde filament türüne göre tüketim
- En çok hangi markaları kullandığınız
- kg başına satın alma fiyatına göre tahmini maliyet

### Düşük seviye uyarıları
Bir makara tükenmek üzere olduğunda uyarı alın:

1. **Filament → Ayarlar** bölümüne gidin
2. **Düşük stok uyarısı** seçeneğini etkinleştirin
3. Eşik değeri belirleyin (örn. 100 g kaldığında)
4. Bildirim kanalını seçin (Telegram, Discord, e-posta)

## İpucu: Doğruluk için makaraları tartın

AMS ve baskı istatistiklerinden gelen tahminler hiçbir zaman tamamen doğru değildir. En doğru yöntem, makaranın kendisini tartmaktır:

**Nasıl yapılır:**

1. Tara ağırlığını bulun (boş makara) — genellikle 200–250 g, üretici web sitesini veya makaranın altını kontrol edin
2. Filamentli makarayı mutfak terazisinde tartın
3. Tara ağırlığını çıkarın
4. Makara profilindeki **Kalan** değerini güncelleyin

**Örnek:**
```
Tartılan ağırlık:  743 g
Tara (boş):      - 230 g
Kalan filament:    513 g
```

:::tip Makara etiket oluşturucu
**Araçlar → Etiketler** altında makaralarınız için QR kodlu etiket yazdırabilirsiniz. Makara profilini hızlıca açmak için telefonunuzla kodu tarayın.
:::
