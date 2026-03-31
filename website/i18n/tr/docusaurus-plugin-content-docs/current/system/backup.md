---
sidebar_position: 2
title: Yedekleme
description: 3DPrintForge verilerinin yedeklerini oluşturun, geri yükleyin ve otomatik yedeklemeler planlayın
---

# Yedekleme

3DPrintForge, sistem arızası, sunucu taşıma veya güncelleme sorunlarında kolayca geri yüklemenizi sağlamak için tüm yapılandırma, geçmiş ve verilerin yedeklerini alabilir.

Gidin: **https://localhost:3443/#settings** → **Sistem → Yedekleme**

## Yedeklemeye Neler Dahildir

| Veri Türü | Dahil | Not |
|---|---|---|
| Yazıcı kurulumu ve yapılandırmaları | ✅ | |
| Baskı geçmişi | ✅ | |
| Filament deposu | ✅ | |
| Kullanıcılar ve roller | ✅ | Şifreler karma olarak saklanır |
| Ayarlar | ✅ | Bildirim yapılandırmaları dahil |
| Bakım günlüğü | ✅ | |
| Projeler ve fatura | ✅ | |
| Dosya kütüphanesi (meta veriler) | ✅ | |
| Dosya kütüphanesi (dosyalar) | İsteğe bağlı | Büyük olabilir |
| Timelapse videoları | İsteğe bağlı | Çok büyük olabilir |
| Galeri resimleri | İsteğe bağlı | |

## Manuel Yedekleme Oluşturma

1. **Ayarlar → Yedekleme**'ye gidin
2. Nelerin dahil edileceğini seçin (yukarıdaki tabloya bakın)
3. **Şimdi Yedek Oluştur**'a tıklayın
4. Yedekleme oluşturulurken ilerleme göstergesi görüntülenir
5. Yedekleme tamamlandığında **İndir**'e tıklayın

Yedekleme, dosya adında zaman damgasıyla bir `.zip` dosyası olarak kaydedilir:
```
3dprintforge-backup-2026-03-22T14-30-00.zip
```

## Yedeklemeyi İndirme

Yedekleme dosyaları sunucudaki yedekleme klasöründe saklanır (yapılandırılabilir). Bunları doğrudan indirebilirsiniz:

1. **Yedekleme → Mevcut Yedeklemeler**'e gidin
2. Listede yedeklemeyi bulun (tarihe göre sıralı)
3. **İndir**'e tıklayın (indirme simgesi)

:::info Depolama Klasörü
Varsayılan depolama klasörü: `./data/backups/`. **Ayarlar → Yedekleme → Depolama Klasörü** altında değiştirin.
:::

## Planlı Otomatik Yedekleme

1. **Yedekleme → Planlama** altında **Otomatik Yedekleme**'yi etkinleştirin
2. Aralığı seçin:
   - **Günlük** — saat 03:00'da çalışır (yapılandırılabilir)
   - **Haftalık** — belirli bir gün ve saatte
   - **Aylık** — ayın ilk günü
3. **Tutulacak yedek sayısını** seçin (örn. 7 — eski yedekler otomatik olarak silinir)
4. **Kaydet**'e tıklayın

:::tip Harici Depolama
Önemli veriler için: Yedeklemeler için depolama klasörü olarak harici bir disk veya ağ diski bağlayın. Bu sayede yedeklemeler sistem diski arızalansa bile hayatta kalır.
:::

## Yedeklemeden Geri Yükleme

:::warning Geri Yükleme Mevcut Verilerin Üzerine Yazar
Geri yükleme, tüm mevcut verileri yedekleme dosyasının içeriğiyle değiştirir. Önce mevcut verilerinizin güncel bir yedeğinin olduğundan emin olun.
:::

### Sunucudaki Mevcut Yedeklemeden

1. **Yedekleme → Mevcut Yedeklemeler**'e gidin
2. Listede yedeklemeyi bulun
3. **Geri Yükle**'ye tıklayın
4. İletişim kutusunda onaylayın
5. Geri yüklemenin ardından sistem otomatik olarak yeniden başlar

### İndirilen Yedekleme Dosyasından

1. **Yedek Yükle**'ye tıklayın
2. Bilgisayarınızdan `.zip` dosyasını seçin
3. Dosya doğrulanır — nelerin dahil olduğunu görürsünüz
4. **Dosyadan Geri Yükle**'ye tıklayın
5. İletişim kutusunda onaylayın

## Yedekleme Doğrulama

3DPrintForge geri yüklemeden önce tüm yedekleme dosyalarını doğrular:

- ZIP formatının geçerli olduğunu kontrol eder
- Veritabanı şemasının mevcut sürümle uyumlu olduğunu doğrular
- Yedeklemenin daha eski bir sürümden olması durumunda uyarı gösterir (taşıma otomatik olarak gerçekleştirilir)
