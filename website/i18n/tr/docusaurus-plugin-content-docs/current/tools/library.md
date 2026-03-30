---
sidebar_position: 2
title: Dosya Kütüphanesi
description: 3D modelleri ve G-kodu dosyalarını yükleyin ve yönetin, G-kodunu analiz edin ve MakerWorld ile Printables'a bağlayın
---

# Dosya Kütüphanesi

Dosya kütüphanesi, tüm 3D modellerinizi ve G-kodu dosyalarınızı depolamak ve yönetmek için merkezi bir yerdir — otomatik G-kodu analizi ve MakerWorld ile Printables entegrasyonuyla.

Gidin: **https://localhost:3443/#library**

## Model Yükleme

### Tek Yükleme

1. **Dosya Kütüphanesi**'ne gidin
2. **Yükle**'ye tıklayın veya dosyaları yükleme alanına sürükleyin
3. Desteklenen formatlar: `.3mf`, `.gcode`, `.bgcode`, `.stl`, `.obj`
4. Dosya yüklemeden sonra otomatik olarak analiz edilir

:::info Depolama Klasörü
Dosyalar, **Ayarlar → Dosya Kütüphanesi → Depolama Klasörü** altında yapılandırılan klasörde saklanır. Varsayılan: `./data/library/`
:::

### Toplu Yükleme

Desteklenen tüm dosyaları bir kerede yüklemek için bir klasörün tamamını sürükleyip bırakın. Dosyalar arka planda işlenir ve her şey hazır olduğunda bildirim alırsınız.

## G-Kodu Analizi

Yüklemeden sonra `.gcode` ve `.bgcode` dosyaları otomatik olarak analiz edilir:

| Metrik | Açıklama |
|---|---|
| Tahmini baskı süresi | G-kodu komutlarından hesaplanan süre |
| Filament tüketimi | Malzeme/renk başına gram ve metre |
| Katman sayısı | Toplam katman sayısı |
| Katman kalınlığı | Kayıtlı katman kalınlığı |
| Malzemeler | Tespit edilen malzemeler (PLA, PETG vb.) |
| Dolgu yüzdesi | Meta veride mevcutsa |
| Destek malzemesi | Tahmini destek ağırlığı |
| Yazıcı modeli | Meta veriden hedef yazıcı |

Analiz verileri dosya kartında gösterilir ve [Maliyet Hesaplayıcı](../analytics/costestimator) tarafından kullanılır.

## Dosya Kartları ve Meta Veriler

Her dosya kartı şunları gösterir:
- **Dosya adı** ve format
- **Yüklenme tarihi**
- **Küçük resim** (`.3mf`'den veya oluşturulmuş)
- **Analiz edilen baskı süresi** ve filament tüketimi
- **Etiketler** ve kategori
- **İlişkili baskılar** — kaç kez yazdırıldığı

Tam meta veri ve geçmişle ayrıntı görünümünü açmak için bir karta tıklayın.

## Organizasyon

### Etiketler

Kolay arama için etiketler ekleyin:
1. Dosyaya tıklayın → **Meta Verileri Düzenle**
2. Etiketleri girin (virgülle ayrılmış): `benchy, test, PLA, kalibrasyon`
3. Etiket filtresini kullanarak kütüphanede arama yapın

### Kategoriler

Dosyaları kategorilere göre düzenleyin:
- Kenar çubuğunda **Yeni Kategori**'ye tıklayın
- Dosyaları kategoriye sürükleyin
- Kategoriler iç içe geçebilir (alt kategoriler desteklenir)

## MakerWorld'e Bağlama

1. **Ayarlar → Entegrasyonlar → MakerWorld**'e gidin
2. Bambu Lab hesabınızla giriş yapın
3. Kütüphanede: bir dosyaya tıklayın → **MakerWorld'e Bağla**
4. MakerWorld'de modeli arayın ve doğru eşleşmeyi seçin
5. Meta veriler (tasarımcı, lisanslama, derecelendirme) MakerWorld'den içe aktarılır

Bağlantı, dosya kartında tasarımcı adını ve orijinal URL'yi gösterir.

## Printables'a Bağlama

1. **Ayarlar → Entegrasyonlar → Printables**'a gidin
2. Printables API anahtarınızı yapıştırın
3. MakerWorld ile aynı şekilde dosyaları Printables modellerine bağlayın

## Yazıcıya Gönderme

Dosya kütüphanesinden doğrudan yazıcıya gönderebilirsiniz:

1. Dosyaya tıklayın → **Yazıcıya Gönder**
2. Hedef yazıcıyı seçin
3. AMS slotunu seçin (çok renkli baskılar için)
4. **Baskıyı Başlat** veya **Kuyruğa Ekle**'ye tıklayın

:::warning Doğrudan Gönderim
Doğrudan gönderim, Bambu Studio'da onay olmaksızın baskıyı anında başlatır. Yazıcının hazır olduğundan emin olun.
:::
