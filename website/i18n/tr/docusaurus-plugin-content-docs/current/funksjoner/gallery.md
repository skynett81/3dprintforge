---
sidebar_position: 8
title: Galeri
description: Tüm baskılar için %25, %50, %75 ve %100 ilerleme anında otomatik çekilen milestone ekran görüntülerini görün
---

# Galeri

Galeri, her baskı sırasında otomatik çekilen ekran görüntülerini toplar. Görüntüler sabit kilometre taşlarında çekilir ve baskının gelişiminin görsel bir kaydını sunar.

Gidin: **https://localhost:3443/#gallery**

## Milestone Ekran Görüntüleri

Bambu Dashboard, aşağıdaki kilometre taşlarında kameradan otomatik olarak bir ekran görüntüsü alır:

| Kilometre Taşı | Zaman |
|---|---|
| **%25** | Baskının çeyreğinde |
| **%50** | Yarısında |
| **%75** | Üçte ikisinde |
| **%100** | Baskı tamamlandı |

Ekran görüntüleri, ilgili baskı geçmişi kaydına bağlanır ve galeride görüntülenir.

:::info Gereksinimler
Milestone ekran görüntüleri, kameranın bağlı ve aktif olmasını gerektirir. Devre dışı bırakılmış kameralar görüntü oluşturmaz.
:::

## Ekran Görüntüsü Özelliğini Etkinleştirme

1. **Ayarlar → Galeri**'ye gidin
2. **Otomatik milestone ekran görüntüleri**'ni açın
3. Hangi kilometre taşlarını etkinleştirmek istediğinizi seçin (varsayılan olarak dört kilometre taşı açıktır)
4. **Görüntü Kalitesi** seçin: Düşük (640×360) / Orta (1280×720) / Yüksek (1920×1080)
5. **Kaydet**'e tıklayın

## Görüntü Görüntüleme

Galeri baskı başına düzenlenmiştir:

1. Yazıcı, tarih veya dosya adı seçmek için üstteki **filtre**yi kullanın
2. Tüm dört görüntüyü genişletip görmek için bir baskı satırına tıklayın
3. Önizlemeyi açmak için bir görüntüye tıklayın

### Önizleme

Önizleme şunları gösterir:
- Tam boyutlu görüntü
- Kilometre taşı ve zaman damgası
- Baskı adı ve yazıcı
- Aynı baskıdaki görüntüler arasında gezinmek için **←** / **→**

## Tam Ekran Görüntüleme

Tüm ekranı doldurmak için önizlemede **Tam Ekran**'a (veya `F` tuşuna) basın. Görüntüler arasında geçiş yapmak için ok tuşlarını kullanın.

## Görüntü İndirme

- **Tek görüntü**: Önizlemede **İndir**'e tıklayın
- **Bir baskının tüm görüntüleri**: Baskı satırında **Tümünü İndir**'e tıklayın — `.zip` dosyası alırsınız
- **Birden fazla seçim**: Onay kutularını işaretleyin ve **Seçilenleri İndir**'e tıklayın

## Görüntü Silme

:::warning Depolama alanı
Galeri görüntüleri zaman içinde önemli yer kaplayabilir. Eski görüntülerin otomatik silinmesini ayarlayın.
:::

### Manuel Silme

1. Bir veya daha fazla görüntü seçin (onay kutusu)
2. **Seçilenleri Sil**'e tıklayın
3. İletişim kutusunda onaylayın

### Otomatik Temizleme

1. **Ayarlar → Galeri → Otomatik Temizleme**'ye gidin
2. **Şu tarihten eski görüntüleri sil**'i etkinleştirin
3. Gün sayısını ayarlayın (ör. 90 gün)
4. Temizlik her gece saat 03:00'da otomatik olarak çalıştırılır

## Baskı Geçmişiyle Bağlantı

Her görüntü, geçmişte bir baskı kaydına bağlıdır:

- Geçmiş kaydına gitmek için galerideki bir baskıda **Geçmişte Görüntüle**'ye tıklayın
- Geçmişte, varsa %100 görüntüsünün küçük resmi gösterilir

## Paylaşma

Süresi sınırlı bir bağlantıyla galeri görüntüsü paylaşın:

1. Önizlemede görüntüyü açın
2. **Paylaş**'a tıklayın
3. Bitiş süresini seçin ve bağlantıyı kopyalayın
