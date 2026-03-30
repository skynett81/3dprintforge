---
sidebar_position: 6
title: Birden fazla yazıcı
description: Bambu Dashboard'da birden fazla Bambu yazıcısını kurun ve yönetin — filo genel bakışı, kuyruk ve kademeli başlatma
---

# Birden fazla yazıcı

Birden fazla yazıcınız mı var? Bambu Dashboard, filo yönetimi için tasarlanmıştır — tüm yazıcıları tek bir yerden izleyebilir, kontrol edebilir ve koordine edebilirsiniz.

## Yeni yazıcı ekleme

1. **Ayarlar → Yazıcılar**'a gidin
2. **+ Yazıcı ekle**'ye tıklayın
3. Doldurun:

| Alan | Örnek | Açıklama |
|------|-------|----------|
| Seri numarası (SN) | 01P... | Bambu Handy'de veya yazıcının ekranında bulunur |
| IP adresi | 192.168.1.101 | LAN modu için (önerilen) |
| Erişim kodu | 12345678 | Yazıcı ekranındaki 8 haneli kod |
| Ad | "Bambu #2 - P1S" | Panoda gösterilir |
| Model | P1P, P1S, X1C, A1 | Doğru simgeler ve işlevler için doğru modeli seçin |

4. **Bağlantıyı test et**'e tıklayın — yeşil durum görmelisiniz
5. **Kaydet**'e tıklayın

:::tip Yazıcılara açıklayıcı isimler verin
"Bambu 1" ve "Bambu 2" kafa karıştırıcı olabilir. Düzeni korumak için "X1C - Üretim" ve "P1S - Prototipler" gibi isimler kullanın.
:::

## Filo genel bakışı

Tüm yazıcılar eklendikten sonra **Filo** panelinde bir arada görüntülenir. Burada şunları görürsünüz:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ X1C - Üretim    │  │ P1S - Prototipler│  │ A1 - Hobi odası │
│ ████████░░ %82  │  │ Boşta           │  │ ████░░░░░░ %38  │
│ 1s 24d kaldı    │  │ Baskıya hazır   │  │ 3s 12d kaldı    │
│ Sıcak: 220/60°C │  │ AMS: 4 makara   │  │ Sıcak: 235/80°C │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

Şunları yapabilirsiniz:
- Tam ayrıntı görünümü için bir yazıcıya tıklayın
- Tüm sıcaklıkları, AMS durumunu ve aktif hataları bir arada görün
- Duruma göre filtreleyin (aktif baskılar, boşta, hatalar)

## Baskı kuyruğu — işi dağıtma

Baskı kuyruğu, tüm yazıcılar için baskıları tek bir yerden planlamanızı sağlar.

**Nasıl çalışır:**
1. **Kuyruk**'a gidin
2. **+ İş ekle**'ye tıklayın
3. Dosya ve ayarları seçin
4. Yazıcı seçin veya **Otomatik atama**'yı seçin

### Otomatik atama
Otomatik atama ile pano, şunlara göre yazıcı seçer:
- Mevcut kapasite
- AMS'de mevcut filament
- Planlanmış bakım pencereleri

**Ayarlar → Kuyruk → Otomatik atama** altından etkinleştirin.

### Önceliklendirme
Sırayı değiştirmek için kuyruktaki işleri sürükleyip bırakın. **Yüksek öncelikli** bir iş, normal işlerin önüne geçer.

## Kademeli başlatma — güç tepelerini önleme

Aynı anda çok sayıda yazıcı başlatırsanız, ısınma aşaması güçlü bir güç tepesine neden olabilir. Kademeli başlatma, başlatmayı dağıtır:

**Nasıl etkinleştirilir:**
1. **Ayarlar → Filo → Kademeli başlatma**'ya gidin
2. **Dağıtılmış başlatma**'yı etkinleştirin
3. Yazıcılar arasındaki gecikmeyi ayarlayın (önerilen: 2–5 dakika)

**3 yazıcı ve 3 dakika gecikmeli örnek:**
```
08:00 — Yazıcı 1 ısınmaya başlar
08:03 — Yazıcı 2 ısınmaya başlar
08:06 — Yazıcı 3 ısınmaya başlar
```

:::tip Sigorta boyutu için önemli
Bir X1C, ısınma sırasında yaklaşık 1000W çeker. Üç yazıcı aynı anda = 3000W, bu da 16A sigortasını attırabilir. Kademeli başlatma sorunu ortadan kaldırır.
:::

## Yazıcı grupları

Yazıcı grupları, yazıcıları mantıksal olarak düzenlemenizi ve tüm gruba komut göndermenizi sağlar:

**Grup oluşturma:**
1. **Ayarlar → Yazıcı grupları**'na gidin
2. **+ Yeni grup**'a tıklayın
3. Gruba bir ad verin (örn. "Üretim katı", "Hobi odası")
4. Gruba yazıcılar ekleyin

**Grup işlevleri:**
- Grup için toplu istatistikleri görüntüleme
- Tüm gruba aynı anda duraklat komutu gönderme
- Grup için bakım penceresi belirleme

## Tüm yazıcıları izleme

### Çoklu kamera görünümü
Tüm kamera akışlarını yan yana görmek için **Filo → Kamera görünümü**'ne gidin:

```
┌──────────────┐  ┌──────────────┐
│  X1C Akışı   │  │  P1S Akışı   │
│  [Canlı]     │  │  [Boşta]     │
└──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│  A1 Akışı    │  │  + Ekle      │
│  [Canlı]     │  │              │
└──────────────┘  └──────────────┘
```

### Yazıcı başına bildirimler
Farklı yazıcılar için farklı bildirim kuralları yapılandırabilirsiniz:
- Üretim yazıcısı: her zaman bildir, gece dahil
- Hobi yazıcısı: yalnızca gündüz bildir

Kurulum için [Bildirimler](./notification-setup) bölümüne bakın.

## Filo yönetimi ipuçları

- **Filament slotlarını standartlaştırın**: Tüm yazıcılarda PLA beyazı slot 1'de, PLA siyahı slot 2'de tutun — bu iş dağılımını kolaylaştırır
- **AMS seviyelerini günlük kontrol edin**: Sabah rutini için [Günlük kullanım](./daily-use) bölümüne bakın
- **Sırayla bakım yapın**: Tüm yazıcıları aynı anda bakıma almayın — her zaman en az birini aktif tutun
- **Dosyaları açıkça adlandırın**: `logo_x1c_pla_0.2mm.3mf` gibi dosya adları doğru yazıcıyı seçmeyi kolaylaştırır
