---
sidebar_position: 6
title: Kiosk Modu
description: Bambu Dashboard'u kiosk modu ve otomatik döndürme ile duvara monte ekran veya hub görünümü olarak ayarlayın
---

# Kiosk Modu

Kiosk modu, yazıcı durumunu sürekli gösteren duvara monte ekranlar, TV'ler veya özel monitörler için tasarlanmıştır — klavye, fare etkileşimi veya tarayıcı arayüzü olmadan.

Gidin: **https://localhost:3443/#settings** → **Sistem → Kiosk**

## Kiosk Modu Nedir

Kiosk modunda:
- Gezinme menüsü gizlenir
- Hiçbir interaktif kontrol görünmez
- Pano otomatik olarak güncellenir
- Ekran yazıcılar arasında döner (yapılandırılmışsa)
- Hareketsizlik zaman aşımı devre dışıdır

## URL ile Kiosk Modunu Etkinleştirme

Ayarları değiştirmeden kiosk modunu etkinleştirmek için URL'ye `?kiosk=true` ekleyin:

```
https://localhost:3443/?kiosk=true
https://localhost:3443/#fleet?kiosk=true
```

Parametreyi kaldırarak veya `?kiosk=false` ekleyerek kiosk modunu devre dışı bırakın.

## Kiosk Ayarları

1. **Ayarlar → Sistem → Kiosk**'a gidin
2. Yapılandırın:

| Ayar | Varsayılan Değer | Açıklama |
|---|---|---|
| Varsayılan görünüm | Filo Genel Bakışı | Hangi sayfanın gösterileceği |
| Döndürme aralığı | 30 saniye | Döndürmede yazıcı başına süre |
| Döndürme modu | Yalnızca aktif | Yalnızca aktif yazıcılar arasında döndür |
| Tema | Koyu | Ekranlar için önerilen |
| Yazı tipi boyutu | Büyük | Uzaktan okunabilir |
| Saat göstergesi | Kapalı | Köşede saat göster |

## Kiosk için Filo Görünümü

Filo genel bakışı kiosk için optimize edilmiştir:

```
https://localhost:3443/#fleet?kiosk=true&cols=3&size=large
```

Filo görünümü parametreleri:
- `cols=N` — sütun sayısı (1–6)
- `size=small|medium|large` — kart boyutu

## Tek Yazıcı Döndürme

Tek yazıcılar arasında döndürme için (bir seferde bir yazıcı):

```
https://localhost:3443/?kiosk=true&rotate=true&interval=20
```

- `rotate=true` — döndürmeyi etkinleştir
- `interval=N` — yazıcı başına saniye

## Raspberry Pi / NUC Kurulumu

Özel kiosk donanımı için:

### Chromium Kiosk Modunda (Linux)

```bash
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --app="https://localhost:3443/?kiosk=true"
```

Komutu otomatik başlatmaya ekleyin (`~/.config/autostart/bambu-kiosk.desktop`).

### Otomatik Giriş ve Başlatma

1. İşletim sisteminde otomatik girişi yapılandırın
2. Chromium için bir otomatik başlatma girişi oluşturun
3. Ekran koruyucuyu ve enerji tasarrufunu devre dışı bırakın:
   ```bash
   xset s off
   xset -dpms
   xset s noblank
   ```

:::tip Özel Kullanıcı Hesabı
Kiosk cihazı için **Misafir** rolüyle özel bir Bambu Dashboard kullanıcı hesabı oluşturun. Bu sayede cihaz yalnızca okuma erişimine sahip olur ve biri ekrana erişse bile ayarları değiştiremez.
:::

## Hub Ayarları

Hub modu, tüm yazıcıları ve temel istatistikleri içeren bir genel bakış sayfası gösterir — büyük TV'ler için tasarlanmıştır:

```
https://localhost:3443/#hub?kiosk=true
```

Hub görünümü şunları içerir:
- Durumlu yazıcı ızgarası
- Toplu temel ölçümler (aktif baskılar, toplam ilerleme)
- Saat ve tarih
- Son HMS uyarıları
