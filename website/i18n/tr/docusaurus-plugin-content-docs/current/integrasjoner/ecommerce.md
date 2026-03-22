---
sidebar_position: 5
title: E-Ticaret
description: 3D baskı satışı için siparişleri, müşterileri ve faturalamayı yönetin — geektech.no'dan lisans gerektirir
---

# E-Ticaret

E-ticaret modülü, müşterileri, siparişleri ve faturalamayı yönetmek için eksiksiz bir sistem sunar — 3D baskıları profesyonel veya yarı profesyonel olarak satanlar için mükemmeldir.

Gidin: **https://localhost:3443/#orders**

:::danger E-Ticaret Lisansı Gereklidir
E-ticaret modülü geçerli bir lisans gerektirir. Lisanslar **yalnızca [geektech.no](https://geektech.no) üzerinden satın alınabilir**. Aktif lisans olmadan modül kilitlidir ve kullanılamaz.
:::

## Lisans — Satın Alma ve Aktivasyon

### Lisans Satın Alma

1. **[geektech.no](https://geektech.no)** adresine gidin ve bir hesap oluşturun
2. **Bambu Dashboard — E-Ticaret Lisansı**'nı seçin
3. Lisans türünü seçin:

| Lisans Türü | Açıklama | Yazıcılar |
|---|---|---|
| **Hobi** | Bir yazıcı, kişisel kullanım ve küçük satışlar | 1 |
| **Profesyonel** | 5 adede kadar yazıcı, ticari kullanım | 1–5 |
| **Kurumsal** | Sınırsız sayıda yazıcı, tam destek | Sınırsız |

4. Ödemeyi tamamlayın
5. E-posta ile bir **lisans anahtarı** alırsınız

### Lisans Aktivasyonu

1. Panoda **Ayarlar → E-Ticaret**'e gidin
2. **Lisans anahtarını** alana yapıştırın
3. **Lisansı Etkinleştir**'e tıklayın
4. Pano, anahtarı geektech.no sunucularına karşı doğrular
5. Başarılı aktivasyonda lisans türü, son kullanma tarihi ve yazıcı sayısı gösterilir

:::warning Lisans Anahtarı Kurulumunuza Bağlıdır
Anahtar, bir Bambu Dashboard kurulumu için etkinleştirilir. Lisansı yeni bir sunucuya taşımanız gerekiyorsa [geektech.no](https://geektech.no) ile iletişime geçin.
:::

### Lisans Doğrulaması

- Lisans başlangıçta **çevrimiçi olarak doğrulanır** ve ardından her 24 saatte bir
- Ağ kesintisinde lisans en fazla **7 gün çevrimdışı** çalışır
- Süresi dolmuş lisans → modül kilitlenir, ancak mevcut veriler korunur
- Yenileme **[geektech.no](https://geektech.no)** → Lisanslarım → Yenile üzerinden yapılır

### Lisans Durumunu Kontrol Etme

**Ayarlar → E-Ticaret**'e gidin veya API'yi çağırın:

```bash
curl -sk https://localhost:3443/api/ecom-license/status
```

Yanıt şunları içerir:
```json
{
  "active": true,
  "type": "professional",
  "expires": "2027-03-22",
  "printers": 5,
  "licensee": "Şirket Adı",
  "provider": "geektech.no"
}
```

## Müşteriler

### Müşteri Oluşturma

1. **E-Ticaret → Müşteriler**'e gidin
2. **Yeni Müşteri**'ye tıklayın
3. Doldurun:
   - **Ad / Şirket Adı**
   - **İlgili Kişi** (şirketler için)
   - **E-posta adresi**
   - **Telefon**
   - **Adres** (fatura adresi)
   - **Vergi numarası / Kimlik numarası** (isteğe bağlı, KDV mükellefleri için)
   - **Not** — dahili not
4. **Oluştur**'a tıklayın

### Müşteri Genel Bakışı

Müşteri listesi şunları gösterir:
- Ad ve iletişim bilgileri
- Toplam sipariş sayısı
- Toplam gelir
- Son sipariş tarihi
- Durum (Aktif / Pasif)

Tüm sipariş ve fatura geçmişini görmek için bir müşteriye tıklayın.

## Sipariş Yönetimi

### Sipariş Oluşturma

1. **E-Ticaret → Siparişler**'e gidin
2. **Yeni Sipariş**'e tıklayın
3. Listeden **Müşteri** seçin
4. Sipariş satırları ekleyin:
   - Dosya kütüphanesinden dosya/model seçin veya serbest metin girişi ekleyin
   - Adet ve birim fiyatını belirtin
   - Projeye bağlıysa sistem maliyeti otomatik olarak hesaplar
5. **Teslim Tarihi**'ni belirtin (tahmini)
6. **Sipariş Oluştur**'a tıklayın

### Sipariş Durumu

| Durum | Açıklama |
|---|---|
| Talep | Talep alındı, onaylanmadı |
| Onaylandı | Müşteri onayladı |
| Üretimde | Baskılar devam ediyor |
| Teslime Hazır | Tamamlandı, teslim/gönderim bekliyor |
| Teslim Edildi | Sipariş tamamlandı |
| İptal Edildi | Müşteri veya siz tarafından iptal edildi |

Siparişe tıklayarak durumu güncelleyin → **Durumu Değiştir**.

### Baskıları Siparişe Bağlama

1. Siparişi açın
2. **Baskı Bağla**'ya tıklayın
3. Geçmişten baskıları seçin (çoklu seçim desteklenir)
4. Maliyet verileri baskı geçmişinden otomatik olarak alınır

## Faturalama

Ayrıntılı faturalama dokümantasyonu için [Projeler → Faturalama](../funksjoner/projects#fakturering) sayfasına bakın.

Fatura doğrudan bir siparişten oluşturulabilir:

1. Siparişi açın
2. **Fatura Oluştur**'a tıklayın
3. Tutarı ve KDV'yi kontrol edin
4. PDF'yi indirin veya müşterinin e-postasına gönderin

### Fatura Numarası Serisi

**Ayarlar → E-Ticaret** altında fatura numarası serisi ayarlayın:
- **Önek**: örn. `2026-`
- **Başlangıç numarası**: örn. `1001`
- Fatura numarası otomatik olarak artan sırada atanır

## Raporlama ve Vergiler

### Ücret Raporlaması

Sistem tüm işlem ücretlerini takip eder:
- **E-Ticaret → Ücretler** altında ücretleri görün
- Muhasebe amaçları için ücretleri raporlandı olarak işaretleyin
- Dönem başına ücret özetini dışa aktarın

### İstatistikler

**E-Ticaret → İstatistikler** altında:
- Aylık gelir (sütun grafiği)
- Gelire göre en iyi müşteriler
- En çok satılan modeller/malzemeler
- Ortalama sipariş büyüklüğü

Muhasebe sistemine aktarmak için CSV'ye dışa aktarın.

## Destek ve İletişim

:::info Yardıma mı İhtiyacınız Var?
- **Lisans soruları**: [geektech.no](https://geektech.no) desteğiyle iletişime geçin
- **Teknik sorunlar**: [GitHub Issues](https://github.com/skynett81/bambu-dashboard/issues)
- **Özellik istekleri**: [GitHub Discussions](https://github.com/skynett81/bambu-dashboard/discussions)
:::
