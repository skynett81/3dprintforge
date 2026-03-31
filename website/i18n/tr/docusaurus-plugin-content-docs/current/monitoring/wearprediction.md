---
sidebar_position: 5
title: Aşınma Tahmini
description: Ömür hesaplama, bakım uyarıları ve maliyet tahminiyle 8 yazıcı bileşeninin tahmine dayalı analizi
---

# Aşınma Tahmini

Aşınma tahmini, kritik bileşenlerin beklenen ömrünü gerçek kullanım, filament türü ve yazıcı davranışına göre hesaplar — böylece bakımı reaktif yerine proaktif olarak planlayabilirsiniz.

Gidin: **https://localhost:3443/#wear**

## İzlenen Bileşenler

3DPrintForge, yazıcı başına 8 bileşendeki aşınmayı takip eder:

| Bileşen | Birincil Aşınma Faktörü | Tipik Ömür |
|---|---|---|
| **Nozül (pirinç)** | Filament türü + saatler | 300–800 saat |
| **Nozül (sertleştirilmiş)** | Saatler + aşındırıcı malzeme | 1500–3000 saat |
| **PTFE borusu** | Saatler + yüksek sıcaklık | 500–1500 saat |
| **Ekstrüder dişli çarkı** | Saatler + aşındırıcı malzeme | 1000–2000 saat |
| **X ekseni çubuğu (CNC)** | Baskı sayısı + hız | 2000–5000 saat |
| **Yapı tablası yüzeyi** | Baskı sayısı + sıcaklık | 200–500 baskı |
| **AMS dişli çarkı** | Filament değişim sayısı | 5000–15000 değişim |
| **Kamera fanları** | Çalışma saatleri | 3000–8000 saat |

## Aşınma Hesaplama

Aşınma, toplam yüzde olarak hesaplanır (%0–100 aşınmış):

```
Aşınma % = (gerçek kullanım / beklenen ömür) × 100
           × malzeme çarpanı
           × hız çarpanı
```

**Malzeme çarpanları:**
- PLA, PETG: 1.0× (normal aşınma)
- ABS, ASA: 1.1× (biraz daha agresif)
- PA, PC: 1.2× (PTFE ve nozüle zor)
- CF/GF kompozitler: 2.0–3.0× (son derece aşındırıcı)

:::warning Karbon Fiber
Karbon fiber takviyeli filamentler (CF-PLA, CF-PA vb.) pirinç nozülleri son derece hızlı aşındırır. Sertleştirilmiş çelik nozül kullanın ve 2–3× daha hızlı aşınma bekleyin.
:::

## Ömür Hesaplama

Her bileşen için gösterilir:

- **Mevcut aşınma** — kullanılan yüzde
- **Tahmini kalan ömür** — saat veya baskı
- **Tahmini bitiş tarihi** — son 30 günün ortalama kullanımına göre
- **Güven aralığı** — tahmin için belirsizlik marjı

Zaman içindeki aşınma birikiminin ayrıntılı grafiğini görmek için bir bileşene tıklayın.

## Uyarılar

Bileşen başına otomatik uyarıları yapılandırın:

1. **Aşınma → Ayarlar**'a gidin
2. Her bileşen için **Uyarı Eşiği** ayarlayın (önerilen: %75 ve %90)
3. Bildirim kanalını seçin ([Bildirimler](../features/notifications) sayfasına bakın)

**Örnek uyarı mesajı:**
> ⚠️ Benim X1C'm'deki Nozül (pirinç) %78 aşınmış. Tahmini ömür: ~45 saat. Öneri: Nozül değişimi planlayın.

## Bakım Maliyeti

Aşınma modülü, maliyet kaydıyla entegre olur:

- **Bileşen başına maliyet** — yedek parça fiyatı
- **Toplam değiştirme maliyeti** — sınıra yaklaşan tüm bileşenlerin toplamı
- **Önümüzdeki 6 ay tahmini** — tahmini bakım maliyeti

**Aşınma → Fiyatlar** altında bileşen fiyatlarını girin:

1. **Fiyatları Ayarla**'ya tıklayın
2. Her bileşen için birim fiyatı girin
3. Fiyat, maliyet tahminlerinde kullanılır ve yazıcı modeline göre değişebilir

## Aşınma Sayacını Sıfırlama

Bakımdan sonra, ilgili bileşenin sayacını sıfırlayın:

1. **Aşınma → [Bileşen Adı]**'na gidin
2. **Değiştirildi Olarak İşaretle**'ye tıklayın
3. Doldurun:
   - Değişim tarihi
   - Maliyet (isteğe bağlı)
   - Not (isteğe bağlı)
4. Aşınma sayacı sıfırlanır ve yeniden hesaplanır

Sıfırlamalar bakım geçmişinde görünür.

:::tip Kalibrasyon
Aşınma tahminini gerçek deneyim verileriyle karşılaştırın ve hesaplamalarınızı gerçek kullanımınıza göre uyarlamak için **Aşınma → Ömrü Yapılandır** altında ömür parametrelerini ayarlayın.
:::
