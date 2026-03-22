---
sidebar_position: 2
title: Filament Deposu
description: Filament makaralarını, AMS senkronizasyonunu, kurutmayı ve daha fazlasını yönetin
---

# Filament Deposu

Filament deposu, AMS ve baskı geçmişiyle entegre edilmiş tüm filament makaralarına tam bir genel bakış sunar.

## Genel Bakış

Depo, tüm kayıtlı makaraları şunlarla gösterir:

- **Renk** — görsel renk kartı
- **Malzeme** — PLA, PETG, ABS, TPU, PA vb.
- **Tedarikçi** — Bambu Lab, Polymaker, eSUN vb.
- **Ağırlık** — kalan gram (tahmini veya ölçülen)
- **AMS yuvası** — makaranın hangi yuvada oturduğu
- **Durum** — aktif, boş, kurutuluyor, depolanıyor

## Makara Ekleme

1. **+ Yeni Makara**'ya tıklayın
2. Malzeme, renk, tedarikçi ve ağırlığı doldurun
3. Varsa NFC etiketini taratın veya manuel olarak girin
4. Kaydedin

:::tip Bambu Lab Makaraları
Bambu Lab'ın resmi makaraları, Bambu Cloud entegrasyonu aracılığıyla otomatik olarak içe aktarılabilir. [Bambu Cloud](../kom-i-gang/bambu-cloud) sayfasına bakın.
:::

## AMS Senkronizasyonu

Dashboard yazıcıya bağlandığında, AMS durumu otomatik olarak senkronize edilir:

- Yuvalar AMS'den doğru renk ve malzemeyle gösterilir
- Tüketim her baskıdan sonra güncellenir
- Boş makaralar otomatik olarak işaretlenir

Yerel bir makara ile AMS yuvasını bağlamak için:
1. **Filament → AMS**'e gidin
2. Bağlamak istediğiniz yuvaya tıklayın
3. Depodan makara seçin

## Kurutma

Nem maruziyetini takip etmek için kurutma döngülerini kaydedin:

| Alan | Açıklama |
|------|-------------|
| Kurutma tarihi | Makaranın ne zaman kurutulduğu |
| Sıcaklık | Kurutma sıcaklığı (°C) |
| Süre | Saat sayısı |
| Yöntem | Fırın, kurutma kutusu, filament kurutucu |

:::info Önerilen kurutma sıcaklıkları
Malzemeye özgü kurutma süreleri ve sıcaklıkları için [Bilgi Tabanı](../kb/intro) sayfasına bakın.
:::

## Renk Kartı

Renk kartı görünümü, makaraları renge göre görsel olarak düzenler. Doğru rengi hızlıca bulmak için kullanışlıdır. Malzeme, tedarikçi veya duruma göre filtreleyin.

## NFC Etiketleri

Bambu Dashboard, makaraların hızlı tanımlanması için NFC etiketlerini destekler:

1. Depodaki makaraya NFC etiket ID'sini yazın
2. Etiketi telefonunuzla taratın
3. Makara doğrudan dashboard'da açılır

## İçe ve Dışa Aktarma

### Dışa Aktarma
Tüm depoyu CSV olarak dışa aktarın: **Filament → Dışa Aktar → CSV**

### İçe Aktarma
CSV'den makara içe aktarın: **Filament → İçe Aktar → Dosya Seç**

CSV formatı:
```
ad,malzeme,renk_hex,tedarikci,agirlik_gram,nfc_id
PLA Beyaz,PLA,#FFFFFF,Bambu Lab,1000,
PETG Siyah,PETG,#000000,Polymaker,850,ABC123
```

## İstatistikler

**Filament → İstatistikler** altında şunları bulursunuz:

- Malzeme başına toplam tüketim (son 30/90/365 gün)
- Yazıcı başına tüketim
- Makara başına tahmini kalan ömür
- En çok kullanılan renkler ve tedarikçiler
