---
sidebar_position: 4
title: Zamanlayıcı
description: Baskıları planlayın, baskı kuyruğunu yönetin ve otomatik gönderim ayarlayın
---

# Zamanlayıcı

Zamanlayıcı, baskı işlerini takvim görünümü ve akıllı baskı kuyruğuyla düzenlemenize ve otomatikleştirmenize olanak tanır.

## Takvim Görünümü

Takvim görünümü, tüm planlanan ve tamamlanan baskılara genel bir bakış sunar:

- **Aylık, haftalık ve günlük görünüm** — ayrıntı düzeyini seçin
- **Renk kodlaması** — yazıcı ve durum başına farklı renkler
- **Olaya tıkla** — baskı hakkında ayrıntıları görün

Tamamlanan baskılar, baskı geçmişine göre otomatik olarak gösterilir.

## Baskı Kuyruğu

Baskı kuyruğu, sırayla yazıcıya gönderilen işleri sıralamanıza olanak tanır:

### Kuyruğa İş Ekleme

1. **+ İş Ekle**'ye tıklayın
2. Dosyayı seçin (yazıcı SD'sinden, yerel yüklemeden veya FTP'den)
3. Önceliği ayarlayın (yüksek, normal, düşük)
4. Hedef yazıcıyı seçin (veya "otomatik")
5. **Ekle**'ye tıklayın

### Kuyruk Yönetimi

| Eylem | Açıklama |
|----------|-------------|
| Sürükle ve bırak | Sırayı yeniden düzenle |
| Kuyruğu duraklat | Geçici olarak gönderimi durdur |
| Atla | Beklemeden sonraki işi gönder |
| Sil | İşi kuyruktan kaldır |

:::tip Çok yazıcılı gönderim
Birden fazla yazıcıyla, kuyruk işleri otomatik olarak boşta olan yazıcılara dağıtabilir. **Zamanlayıcı → Ayarlar** altında **Otomatik Gönderim**'i etkinleştirin.
:::

## Planlanan Baskılar

Belirli bir zamanda başlayacak baskılar ayarlayın:

1. **+ Baskı Planla**'ya tıklayın
2. Dosyayı ve yazıcıyı seçin
3. Başlangıç zamanını ayarlayın
4. Bildirimi yapılandırın (isteğe bağlı)
5. Kaydedin

:::warning Yazıcı boşta olmalı
Planlanan baskılar yalnızca yazıcı belirtilen zamanda bekleme modundaysa başlar. Yazıcı meşgulse, başlangıç bir sonraki uygun zamana kaydırılır (yapılandırılabilir).
:::

## Yük Dengeleme

Otomatik yük dengelemeyle işler yazıcılar arasında akıllıca dağıtılır:

- **Round-robin** — tüm yazıcılar arasında eşit dağılım
- **En az meşgul** — en kısa tahmini tamamlanma süresine sahip yazıcıya gönder
- **Manuel** — her iş için yazıcıyı kendiniz seçin

**Zamanlayıcı → Yük Dengeleme** altında yapılandırın.

## Bildirimler

Zamanlayıcı, bildirim kanallarıyla entegre olur:

- İş başladığında bildirim
- İş tamamlandığında bildirim
- Hata veya gecikme durumunda bildirim

Bildirim kanallarını yapılandırmak için [Özellikler Genel Bakışı](./overview#varsler) sayfasına bakın.
