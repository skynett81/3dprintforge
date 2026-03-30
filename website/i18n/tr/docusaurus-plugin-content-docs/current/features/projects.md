---
sidebar_position: 9
title: Projeler
description: Baskıları projelerde düzenleyin, maliyetleri takip edin, fatura oluşturun ve projeleri müşterilerle paylaşın
---

# Projeler

Projeler, ilgili baskıları gruplandırmanıza, malzeme maliyetlerini takip etmenize, müşterilere fatura kesmenize ve çalışmalarınızın bir özetini paylaşmanıza olanak tanır.

Gidin: **https://localhost:3443/#projects**

## Proje Oluşturma

1. **Yeni Proje**'ye tıklayın (+ simgesi)
2. Doldurun:
   - **Proje adı** — açıklayıcı ad (maksimum 100 karakter)
   - **Müşteri** — isteğe bağlı müşteri hesabı ([E-ticaret](../integrations/ecommerce) sayfasına bakın)
   - **Açıklama** — kısa metin açıklaması
   - **Renk** — görsel tanımlama için bir renk seçin
   - **Etiketler** — virgülle ayrılmış anahtar kelimeler
3. **Proje Oluştur**'a tıklayın

## Baskıları Projeye Bağlama

### Baskı Sırasında

1. Baskı devam ederken dashboard'u açın
2. Yan panelde **Projeye Bağla**'ya tıklayın
3. Mevcut projeyi seçin veya yeni oluşturun
4. Baskı tamamlandığında otomatik olarak projeye bağlanır

### Geçmişten

1. **Geçmiş**'e gidin
2. İlgili baskıyı bulun
3. Baskıya tıklayın → **Projeye Bağla**
4. Açılır listeden proje seçin

### Toplu Bağlama

1. Geçmişte onay kutularıyla birden fazla baskı seçin
2. **Eylemler → Projeye Bağla**'ya tıklayın
3. Projeyi seçin — seçilen tüm baskılar bağlanır

## Maliyet Genel Bakışı

Her proje, şunlara göre toplam maliyeti hesaplar:

| Maliyet Türü | Kaynak |
|---|---|
| Filament tüketimi | Gram × malzeme başına gram fiyatı |
| Elektrik | kWh × elektrik fiyatı (Tibber/Nordpool yapılandırıldıysa) |
| Makine aşınması | [Aşınma Tahmini](../monitoring/wearprediction)'nden hesaplanmış |
| Manuel maliyet | Manuel olarak eklediğiniz serbest metin kalemleri |

Maliyet genel bakışı, baskı başına ve toplam olarak tablo ve pasta grafiği olarak gösterilir.

:::tip Saatlik fiyatlar
Her baskı için doğru elektrik maliyetleri için Tibber veya Nordpool entegrasyonunu etkinleştirin. [Elektrik Fiyatı](../integrations/energy) sayfasına bakın.
:::

## Faturalama

1. Bir projeyi açın ve **Fatura Oluştur**'a tıklayın
2. Doldurun:
   - **Fatura tarihi** ve **vade tarihi**
   - **KDV oranı** (%0, %15, %25)
   - **Kar marjı** (%)
   - **Müşteriye not**
3. Faturayı PDF formatında önizleyin
4. **PDF İndir**'e veya **Müşteriye Gönder**'e tıklayın (e-posta ile)

Faturalar proje altında saklanır ve gönderilene kadar yeniden açılıp düzenlenebilir.

:::info Müşteri verileri
Müşteri verileri (ad, adres, vergi no.) projeye bağladığınız müşteri hesabından alınır. Müşterileri yönetmek için [E-ticaret](../integrations/ecommerce) sayfasına bakın.
:::

## Proje Durumu

| Durum | Açıklama |
|---|---|
| Aktif | Proje üzerinde çalışılıyor |
| Tamamlandı | Tüm baskılar hazır, fatura gönderildi |
| Arşivlendi | Standart görünümden gizlendi, ancak aranabilir |
| Beklemede | Geçici olarak durduruldu |

Projenin üst kısmındaki durum göstergesine tıklayarak durumu değiştirin.

## Proje Paylaşma

Projeye genel bakışı müşterilere göstermek için paylaşılabilir bir bağlantı oluşturun:

1. Proje menüsünde **Projeyi Paylaş**'a tıklayın
2. Neyin gösterileceğini seçin:
   - ✅ Baskılar ve görseller
   - ✅ Toplam filament tüketimi
   - ❌ Maliyetler ve fiyatlar (varsayılan olarak gizli)
3. Bağlantı için bitiş süresini ayarlayın
4. Bağlantıyı kopyalayın ve paylaşın

Müşteri, oturum açmadan salt okunur bir sayfa görür.
