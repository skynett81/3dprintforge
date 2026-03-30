---
sidebar_position: 5
title: Baskı Kuyruğu
description: Öncelikli kuyruk, otomatik gönderim ve kademeli başlatmayla baskıları planlayın ve otomatikleştirin
---

# Baskı Kuyruğu

Baskı kuyruğu, baskıları önceden planlamanıza ve boşta olan yazıcılara hazır olduklarında otomatik olarak göndermenize olanak tanır.

Gidin: **https://localhost:3443/#queue**

## Kuyruk Oluşturma

1. Gezinme menüsünde **Baskı Kuyruğu**'na gidin
2. **Yeni İş**'e tıklayın (+ simgesi)
3. Doldurun:
   - **Dosya adı** — `.3mf` veya `.gcode` yükleyin
   - **Hedef yazıcı** — belirli bir yazıcı veya **Otomatik** seçin
   - **Öncelik** — Düşük / Normal / Yüksek / Kritik
   - **Planlanan başlangıç** — şimdi veya belirli bir tarih/saat
4. **Kuyruğa Ekle**'ye tıklayın

:::tip Sürükle ve bırak
Hızlı ekleme için dosyaları doğrudan dosya gezgininden kuyruk sayfasına sürükleyebilirsiniz.
:::

## Dosya Ekleme

### Dosya Yükleme

1. **Yükle**'ye tıklayın veya yükleme alanına bir dosya sürükleyin
2. Desteklenen formatlar: `.3mf`, `.gcode`, `.bgcode`
3. Dosya kütüphanede saklanır ve kuyruk işiyle ilişkilendirilir

### Dosya Kütüphanesinden

1. **Dosya Kütüphanesi**'ne gidin ve dosyayı bulun
2. Dosyada **Kuyruğa Ekle**'ye tıklayın
3. İş varsayılan ayarlarla oluşturulur — gerekirse düzenleyin

### Geçmişten

1. **Geçmiş**'te önceki bir baskıyı açın
2. **Tekrar Bas**'a tıklayın
3. İş, son sefer ile aynı ayarlarla eklenir

## Öncelik

Kuyruk öncelik sırasına göre işlenir:

| Öncelik | Renk | Açıklama |
|---|---|---|
| Kritik | Kırmızı | Diğer işlerden bağımsız olarak ilk müsait yazıcıya gönderilir |
| Yüksek | Turuncu | Normal ve düşük işlerin önünde |
| Normal | Mavi | Standart sıra (FIFO) |
| Düşük | Gri | Yalnızca daha yüksek iş beklemediğinde gönderilir |

Aynı öncelik seviyesinde sırayı manuel olarak değiştirmek için işleri sürükleyin.

## Otomatik Gönderim

**Otomatik Gönderim** etkinleştirildiğinde, Bambu Dashboard tüm yazıcıları izler ve sonraki işi otomatik olarak gönderir:

1. **Ayarlar → Kuyruk**'a gidin
2. **Otomatik Gönderim**'i açın
3. **Gönderim Stratejisi** seçin:
   - **İlk müsait** — müsait olan ilk yazıcıya gönderir
   - **En az kullanılan** — bugün en az baskı yapan yazıcıya öncelik verir
   - **Round-robin** — tüm yazıcılar arasında eşit döner

:::warning Onay
Her gönderimi dosya gönderilmeden önce manuel olarak onaylamak istiyorsanız ayarlarda **Onay Gerekli**'yi etkinleştirin.
:::

## Kademeli Başlatma

Kademeli başlatma, tüm yazıcıların aynı anda başlayıp bitmesini önlemek için kullanışlıdır:

1. **Yeni İş** iletişim kutusunda **Gelişmiş Ayarlar**'ı genişletin
2. **Kademeli Başlatma**'yı etkinleştirin
3. **Yazıcılar Arasındaki Gecikme**'yi ayarlayın (ör. 30 dakika)
4. Sistem, başlangıç zamanlarını otomatik olarak dağıtır

**Örnek:** 30 dakika gecikmeyle 4 özdeş iş saat 08:00, 08:30, 09:00 ve 09:30'da başlar.

## Kuyruk Durumu ve Takip

Kuyruk genel bakışı, tüm işleri durumlarıyla gösterir:

| Durum | Açıklama |
|---|---|
| Bekliyor | İş kuyruğa alındı, yazıcı bekliyor |
| Planlandı | Gelecekte planlanan başlangıç zamanı var |
| Gönderiliyor | Yazıcıya aktarılıyor |
| Basıyor | Seçilen yazıcıda devam ediyor |
| Tamamlandı | Bitti — geçmişe bağlandı |
| Başarısız | Gönderme veya baskı sırasında hata |
| İptal Edildi | Manuel olarak iptal edildi |

:::info Bildirimler
Bir iş başladığında, tamamlandığında veya başarısız olduğunda bildirim almak için **Ayarlar → Bildirimler → Kuyruk** altında kuyruk olayları için bildirimleri etkinleştirin. [Bildirimler](./notifications) sayfasına bakın.
:::
