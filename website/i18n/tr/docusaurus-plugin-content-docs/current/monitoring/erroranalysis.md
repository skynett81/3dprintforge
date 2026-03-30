---
sidebar_position: 6
title: Hata Örüntüsü Analizi
description: Hata örüntülerinin yapay zeka tabanlı analizi, hatalar ile çevresel faktörler arasındaki korelasyonlar ve somut iyileştirme önerileri
---

# Hata Örüntüsü Analizi

Hata örüntüsü analizi, örüntüleri, nedenleri ve korelasyonları belirlemek için baskılar ve hatalardan elde edilen geçmiş verileri kullanır — ve size somut iyileştirme önerileri sunar.

Gidin: **https://localhost:3443/#error-analysis**

## Ne Analiz Edilir

Sistem aşağıdaki veri noktalarını analiz eder:

- HMS hata kodları ve zamanlamaları
- Hata anındaki filament türü ve tedarikçisi
- Hata anındaki sıcaklık (nozül, tabla, kamera)
- Baskı hızı ve profili
- Günün saati ve haftanın günü
- Son bakımdan bu yana geçen süre
- Yazıcı modeli ve donanım yazılımı sürümü

## Korelasyon Analizi

Sistem, hatalar ve faktörler arasındaki istatistiksel korelasyonları arar:

**Tespit edilen korelasyon örnekleri:**
- "AMS tıkanma hatalarının %78'i X tedarikçisinin filamentleriyle oluşuyor"
- "Nozül tıkanması, 6+ saat sürekli baskıdan sonra 3× daha sık oluşuyor"
- "Yapışma hataları, kamera sıcaklığı 18°C'nin altındayken artıyor"
- "Stringing hataları, %60'ın üzerindeki nemle korelasyon gösteriyor (higrometre bağlıysa)"

İstatistiksel öneme sahip korelasyonlar (p < 0.05) en üstte gösterilir.

:::info Veri Gereksinimi
Analiz, geçmişte en az 50 baskıyla en doğru sonuçları verir. Daha az baskıyla, düşük güven düzeyli tahminler gösterilir.
:::

## İyileştirme Önerileri

Analizlere dayalı somut öneriler oluşturulur:

| Öneri Türü | Örnek |
|---|---|
| Filament | "PA-CF için farklı bir tedarikçiye geçin — 4 hatanın 3'ü TedarikçiX kullanıyordu" |
| Sıcaklık | "PETG için tabla sıcaklığını 5°C artırın — yapışma hataları tahminen %60 azalacak" |
| Hız | "4 saatten sonra hızı %80'e düşürün — nozül tıkanmaları tahminen %45 azalacak" |
| Bakım | "Ekstrüder dişli çarklarını temizleyin — aşınma, ekstrüzyon hatalarının %40'ıyla korelasyon gösteriyor" |
| Kalibrasyon | "Tabla sevelelemesi yapın — son haftaki 15 yapışma hatasının 12'si yanlış kalibrasyonla korelasyon gösteriyor" |

Her öneri şunları gösterir:
- Tahmini etki (hatalarda %-azalma)
- Güven (düşük / orta / yüksek)
- Adım adım uygulama
- İlgili dokümantasyona bağlantı

## Sağlık Puanı Etkisi

Analiz, sağlık puanına bağlanır ([Tanılama](./diagnostics) sayfasına bakın):

- Puanı en çok düşüren faktörleri gösterir
- Her öneriyi uygulayarak tahmini puan iyileştirmesini gösterir
- Önerileri potansiyel puan iyileştirmesine göre önceliklendirir

## Zaman Çizelgesi Görünümü

Kronolojik bir genel bakış görmek için **Hata Analizi → Zaman Çizelgesi**'ne gidin:

1. Yazıcı ve zaman dilimini seçin
2. Hatalar, zaman çizelgesinde türe göre renk kodlu noktalar olarak gösterilir
3. Yatay çizgiler bakım görevlerini işaretler
4. Hata kümeleri (kısa sürede çok sayıda hata) kırmızıyla vurgulanır

Belirli dönemin analizini açmak için bir kümeye tıklayın.

## Raporlar

Hata analizi üzerinde PDF raporu oluşturun:

1. **Rapor Oluştur**'a tıklayın
2. Zaman dilimini seçin (ör. son 90 gün)
3. İçerik seçin: korelasyonlar, öneriler, zaman çizelgesi, sağlık puanı
4. PDF'i indirin veya e-postaya gönderin

Yazıcı bir projeye bağlıysa raporlar projeler altında saklanır.

:::tip Haftalık Gözden Geçirme
Dashboard'u manuel olarak ziyaret etmeden güncel kalmak için **Ayarlar → Raporlar** altında otomatik haftalık e-posta raporu ayarlayın. [Raporlar](../system/reports) sayfasına bakın.
:::
