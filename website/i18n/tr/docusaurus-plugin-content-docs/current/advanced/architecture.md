---
sidebar_position: 2
title: Teknik Mimari
description: 3DPrintForge için mimari genel bakış — yığın, modüller, veritabanı ve WebSocket
---

# Teknik Mimari

## Sistem Diyagramı

```
Tarayıcı <──WebSocket──> Node.js <──MQTTS:8883──> Yazıcı
Tarayıcı <──WS:9001+──> ffmpeg  <──RTSPS:322───> Kamera
```

Pano, yazıcıyla TLS üzerinden MQTT (port 8883) ve kamerayla RTSPS (port 322) aracılığıyla iletişim kurar. Tarayıcı, panoya HTTPS ve WebSocket üzerinden bağlanır.

## Teknik Yığın

| Katman | Teknoloji |
|-----|-----------|
| Frontend | Vanilla HTML/CSS/JS — 76 bileşen modülü, derleme adımı yok, çerçeve yok |
| Backend | Node.js 22, 3 npm paketi: `mqtt`, `ws`, `basic-ftp` |
| Veritabanı | SQLite (Node.js 22'de `--experimental-sqlite` aracılığıyla yerleşik) |
| Kamera | ffmpeg RTSPS'yi MPEG1'e dönüştürür, jsmpeg tarayıcıda render eder |
| Gerçek zamanlı | WebSocket hub, yazıcı durumunu tüm bağlı istemcilere yayınlar |
| Protokol | Yazıcının LAN Erişim Koduyla TLS üzerinden MQTT (port 8883) |

## Portlar

| Port | Protokol | Yön | Açıklama |
|------|-----------|---------|-------------|
| 3000 | HTTP + WS | Gelen | Pano (HTTPS'ye yönlendirir) |
| 3443 | HTTPS + WSS | Gelen | Güvenli pano (standart) |
| 9001+ | WS | Gelen | Kamera akışları (yazıcı başına bir) |
| 8883 | MQTTS | Giden | Yazıcıya bağlantı |
| 322 | RTSPS | Giden | Yazıcıdan kamera |

## Sunucu Modülleri (44)

| Modül | Amaç |
|-------|--------|
| `index.js` | HTTP/HTTPS sunucuları, otomatik SSL, CSP/HSTS başlıkları, statik dosyalar, demo modu |
| `config.js` | Yapılandırma yükleme, varsayılan değerler, env geçersiz kılmaları ve taşımalar |
| `database.js` | SQLite şeması, 105 taşıma, CRUD işlemleri |
| `api-routes.js` | REST API (284+ uç nokta) |
| `auth.js` | Kimlik doğrulama ve oturum yönetimi |
| `backup.js` | Yedekleme ve geri yükleme |
| `printer-manager.js` | Yazıcı yaşam döngüsü, MQTT bağlantı yönetimi |
| `mqtt-client.js` | Bambu yazıcılara MQTT bağlantısı |
| `mqtt-commands.js` | MQTT komut oluşturma (duraklat, devam et, durdur vb.) |
| `websocket-hub.js` | Tüm tarayıcı istemcilerine WebSocket yayını |
| `camera-stream.js` | Kamera akışları için ffmpeg işlem yönetimi |
| `print-tracker.js` | Baskı işi takibi, durum geçişleri, geçmiş günlüğü |
| `print-guard.js` | xcam + sensör izleme aracılığıyla baskı koruması |
| `queue-manager.js` | Çok yazıcılı gönderim ve yük dengeleme ile baskı kuyruğu |
| `slicer-service.js` | Yerel dilimleyici CLI köprüsü, dosya yükleme, FTPS yükleme |
| `telemetry.js` | Telemetri veri işleme |
| `telemetry-sampler.js` | Zaman serisi veri örnekleme |
| `thumbnail-service.js` | Yazıcı SD'sinden FTPS aracılığıyla küçük resim alma |
| `timelapse-service.js` | Timelapse kayıt ve yönetimi |
| `notifications.js` | 7 kanallı bildirim sistemi (Telegram, Discord, E-posta, Webhook, ntfy, Pushover, SMS) |
| `updater.js` | Yedeklemeli GitHub Releases otomatik güncelleyici |
| `setup-wizard.js` | İlk kullanım için web tabanlı kurulum sihirbazı |
| `ecom-license.js` | Lisans yönetimi |
| `failure-detection.js` | Hata tespiti ve analizi |
| `bambu-cloud.js` | Bambu Cloud API entegrasyonu |
| `bambu-rfid-data.js` | AMS'den RFID filament verileri |
| `circuit-breaker.js` | Hizmet kararlılığı için devre kesici deseni |
| `energy-service.js` | Enerji ve elektrik fiyatı hesaplama |
| `error-pattern-analyzer.js` | HMS hatalarının desen analizi |
| `file-parser.js` | 3MF/GCode dosya ayrıştırma |
| `logger.js` | Yapılandırılmış günlük kaydı |
| `material-recommender.js` | Malzeme önerileri |
| `milestone-service.js` | Kilometre taşı ve başarım takibi |
| `plugin-manager.js` | Uzantılar için eklenti sistemi |
| `power-monitor.js` | Güç ölçer entegrasyonu (Shelly/Tasmota) |
| `price-checker.js` | Elektrik fiyatı getirme (Tibber/Nordpool) |
| `printer-discovery.js` | LAN'da otomatik yazıcı keşfi |
| `remote-nodes.js` | Çok düğümlü yönetim |
| `report-service.js` | Rapor oluşturma |
| `seed-filament-db.js` | Filament veritabanı tohumlama |
| `spoolease-data.js` | SpoolEase entegrasyonu |
| `validate.js` | Girdi doğrulama |
| `wear-prediction.js` | Bileşenler için aşınma tahmini |

## Frontend Bileşenleri (76)

Tüm bileşenler, derleme adımı olmayan vanilla JavaScript modülleridir. Tarayıcıya doğrudan `<script type="module">` aracılığıyla yüklenir.

| Bileşen | Amaç |
|-----------|--------|
| `print-preview.js` | 3D model görüntüleyici + MakerWorld görüntü gösterimi |
| `model-viewer.js` | Katman animasyonlu WebGL 3D render |
| `temperature-gauge.js` | Animasyonlu SVG halka göstergeleri |
| `sparkline-stats.js` | Grafana tarzı istatistik panelleri |
| `ams-panel.js` | AMS filament görselleştirme |
| `camera-view.js` | Tam ekranlı jsmpeg video oynatıcı |
| `controls-panel.js` | Yazıcı kontrol kullanıcı arayüzü |
| `history-table.js` | Arama, filtreler, CSV dışa aktarma ile baskı geçmişi |
| `filament-tracker.js` | Favoriler, renk filtreleme ile filament deposu |
| `queue-panel.js` | Baskı kuyruğu yönetimi |
| `knowledge-panel.js` | Bilgi tabanı okuyucu ve düzenleyici |

## Veritabanı

SQLite veritabanı, Node.js 22'ye yerleşiktir ve harici kurulum gerektirmez. Şema, `db/migrations.js` içindeki 105 taşıma tarafından yönetilir.

Ana veritabanı tabloları:

- `printers` — yazıcı yapılandırması
- `print_history` — tüm baskı işleri
- `filaments` — filament deposu
- `ams_slots` — AMS slot bağlantısı
- `queue` — baskı kuyruğu
- `notifications_config` — bildirim ayarları
- `maintenance_log` — bakım günlüğü

## Güvenlik

- Otomatik oluşturulan sertifika (veya kendi sertifikanız) ile HTTPS
- JWT tabanlı kimlik doğrulama
- CSP ve HSTS başlıkları
- Hız sınırlaması (200 istek/dakika)
- Çekirdek işlevler için harici bulut bağımlılığı yok
