---
sidebar_position: 1
title: Özellikler Genel Bakış
description: Bambu Dashboard'daki tüm özelliklerin tam genel bakışı
---

# Özellikler Genel Bakış

Bambu Dashboard, Bambu Lab yazıcılarınızı izlemek ve yönetmek için ihtiyacınız olan her şeyi tek bir yerde toplar.

## Dashboard

Ana dashboard, aktif yazıcının gerçek zamanlı durumunu gösterir:

- **Sıcaklık** — nozül ve tabla için animasyonlu SVG halka göstergeleri
- **İlerleme** — tahmini tamamlanma süresiyle yüzde bazlı ilerleme
- **Kamera** — canlı kamera görüntüsü (ffmpeg üzerinden RTSPS → MPEG1)
- **AMS paneli** — tüm AMS yuvalarının filament renkleriyle görsel gösterimi
- **Hız kontrolü** — hızı ayarlamak için kaydırma çubuğu (Sessiz, Standart, Spor, Turbo)
- **İstatistik panelleri** — kaydırma grafiklerle Grafana tarzı paneller
- **Telemetri** — fanlar, sıcaklıklar, basınç için canlı değerler

Paneller, düzeni özelleştirmek için sürükle-bırak ile taşınabilir. Düzeni kilitlemek için kilit düğmesini kullanın.

## Filament Deposu

Tam dokümantasyon için [Filament](./filament) sayfasına bakın.

- Tüm makaraları ad, renk, ağırlık ve tedarikçiyle takip edin
- AMS senkronizasyonu — AMS'deki makaraları görün
- Kurutma kaydı ve kurutma planı
- Renk kartı ve NFC etiket desteği
- İçe/dışa aktarma (CSV)

## Baskı Geçmişi

Tam dokümantasyon için [Geçmiş](./historikk) sayfasına bakın.

- Tüm baskıların eksiksiz kaydı
- Baskı başına filament takibi
- MakerWorld modellerine bağlantılar
- İstatistikler ve CSV'ye aktarma

## Zamanlayıcı

Tam dokümantasyon için [Zamanlayıcı](./scheduler) sayfasına bakın.

- Baskıların takvim görünümü
- Öncelikli baskı kuyruğu
- Çoklu yazıcıya dağıtım

## Yazıcı Kontrolü

Tam dokümantasyon için [Kontrol](./controls) sayfasına bakın.

- Sıcaklık kontrolü (nozül, tabla, kamera)
- Hız profili kontrolü
- Fan kontrolü
- G-code konsolu
- Filament yükleme/boşaltma

## Bildirimler

Bambu Dashboard 7 bildirim kanalını destekler:

| Kanal | Olaylar |
|-------|----------|
| Telegram | Baskı tamamlandı, hata, duraklama |
| Discord | Baskı tamamlandı, hata, duraklama |
| E-posta | Baskı tamamlandı, hata |
| ntfy | Tüm olaylar |
| Pushover | Tüm olaylar |
| SMS (Twilio) | Kritik hatalar |
| Webhook | Özel yük |

**Ayarlar → Bildirimler**'den yapılandırın.

## Print Guard

Print Guard, kamera (xcam) ve sensörler aracılığıyla aktif baskıyı izler:

- Spagetti hatalarında otomatik duraklama
- Yapılandırılabilir hassasiyet seviyesi
- Algılanan olayların kaydı

## Bakım

Bakım bölümü şunları takip eder:

- Bileşen başına önerilen sonraki servis (nozül, tablalar, AMS)
- Baskı geçmişine dayalı aşınma takibi
- Bakım görevlerinin manuel kaydı

## Çok Yazıcılı

Çoklu yazıcı desteğiyle şunları yapabilirsiniz:

- Tek bir dashboard'dan birden fazla yazıcı yönetme
- Yazıcı seçiciyle yazıcılar arasında geçiş yapma
- Tüm yazıcıların durumunu aynı anda görme
- Baskı işlerini baskı kuyruğuyla dağıtma

## OBS Overlay

Özel bir `obs.html` sayfası, baskıların canlı yayını sırasında OBS Studio entegrasyonu için temiz bir overlay sağlar.

## Güncellemeler

GitHub Releases üzerinden yerleşik otomatik güncelleme. **Ayarlar → Güncelleme** altından doğrudan dashboard'dan bildirim ve güncelleme yapın.
