---
sidebar_position: 1
title: 3DPrintForge'a Hoş Geldiniz
description: Bambu Lab 3D yazıcılar için güçlü, kendi kendine barındırılan bir dashboard
---

# 3DPrintForge'a Hoş Geldiniz

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V21NRKM7)

**3DPrintForge**, Bambu Lab 3D yazıcılar için kendi kendine barındırılan, tam özellikli bir kontrol panelidir. Yazıcınız, filament envanteriniz, baskı geçmişiniz ve daha fazlası üzerinde tam görünürlük ve kontrol sağlar — hepsi tek bir tarayıcı sekmesinden.

## 3DPrintForge nedir?

3DPrintForge, Bambu Lab'ın sunucularına bağımlı olmaksızın LAN üzerinden MQTT aracılığıyla yazıcınıza doğrudan bağlanır. Model ve baskı geçmişi senkronizasyonu için Bambu Cloud'a da bağlanabilirsiniz.

### Temel özellikler

- **Canlı dashboard** — gerçek zamanlı sıcaklık, ilerleme, kamera, LIVE göstergeli AMS durumu
- **Filament envanteri** — AMS senkronizasyonu, EXT makara desteği, malzeme bilgisi, tabla uyumluluğu ve kurutma kılavuzu ile tüm makaraları yönetin
- **Filament takibi** — 4 seviyeli yedek ile hassas takip (AMS sensörü → EXT tahmini → cloud → süre)
- **Malzeme kılavuzu** — sıcaklıklar, tabla uyumluluğu, kurutma, özellikler ve ipuçlarıyla 15 malzeme
- **Baskı geçmişi** — model adları, MakerWorld bağlantıları, filament tüketimi ve maliyetlerle eksiksiz günlük
- **Planlayıcı** — takvim görünümü, yük dengeleme ve filament kontrolü ile baskı kuyruğu
- **Yazıcı kontrolü** — sıcaklık, hız, fanlar, G-code konsolu
- **Print Guard** — xcam + 5 sensör monitörü ile otomatik koruma
- **Maliyet tahmini** — malzeme, elektrik, işçilik, aşınma, markup ve satış fiyatı önerisi
- **Bakım** — KB tabanlı aralıklar, nozul ömrü, tabla ömrü ve kılavuz ile takip
- **Ses uyarıları** — özel ses yükleme ve yazıcı hoparlörü (M300) destekli 9 yapılandırılabilir olay
- **Etkinlik günlüğü** — tüm olayların (baskılar, hatalar, bakım, filament) kalıcı zaman çizelgesi
- **Bildirimler** — 7 kanal (Telegram, Discord, e-posta, ntfy, Pushover, SMS, webhook)
- **Çoklu yazıcı** — tüm Bambu Lab serisini destekler
- **17 dil** — Norveççe, İngilizce, Almanca, Fransızca, İspanyolca, İtalyanca, Japonca, Korece, Hollandaca, Lehçe, Portekizce, İsveççe, Türkçe, Ukraynaca, Çince, Çekçe, Macarca
- **Kendi kendine barındırılan** — bulut bağımlılığı yok, verileriniz kendi makinenizde

### v1.1.14'teki yenilikler

- **AdminLTE 4 entegrasyonu** — treeview kenar çubuğu, modern düzen ve CDN için CSP desteğiyle eksiksiz HTML yeniden yapılandırması
- **CRM sistemi** — 4 panelli tam müşteri yönetimi: müşteriler, siparişler, faturalar ve geçmiş entegrasyonlu şirket ayarları
- **Modern UI** — teal vurgu, gradyan başlıklar, hover ışıması, yüzen küreler ve geliştirilmiş karanlık tema
- **Başarılar: 18 simge yapı** — Viking gemisi, Özgürlük Heykeli, Eiffel Tower, Big Ben, Brandenburg Kapısı, Sagrada Familia, Colosseum, Tokyo Tower, Gyeongbokgung, Hollanda yel değirmeni, Wawel Ejderhası, Cristo Redentor, Turning Torso, Hagia Sophia, Anavatan, Çin Seddi, Prag Astronomik Saati, Budapeşte Parlamentosu — detay açılır penceresi, XP ve nadirlik ile
- **AMS nem/sıcaklık** — depolama ve kurutma önerileriyle 5 seviyeli değerlendirme
- **Canlı filament takibi** — cloud tahmin yedekleme ile baskı sırasında gerçek zamanlı güncelleme
- **Filament bölümü yeniden tasarımı** — tam bilgili büyük makaralar (marka, ağırlık, sıcaklık, RFID, renk), yatay düzen ve detaylar için tıklama
- **EXT makara satır içi** — harici makara AMS makaralarıyla birlikte daha iyi alan kullanımıyla gösterilir
- **Dashboard düzeni optimize edildi** — 24–27" monitörler için varsayılan 2 sütun, büyük 3D/kamera, kompakt filament/AMS
- **Filament değişim süresi** maliyet tahmincisinde görünür değişim sayacıyla
- **Global uyarı sistemi** — sağ altta toast bildirimlerle uyarı çubuğu, gezinme çubuğunu engellemez
- **Rehberli tur i18n** — 14 tur anahtarının tamamı 17 dile çevrildi
- **5 yeni KB sayfası** — uyumluluk matrisi ve yeni filament kılavuzları 17 dile çevrildi
- **Tam i18n** — CRM ve simge yapı başarıları dahil 3252 anahtarın tamamı 17 dile çevrildi

