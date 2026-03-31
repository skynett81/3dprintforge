---
sidebar_position: 3
title: Güç Ölçümü
description: Shelly veya Tasmota akıllı fiş ile baskı başına gerçek güç tüketimini ölçün ve maliyet genel bakışına bağlayın
---

# Güç Ölçümü

Yazdırma başına yalnızca tahminleri değil, gerçek güç tüketimini günlüğe kaydetmek için yazıcıya enerji ölçümlü bir akıllı fiş bağlayın.

Gidin: **https://localhost:3443/#settings** → **Entegrasyonlar → Güç Ölçümü**

## Desteklenen Cihazlar

| Cihaz | Protokol | Öneri |
|---|---|---|
| **Shelly Plug S / Plus Plug S** | HTTP REST / MQTT | Önerilen — kolay kurulum |
| **Shelly 1PM / 2PM** | HTTP REST / MQTT | Sabit montaj kurulumu için |
| **Shelly Gen2 / Gen3** | HTTP REST / MQTT | Genişletilmiş API ile daha yeni modeller |
| **Tasmota cihazları** | MQTT | Özel yapım kurulumlar için esnek |

:::tip Önerilen Cihaz
Shelly Plug S Plus üretici yazılımı 1.0+ ile test edilmiş ve önerilmiştir. Bulut bağımlılığı olmadan Wi-Fi, MQTT ve HTTP REST'i destekler.
:::

## Shelly ile Kurulum

### Ön Koşullar

- Shelly fişi 3DPrintForge ile aynı ağa bağlı
- Shelly, statik IP veya DHCP rezervasyonuyla yapılandırılmış

### Yapılandırma

1. **Ayarlar → Güç Ölçümü**'ne gidin
2. **Güç Ölçer Ekle**'ye tıklayın
3. **Tür** seçin: Shelly
4. Doldurun:
   - **IP adresi**: örn. `192.168.1.150`
   - **Kanal**: 0 (tek çıkışlı fişler için)
   - **Kimlik doğrulama**: yapılandırılmışsa kullanıcı adı ve şifre
5. **Bağlantıyı Test Et**'e tıklayın
6. Fişi bir **Yazıcıya** bağlayın: açılır listeden seçin
7. **Kaydet**'e tıklayın

### Yoklama Aralığı

Varsayılan yoklama aralığı 10 saniyedir. Daha doğru ölçümler için 5'e düşürün, düşük ağ yükü için 30'a yükseltin.

## Tasmota ile Kurulum

1. Tasmota cihazını MQTT ile yapılandırın (Tasmota belgelerine bakın)
2. 3DPrintForge'da: **Tür** olarak Tasmota seçin
3. Cihaz için MQTT topic'ini girin: örn. `tasmota/power-plug-1`
4. Yazıcıya bağlayın ve **Kaydet**'e tıklayın

3DPrintForge, güç ölçümleri için `{topic}/SENSOR`'a otomatik olarak abone olur.

## Ne Ölçülür

Güç ölçümü etkinleştirildiğinde baskı başına şunlar günlüğe kaydedilir:

| Metrik | Açıklama |
|---|---|
| **Anlık güç** | Yazdırma sırasında Watt (canlı) |
| **Toplam enerji tüketimi** | Tüm baskı için kWh |
| **Ortalama güç** | kWh / baskı süresi |
| **Enerji maliyeti** | kWh × elektrik fiyatı (Tibber/Nordpool'dan) |

Veriler baskı geçmişinde saklanır ve analiz için kullanılabilir.

## Canlı Görünüm

Anlık güç tüketimi şuralarda gösterilir:

- **Pano** — ekstra widget olarak (widget ayarlarında etkinleştirin)
- **Filo genel bakışı** — yazıcı kartında küçük bir gösterge olarak

## Tahminle Karşılaştırma

Baskıdan sonra bir karşılaştırma gösterilir:

| | Tahmini | Gerçek |
|---|---|---|
| Enerji tüketimi | 1,17 kWh | 1,09 kWh |
| Elektrik maliyeti | 2,16 ₺ | 2,02 ₺ |
| Sapma | — | -%6,8 |

Tutarlı sapma, [Maliyet Hesaplayıcı](../analytics/costestimator)'daki tahminleri kalibre etmek için kullanılabilir.

## Yazıcıyı Otomatik Olarak Kapatma

Shelly/Tasmota, baskı bittikten sonra yazıcıyı otomatik olarak kapatabilir:

1. **Güç Ölçümü → [Yazıcı] → Otomatik Kapatma**'ya gidin
2. **Baskı bittikten X dakika sonra kapat**'ı etkinleştirin
3. Zaman gecikmesini ayarlayın (örn. 10 dakika)

:::danger Soğuma
Güç kesilmeden önce yazıcının baskı bittikten sonra en az 5–10 dakika soğumasına izin verin. Hotend'de ısı kaymasını önlemek için nozülün 50°C'nin altına soğuması gerekir.
:::
