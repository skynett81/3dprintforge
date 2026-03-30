---
sidebar_position: 6
title: Bed Mesh
description: Isı haritası, kullanıcı arayüzünden tarama ve kalibrasyon kılavuzuyla yapı tablasının düzlük kalibrasyonunun 3D görselleştirmesi
---

# Bed Mesh

Bed mesh aracı, yapı tablasının düzlüğünün görsel bir temsilini sunar — iyi yapışma ve düzgün ilk katman için kritik öneme sahiptir.

Gidin: **https://localhost:3443/#bedmesh**

## Bed Mesh Nedir?

Bambu Lab yazıcılar, bir sensörle yapı tablasının yüzeyini tarar ve yükseklik sapmalarının bir haritasını (mesh) oluşturur. Yazıcının ürün yazılımı yazdırma sırasında sapmaları otomatik olarak telafi eder. Bambu Dashboard bu haritayı sizin için görselleştirir.

## Görselleştirme

### 3D Yüzey

Bed mesh haritası interaktif bir 3D yüzey olarak gösterilir:

- Görünümü döndürmek için fareyi kullanın
- Yakınlaştırmak/uzaklaştırmak için kaydırın
- Kuş bakışı perspektifi için **Üst Görünüm**'e tıklayın
- Profili görmek için **Yan Görünüm**'e tıklayın

Renk skalası ortalama yükseklikten sapmaları gösterir:
- **Mavi** — merkezden daha düşük (içbükey)
- **Yeşil** — neredeyse düz (< 0,1 mm sapma)
- **Sarı** — orta sapma (0,1–0,2 mm)
- **Kırmızı** — yüksek sapma (> 0,2 mm)

### Isı Haritası

Mesh haritasının düz 2D görünümü için **Isı Haritası**'na tıklayın — çoğu kullanıcı için okumak daha kolaydır.

Isı haritası şunları gösterir:
- Her ölçüm noktası için tam sapma değerleri (mm)
- İşaretlenmiş sorunlu noktalar (sapma > 0,3 mm)
- Ölçümlerin boyutları (satır sayısı × sütun sayısı)

## Kullanıcı Arayüzünden Bed Mesh Tarama

:::warning Gereksinimler
Tarama, yazıcının boşta olmasını ve tabla sıcaklığının stabilize olmasını gerektirir. Tarama yapmadan ÖNCE tablayı istenen sıcaklığa ısıtın.
:::

1. **Bed Mesh**'e gidin
2. Açılır listeden yazıcıyı seçin
3. **Şimdi Tara**'ya tıklayın
4. Tarama için tabla sıcaklığını seçin:
   - **Soğuk** (oda sıcaklığı) — hızlı ama daha az doğru
   - **Sıcak** (PLA için 50–60°C, PETG için 70–90°C) — önerilen
5. İletişim kutusunda onaylayın — yazıcı otomatik olarak sensör dizisini başlatır
6. Tarama bitene kadar bekleyin (mesh boyutuna bağlı olarak 3–8 dakika)
7. Yeni mesh haritası otomatik olarak görüntülenir

## Kalibrasyon Kılavuzu

Taramadan sonra sistem somut öneriler sunar:

| Bulgu | Öneri |
|---|---|
| Her yerde sapma < 0,1 mm | Mükemmel — herhangi bir işlem gerekmez |
| Sapma 0,1–0,2 mm | İyi — telafi ürün yazılımı tarafından yapılır |
| Köşelerde sapma > 0,2 mm | Tabla yaylarını manuel olarak ayarlayın (mümkünse) |
| Sapma > 0,3 mm | Tabla hasar görmüş veya yanlış monte edilmiş olabilir |
| Merkez köşelerden daha yüksek | Termal genleşme — sıcak tablalar için normaldir |

:::tip Geçmiş Karşılaştırma
Mesh haritasının zaman içinde değişip değişmediğini görmek için **Öncekiyle Karşılaştır**'a tıklayın — tabletin yavaş yavaş eğilip eğilmediğini fark etmek için yararlıdır.
:::

## Mesh Geçmişi

Tüm mesh taramaları zaman damgasıyla kaydedilir:

1. Bed mesh yan panelinde **Geçmiş**'e tıklayın
2. Karşılaştırmak için iki tarama seçin (fark haritası gösterilir)
3. Artık ihtiyaç duymadığınız eski taramaları silin

## Dışa Aktarma

Mesh verilerini şu şekilde dışa aktarın:
- **PNG** — ısı haritasının görüntüsü (dokümantasyon için)
- **CSV** — nokta başına X, Y ve yükseklik sapmasıyla ham veriler