## Hızlı başlangıç

| Görev | Bağlantı |
|-------|----------|
| Dashboard'u yükleyin | [Kurulum](./getting-started/installation) |
| İlk yazıcıyı yapılandırın | [Ayarlar](./getting-started/setup) |
| Bambu Cloud'a bağlanın | [Bambu Cloud](./getting-started/bambu-cloud) |
| Tüm özellikleri keşfedin | [Özellikler](./features/overview) |
| Filament kılavuzu | [Malzeme kılavuzu](./kb/filaments/guide) |
| Bakım kılavuzu | [Bakım](./kb/maintenance/nozzle) |
| API belgeleri | [API](./advanced/api) |

:::tip Demo modu
`npm run demo` çalıştırarak fiziksel bir yazıcı olmadan dashboard'u deneyebilirsiniz. Bu, canlı baskı döngüleri ile 3 simüle edilmiş yazıcı başlatır.
:::

## Desteklenen yazıcılar

LAN modundaki tüm Bambu Lab yazıcıları:

- **X1 serisi**: X1C, X1C Combo, X1E
- **P1 serisi**: P1S, P1S Combo, P1P
- **P2 serisi**: P2S, P2S Combo
- **A serisi**: A1, A1 Combo, A1 mini
- **H2 serisi**: H2S, H2D (çift nozül), H2C (alet değiştirici, 6 kafa)

## Ayrıntılı özellikler

### Filament takibi

Dashboard, filament tüketimini 4 seviyeli yedek ile otomatik olarak izler:

1. **AMS sensör farkı** — en doğru, başlangıç/bitiş remain% değerlerini karşılaştırır
2. **EXT doğrudan** — vt_tray'siz P2S/A1 için, cloud tahmini kullanır
3. **Cloud tahmini** — Bambu Cloud baskı işi verilerinden
4. **Süre tahmini** — son yedek olarak yaklaşık 30g/saat

Başarısız baskılardan sonra oluşabilecek hataları önlemek için tüm değerler, AMS sensörü ile makara veritabanının minimumu olarak gösterilir.

### Malzeme kılavuzu

15 malzeme içeren yerleşik veritabanı:
- Sıcaklıklar (nozül, tabla, hazne)
- Tabla uyumluluğu (Cool, Engineering, High Temp, Textured PEI)
- Kurutma bilgileri (sıcaklık, süre, higroskopiklik)
- 8 özellik (sağlamlık, esneklik, ısı direnci, UV, yüzey, kullanım kolaylığı)
- Zorluk derecesi ve özel gereksinimler (sertleştirilmiş nozül, muhafaza)

### Ses uyarıları

Aşağıdakileri destekleyen 9 yapılandırılabilir olay:
- **Özel ses klipleri** — MP3/OGG/WAV yükleyin (maks. 10 saniye, 500 KB)
- **Yerleşik tonlar** — Web Audio API ile oluşturulmuş metalik/synth sesler
- **Yazıcı hoparlörü** — yazıcının buzzeri'na doğrudan M300 G-code melodileri
- **Geri sayım** — baskıda 1 dakika kaldığında ses uyarısı

### Bakım

Kapsamlı bakım sistemi:
- Bileşen takibi (nozül, PTFE tüp, miller, yataklar, AMS, tabla, kurutma)
- Belgelerden KB tabanlı aralıklar
- Tipe göre nozül ömrü (pirinç, sertleştirilmiş çelik, HS01)
- Tipe göre tabla ömrü (Cool, Engineering, High Temp, Textured PEI)
- Tam belgelere ipuçları ve bağlantılar içeren kılavuz sekmesi

## Teknik genel bakış

3DPrintForge, Node.js 22 ve saf HTML/CSS/JS ile oluşturulmuştur — ağır çerçeveler yok, derleme adımı yok. Veritabanı, Node.js 22'ye entegre edilmiş SQLite'dır.

- **Backend**: yalnızca 3 npm paketiyle Node.js 22 (mqtt, ws, basic-ftp)
- **Frontend**: Saf HTML/CSS/JS, derleme adımı yok
- **Veritabanı**: Node.js 22 yerleşik `--experimental-sqlite` üzerinden SQLite
- **Belgeler**: 17 dilli Docusaurus, kurulumda otomatik derlenir
- **API**: 177+ endpoint, `/api/docs`'ta OpenAPI belgeleri

Ayrıntılar için [Mimari](./advanced/architecture) sayfasına bakın.
