---
sidebar_position: 2
title: Elektrik Fiyatı
description: Canlı saatlik fiyatlar, fiyat geçmişi ve fiyat uyarıları için Tibber veya Nordpool'a bağlanın
---

# Elektrik Fiyatı

Elektrik fiyatı entegrasyonu, baskı başına doğru elektrik maliyeti hesaplamaları ve yazdırma için iyi veya kötü fiyat zamanları hakkında uyarılar sağlamak amacıyla Tibber veya Nordpool'dan canlı elektrik fiyatları getirir.

Gidin: **https://localhost:3443/#settings** → **Entegrasyonlar → Elektrik Fiyatı**

## Tibber Entegrasyonu

Tibber, spot fiyatları için açık API'ye sahip bir elektrik sağlayıcısıdır.

### Kurulum

1. [developer.tibber.com](https://developer.tibber.com) adresine giriş yapın
2. Bir **Kişisel Erişim Tokeni** oluşturun
3. Bambu Dashboard'da: tokeni **Tibber API Tokeni** altına yapıştırın
4. **Ev** seçin (fiyatların alınacağı yer, birden fazla eviniz varsa)
5. **Bağlantıyı Test Et**'e tıklayın
6. **Kaydet**'e tıklayın

### Tibber'dan Mevcut Veriler

- **Anlık spot fiyat** — vergiler dahil anlık fiyat (₺/kWh)
- **Sonraki 24 saatin fiyatları** — Tibber yarınki fiyatları yaklaşık 13:00'da sağlar
- **Fiyat geçmişi** — 30 güne kadar geriye dönük
- **Baskı başına maliyet** — gerçek baskı süresi × saatlik fiyatlardan hesaplanır

## Nordpool Entegrasyonu

Nordpool, İskandinav bölgesi için ham spot fiyatları sunan enerji borsasıdır.

### Kurulum

1. **Entegrasyonlar → Nordpool**'a gidin
2. **Fiyat Bölgesi** seçin: NO1 (Oslo) / NO2 (Kristiansand) / NO3 (Trondheim) / NO4 (Tromsø) / NO5 (Bergen)
3. **Para Birimi** seçin: NOK / EUR
4. **Vergi ve harçlar**'ı seçin:
   - **KDV dahil**'i işaretleyin (%25)
   - **Şebeke ücreti** girin (₺/kWh) — şebeke şirketinden fatura bakın
   - **Tüketim vergisi** girin (₺/kWh)
5. **Kaydet**'e tıklayın

:::info Şebeke Ücreti
Şebeke ücreti, şebeke şirketi ve fiyat modeline göre değişir. Doğru oranı öğrenmek için son elektrik faturanızı kontrol edin.
:::

## Saatlik Fiyatlar

Saatlik fiyatlar, sonraki 24–48 saat için bir sütun grafiği olarak gösterilir:

- **Yeşil** — ucuz saatler (ortalamanın altında)
- **Sarı** — ortalama fiyat
- **Kırmızı** — pahalı saatler (ortalamanın üzerinde)
- **Gri** — fiyat tahmini olmayan saatler

Tam fiyatı (₺/kWh) görmek için bir saatın üzerine gelin.

## Fiyat Geçmişi

Şunları görmek için **Elektrik Fiyatı → Geçmiş**'e gidin:

- Son 30 günde günlük ortalama fiyat
- Gün başına en pahalı ve en ucuz saat
- Gün başına baskıların toplam elektrik maliyeti

## Fiyat Uyarıları

Elektrik fiyatına göre otomatik uyarılar ayarlayın:

1. **Elektrik Fiyatı → Fiyat Uyarıları**'na gidin
2. **Yeni Uyarı**'ya tıklayın
3. Uyarı türünü seçin:
   - **Fiyat eşiğin altında** — elektrik fiyatı X ₺/kWh'nin altına düştüğünde uyar
   - **Fiyat eşiğin üzerinde** — fiyat X ₺/kWh'nin üzerine çıktığında uyar
   - **Bugünün en ucuz saati** — günün en ucuz saati başladığında uyar
4. Bildirim kanalını seçin
5. **Kaydet**'e tıklayın

:::tip Akıllı Planlama
Fiyat uyarılarını baskı kuyruğuyla birleştirin: elektrik fiyatı düşük olduğunda kuyruk işlerini otomatik olarak gönderen bir otomasyon ayarlayın (webhook entegrasyonu veya Home Assistant gerektirir).
:::

## Maliyet Hesaplayıcıda Elektrik Fiyatı

Etkin elektrik fiyatı entegrasyonu, [Maliyet Hesaplayıcı](../analyse/costestimator)'da doğru elektrik maliyetleri sağlar. Mevcut Tibber/Nordpool fiyatını kullanmak için sabit fiyat yerine **Canlı Fiyat**'ı seçin.
