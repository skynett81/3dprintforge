---
sidebar_position: 3
title: AMS Bakımı
description: AMS bakımı — PTFE borular, filament yolu ve nem önleme
---

# AMS Bakımı

AMS (Otomatik Malzeme Sistemi), güvenilir çalışması için düzenli bakım gerektiren hassas bir sistemdir. En yaygın sorunlar kirli filament yolu ve kasada nemdir.

## PTFE Borular

PTFE boruları filamenti AMS'den yazıcıya taşır. İlk aşınan parçalar arasındadır.

### İnceleme
PTFE borularını şunlar için kontrol edin:
- **Kıvrıklar veya bükülmeler** — filament akışını engeller
- **Bağlantı noktalarında aşınma** — girişlerin etrafında beyaz toz
- **Şekil bozulması** — özellikle CF malzeme kullanımında

### PTFE Borusu Değişimi
1. AMS'den filamenti boşaltın (boşaltma döngüsü çalıştırın)
2. Bağlantı noktasındaki mavi kilit halkasına basın
3. Boruyu çekerek çıkarın (sağlam bir kavrayış gerektirir)
4. Yeni boruyu doğru uzunluğa kesin (orijinalinden kısa kesmeyin)
5. Durana kadar itin ve kilitleyin

:::tip AMS Lite ve AMS
AMS Lite (A1/A1 Mini), tam AMS'ye (P1S/X1C) kıyasla daha basit PTFE konfigürasyonuna sahiptir. Borular daha kısa ve değiştirmesi daha kolaydır.
:::

## Filament Yolu

### Filament Kanalını Temizleme
Filamentler, özellikle CF malzemeler, filament kanalında toz ve artık bırakır:

1. Tüm yuvalardan filamenti boşaltın
2. Gevşek tozu üflemek için basınçlı hava veya yumuşak fırça kullanın
3. Kanaldan temiz bir naylon parçası veya PTFE temizleme filamenti geçirin

### Sensörler
AMS, filament konumunu ve filament kopmasını algılamak için sensörler kullanır. Sensör pencerelerini temiz tutun:
- Sensör lenslerini temiz bir fırçayla dikkatlice silin
- Doğrudan sensörlere IPA uygulamaktan kaçının

## Nem

AMS filamenti nemden korumaz. Higroskopik malzemeler (PA, PETG, TPU) için şunlar önerilir:

### Kuru AMS Alternatifleri
- **Kapalı kutu:** Makara bobinlerini silika jelli hava geçirmez kutuya yerleştirin
- **Bambu Dry Box:** Resmi kurutma kutusu aksesuarı
- **Harici besleyici:** Hassas malzemeler için AMS dışında filament besleyici kullanın

### Nem Göstergeleri
AMS kasasına nem gösterge kartları (higrometre) yerleştirin. %30 bağıl nem üzerinde silika jel torbaları değiştirin.

## Tahrik Dişlileri ve Sıkıştırma Mekanizması

### İnceleme
AMS'deki tahrik dişlilerini (ekstrüder tekerlekleri) şunlar için kontrol edin:
- Dişler arasında filament artıkları
- Diş setinde aşınma
- Manuel çekmede düzensiz sürtünme

### Temizlik
1. Tahrik dişlisinin dişleri arasındaki artıkları çıkarmak için diş fırçası veya fırça kullanın
2. Basınçlı hava ile üfleyin
3. Yağ ve gres kullanmaktan kaçının — sürüş kuvveti kuru çalışma için kalibre edilmiştir

## Bakım Aralıkları

| Aktivite | Aralık |
|----------|--------|
| PTFE borularının görsel incelemesi | Aylık |
| Filament kanalı temizliği | Her 100 saatte bir |
| Sensör kontrolü | Aylık |
| Silika jel değişimi (kurutma düzeni) | Gerektiğinde (%30+ bağıl nemde) |
| PTFE borusu değişimi | Görünür aşınmada |
