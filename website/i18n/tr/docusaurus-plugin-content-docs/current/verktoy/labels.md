---
sidebar_position: 1
title: Etiketler
description: Filament deposu için termal yazıcılar (ZPL), renk kartları ve paylaşılan renk paletleri için QR kodları, makara etiketleri oluşturun
---

# Etiketler

Etiket aracı, filament makaralarınız için profesyonel etiketler oluşturur — QR kodları, termal yazıcılar için makara etiketleri ve görsel tanımlama için renk kartları.

Gidin: **https://localhost:3443/#labels**

## QR Kodları

Panodaki filament bilgilerine bağlantı veren QR kodları oluşturun:

1. **Etiketler → QR Kodları**'na gidin
2. QR kodu oluşturmak istediğiniz makara seçin
3. QR kodu otomatik olarak oluşturulur ve önizlemede gösterilir
4. **PNG'yi İndir** veya **Yazdır**'a tıklayın

QR kodu, panodaki filament profiline bir URL içerir. Makara bilgilerine hızlı erişmek için telefonunuzla tarayın.

### Toplu Oluşturma

1. **Tümünü Seç**'e tıklayın veya tek tek makaraları işaretleyin
2. **Tüm QR Kodlarını Oluştur**'a tıklayın
3. Makara başına bir PNG içeren ZIP olarak indirin veya hepsini bir kerede yazdırın

## Makara Etiketleri

Tam makara bilgisiyle termal yazıcılar için profesyonel etiketler:

### Etiket İçeriği (standart)

- Makara rengi (dolu renk bloğu)
- Malzeme adı (büyük yazı)
- Tedarikçi
- Renk onaltılık kodu
- Sıcaklık önerileri (nozül ve tabla)
- QR kodu
- Barkod (isteğe bağlı)

### Termal Yazıcılar için ZPL

Zebra, Brother ve Dymo yazıcılar için ZPL kodu (Zebra Programlama Dili) oluşturun:

1. **Etiketler → Termal Yazdırma**'ya gidin
2. Etiket boyutunu seçin: **25×54 mm** / **36×89 mm** / **62×100 mm**
3. Makara(ları) seçin
4. **ZPL Oluştur**'a tıklayın
5. ZPL kodunu yazıcıya şu şekilde gönderin:
   - **Doğrudan yazdır** (USB bağlantısı)
   - **ZPL'yi kopyalayın** ve terminal komutuyla gönderin
   - **.zpl dosyasını indirin**

:::tip Yazıcı Kurulumu
Otomatik yazdırma için, yazıcı istasyonunu **Ayarlar → Etiket Yazıcısı** altında IP adresi ve port ile yapılandırın (standart: RAW TCP için 9100).
:::

### PDF Etiketleri

Normal yazıcılar için doğru boyutlarda PDF oluşturun:

1. Şablondan etiket boyutunu seçin
2. **PDF Oluştur**'a tıklayın
3. Yapışkanlı kağıda yazdırın (Avery veya benzeri)

## Renk Kartları

Renk kartı, tüm makaraları görsel olarak gösteren kompakt bir ızgaradır:

1. **Etiketler → Renk Kartları**'na gidin
2. Hangi makaraların dahil edileceğini seçin (tüm aktif veya manuel seçim)
3. Kart formatını seçin: **A4** (4×8), **A3** (6×10), **Letter**
4. **PDF Oluştur**'a tıklayın

Her alan şunları gösterir:
- Gerçek rengiyle renk bloğu
- Malzeme adı ve renk onaltılık kodu
- Malzeme numarası (hızlı referans için)

Yazıcı istasyonunun yanına laminelayıp asmak için idealdir.

## Paylaşılan Renk Paletleri

Seçilmiş renkleri paylaşılan bir palet olarak dışa aktarın:

1. **Etiketler → Renk Paletleri**'ne gidin
2. Palete dahil edilecek makaraları seçin
3. **Paleti Paylaş**'a tıklayın
4. Bağlantıyı kopyalayın — diğerleri paleti kendi panolarına içe aktarabilir
5. Palet onaltılık kodlarla gösterilir ve **Adobe Swatch** (`.ase`) veya **Procreate** (`.swatches`) olarak dışa aktarılabilir
