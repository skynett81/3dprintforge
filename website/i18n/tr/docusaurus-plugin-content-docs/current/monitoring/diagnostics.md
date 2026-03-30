---
sidebar_position: 3
title: Tanılama
description: Bambu Lab yazıcıları için sağlık puanı, telemetri grafikleri, tabla mesh görselleştirme ve bileşen izleme
---

# Tanılama

Tanılama sayfası, yazıcının sağlığı, performansı ve zaman içindeki durumu hakkında derinlemesine bir genel bakış sunar.

Gidin: **https://localhost:3443/#diagnostics**

## Sağlık Puanı

Her yazıcı şunlara göre 0–100 arasında bir **sağlık puanı** hesaplar:

| Faktör | Ağırlık | Açıklama |
|---|---|---|
| Başarı oranı (30g) | %30 | Son 30 gündeki başarılı baskıların oranı |
| Bileşen aşınması | %25 | Kritik parçalarda ortalama aşınma |
| HMS hataları (30g) | %20 | Hataların sayısı ve ciddiyeti |
| Kalibrasyon durumu | %15 | Son kalibrasyondan bu yana geçen süre |
| Sıcaklık kararlılığı | %10 | Baskı sırasında hedef sıcaklıktan sapma |

**Puan yorumu:**
- 🟢 80–100 — Mükemmel durum
- 🟡 60–79 — İyi, ancak bazı şeyler incelenmeli
- 🟠 40–59 — Azalan performans, bakım önerilir
- 🔴 0–39 — Kritik, bakım zorunlu

:::tip Geçmiş
Puanın zaman içindeki gelişimini görmek için sağlık grafiğine tıklayın. Büyük düşüşler belirli bir olayı gösterebilir.
:::

## Telemetri Grafikleri

Telemetri sayfası, tüm sensör değerleri için etkileşimli grafikler gösterir:

### Mevcut Veri Setleri

- **Nozül sıcaklığı** — gerçek vs. hedef
- **Tabla sıcaklığı** — gerçek vs. hedef
- **Kamera sıcaklığı** — makinenin içindeki ortam sıcaklığı
- **Ekstrüder motoru** — akım tüketimi ve sıcaklık
- **Fan hızları** — takım kafası, kamera, AMS
- **Basınç** (X1C) — AMS için kamera basıncı
- **İvme** — titreşim verileri (ADXL345)

### Grafiklerde Gezinme

1. **Zaman Dilimi** seçin: Son saat / 24 saat / 7 gün / 30 gün / Özel
2. Açılır listeden **Yazıcı** seçin
3. **Veri Seti** görüntülemek için seçin (çoklu seçim desteklenir)
4. Zaman çizelgesini yakınlaştırmak için kaydırın
5. Kaydırmak için tıklayın ve sürükleyin
6. Yakınlaştırmayı sıfırlamak için çift tıklayın

### Telemetri Verilerini Dışa Aktarma

1. Grafikte **Dışa Aktar**'a tıklayın
2. Format seçin: **CSV**, **JSON** veya **PNG** (görüntü)
3. Seçilen zaman dilimi ve veri seti dışa aktarılır

## Tabla Mesh'i

Tabla mesh görselleştirmesi, yapı tablasının düzlük kalibrasyonunu gösterir:

1. **Tanılama → Tabla Mesh'i**'ne gidin
2. Yazıcıyı seçin
3. Son mesh, 3D yüzey ve ısı haritası olarak gösterilir:
   - **Mavi** — merkezden düşük (içbükey)
   - **Yeşil** — yaklaşık düz
   - **Kırmızı** — merkezden yüksek (dışbükey)
4. Bir noktanın üzerine gelin ve mm cinsinden tam sapmayı görün

### UI'dan Tabla Mesh'i Tarama

1. **Şimdi Tara**'ya tıklayın (yazıcının boşta olmasını gerektirir)
2. İletişim kutusunda onaylayın — yazıcı otomatik olarak kalibrasyona başlar
3. Taramanın tamamlanmasını bekleyin (yaklaşık 3–5 dakika)
4. Yeni mesh otomatik olarak görüntülenir

:::warning Önce Isıtın
Tabla mesh'i, doğru kalibrasyon için ısıtılmış tablayla (PLA için 50–60°C) taranmalıdır.
:::

## Bileşen Aşınması

Ayrıntılı dokümantasyon için [Aşınma Tahmini](./wearprediction) sayfasına bakın.

Tanılama sayfası sıkıştırılmış bir genel bakış gösterir:
- Bileşen başına yüzde puanı
- Önerilen sonraki bakım
- Tam aşınma analizini açmak için **Ayrıntılar**'a tıklayın
