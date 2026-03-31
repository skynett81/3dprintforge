---
sidebar_position: 9
title: Yedekleme ve geri yükleme
description: 3DPrintForge'un otomatik ve manuel yedeklemesi, geri yükleme ve yeni sunucuya taşıma
---

# Yedekleme ve geri yükleme

3DPrintForge tüm verileri yerel olarak depolar — baskı geçmişi, filament deposu, ayarlar, kullanıcılar ve daha fazlası. Düzenli yedekleme, sunucu arızası veya taşıma sırasında hiçbir şey kaybetmemenizi sağlar.

## Yedeklemede neler bulunur?

| Veri | Dahil | Not |
|------|-------|-----|
| Baskı geçmişi | Evet | Tüm günlükler ve istatistikler |
| Filament deposu | Evet | Makaralar, ağırlıklar, markalar |
| Ayarlar | Evet | Tüm sistem ayarları |
| Yazıcı yapılandırması | Evet | IP adresleri, erişim kodları |
| Kullanıcılar ve roller | Evet | Parolalar hash olarak saklanır |
| Bildirim yapılandırması | Evet | Telegram token'ları vb. |
| Kamera görüntüleri | İsteğe bağlı | Büyük dosyalar oluşturabilir |
| Time-lapse videoları | İsteğe bağlı | Varsayılan olarak hariç tutulur |

## Otomatik gece yedeklemesi

Varsayılan olarak her gece saat 03:00'te otomatik yedekleme çalışır.

**Otomatik yedeklemeyi görüntüleme ve yapılandırma:**
1. **Sistem → Yedekleme**'ye gidin
2. **Otomatik yedekleme** altında şunları görürsünüz:
   - Son başarılı yedekleme ve zamanı
   - Sonraki planlanmış yedekleme
   - Saklanan yedekleme sayısı (varsayılan: 7 gün)

**Yapılandırma:**
- **Saat** — varsayılan 03:00'ten size uygun bir saate değiştirin
- **Saklama süresi** — yedeklemelerin saklandığı gün sayısı (7, 14, 30 gün)
- **Depolama konumu** — yerel klasör (varsayılan) veya harici yol
- **Sıkıştırma** — varsayılan olarak etkin (boyutu %60–80 azaltır)

:::info Yedekleme dosyaları varsayılan olarak burada saklanır
```
/3dprintforge/yolu/data/backups/
backup-2025-03-22-030000.tar.gz
backup-2025-03-21-030000.tar.gz
...
```
:::

## Manuel yedekleme

İstediğiniz zaman yedek alın:

1. **Sistem → Yedekleme**'ye gidin
2. **Şimdi yedekle**'ye tıklayın
3. Durum **Tamamlandı** gösterene kadar bekleyin
4. **İndir**'e tıklayarak yedekleme dosyasını indirin

**Alternatif olarak terminal aracılığıyla:**
```bash
cd /3dprintforge/yolu
node scripts/backup.js
```

Yedekleme dosyası, dosya adında zaman damgasıyla birlikte `data/backups/` içine kaydedilir.

## Yedeklemeden geri yükleme

:::warning Geri yükleme mevcut verilerin üzerine yazar
Tüm mevcut veriler yedekleme dosyasının içeriğiyle değiştirilir. Doğru dosyaya geri yüklediğinizden emin olun.
:::

### Pano aracılığıyla

1. **Sistem → Yedekleme**'ye gidin
2. **Geri yükle**'ye tıklayın
3. Listeden bir yedekleme dosyası seçin veya diskten yedekleme dosyası yükleyin
4. **Şimdi geri yükle**'ye tıklayın
5. Geri yüklemeden sonra pano otomatik olarak yeniden başlar

### Terminal aracılığıyla

```bash
cd /3dprintforge/yolu
node scripts/restore.js data/backups/backup-2025-03-22-030000.tar.gz
```

Geri yüklemeden sonra panoyu yeniden başlatın:
```bash
sudo systemctl restart 3dprintforge
# veya
npm start
```

## Ayarları dışa ve içe aktarma

Yalnızca ayarları saklamak mı istiyorsunuz (tüm geçmiş değil)?

**Dışa aktarma:**
1. **Sistem → Ayarlar → Dışa aktar**'a gidin
2. Dahil edilecekleri seçin:
   - Yazıcı yapılandırması
   - Bildirim yapılandırması
   - Kullanıcı hesapları
   - Filament markaları ve profilleri
3. **Dışa aktar**'a tıklayın — bir `.json` dosyası indirilir

**İçe aktarma:**
1. **Sistem → Ayarlar → İçe aktar**'a gidin
2. `.json` dosyasını yükleyin
3. Hangi bölümlerin içe aktarılacağını seçin
4. **İçe aktar**'a tıklayın

:::tip Yeni kurulumda kullanışlı
Dışa aktarılan ayarlar, yeni bir sunucuya taşırken kullanışlıdır. Yeni kurulumdan sonra içe aktararak her şeyi yeniden ayarlamaktan kaçının.
:::

## Yeni sunucuya taşıma

3DPrintForge'u tüm verilerle yeni bir makineye nasıl taşırsınız:

### Adım 1 — Eski sunucuda yedek alın

1. **Sistem → Yedekleme → Şimdi yedekle**'ye gidin
2. Yedekleme dosyasını indirin
3. Dosyayı yeni sunucuya kopyalayın (USB, scp, ağ paylaşımı)

### Adım 2 — Yeni sunucuya yükleyin

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
./install.sh
```

Kurulum kılavuzunu takip edin. Hiçbir şeyi yapılandırmanıza gerek yok — sadece panoyu çalıştırın.

### Adım 3 — Yedeklemeyi geri yükleyin

Yeni sunucuda pano çalışırken:

1. **Sistem → Yedekleme → Geri yükle**'ye gidin
2. Eski sunucudaki yedekleme dosyasını yükleyin
3. **Şimdi geri yükle**'ye tıklayın

Her şey artık yerli yerinde: geçmiş, filament deposu, ayarlar ve kullanıcılar.

### Adım 4 — Bağlantıyı doğrulayın

1. **Ayarlar → Yazıcılar**'a gidin
2. Her yazıcıyla bağlantıyı test edin
3. IP adreslerinin hâlâ doğru olduğunu kontrol edin (yeni sunucunun farklı IP'si olabilir)

## İyi yedekleme alışkanlıkları için ipuçları

- **Geri yüklemeyi test edin** — en az bir kez test makinede yedek alın ve geri yükleyin. Test edilmemiş yedekler yedek değildir.
- **Harici olarak saklayın** — yedekleme dosyasını düzenli aralıklarla harici bir diske veya bulut depolamaya (Nextcloud, Google Drive vb.) kopyalayın
- **Bildirim kurun** — bir şeyler ters gittiğinde hemen öğrenmek için **Ayarlar → Bildirimler → Olaylar** altında "Yedekleme başarısız" bildirimini etkinleştirin
