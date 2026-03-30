---
sidebar_position: 4
title: Bakım
description: Hatırlatıcılar, aralıklar ve maliyet kaydıyla nozül değişimi, yağlama ve diğer bakım görevlerini takip edin
---

# Bakım

Bakım modülü, Bambu Lab yazıcılarınızdaki tüm bakım işlemlerini planlamanıza ve takip etmenize yardımcı olur — nozül değişiminden ray yağlamasına kadar.

Gidin: **https://localhost:3443/#maintenance**

## Bakım Planı

Bambu Dashboard, tüm Bambu Lab yazıcı modelleri için önceden yapılandırılmış bakım aralıklarıyla birlikte gelir:

| Görev | Aralık (standart) | Model |
|---|---|---|
| Nozülü temizle | Her 200 saat | Tümü |
| Nozülü değiştir (pirinç) | Her 500 saat | Tümü |
| Nozülü değiştir (sertleştirilmiş) | Her 2000 saat | Tümü |
| X eksenini yağla | Her 300 saat | X1C, P1S |
| Z eksenini yağla | Her 300 saat | Tümü |
| AMS dişli çarklarını temizle | Her 200 saat | AMS |
| Kamerayı temizle | Her 500 saat | X1C |
| PTFE borusunu değiştir | Gerektiğinde / 1000 saat | Tümü |
| Kalibrasyon (tam) | Aylık | Tümü |

Tüm aralıklar yazıcı başına özelleştirilebilir.

## Nozül Değişim Kaydı

1. **Bakım → Nozüller**'e gidin
2. **Nozül Değişimini Kaydet**'e tıklayın
3. Doldurun:
   - **Tarih** — otomatik olarak bugüne ayarlanır
   - **Nozül malzemesi** — Pirinç / Sertleştirilmiş Çelik / Bakır / Yakut Uç
   - **Nozül çapı** — 0.2 / 0.4 / 0.6 / 0.8 mm
   - **Marka/model** — isteğe bağlı
   - **Fiyat** — maliyet kaydı için
   - **Değişim anındaki saatler** — baskı süresi sayacından otomatik alınır
4. **Kaydet**'e tıklayın

Kayıt, tüm nozül geçmişini tarihe göre sıralı olarak gösterir.

:::tip Önceden Hatırlatma
Önerilen sonraki değişimden önce iyi bir süre uyarı almak için **X saat önceden Bildir**'i (ör. 50 saat) ayarlayın.
:::

## Bakım Görevi Oluşturma

1. **Yeni Görev**'e tıklayın (+ simgesi)
2. Doldurun:
   - **Görev adı** — ör. "Y Eksenini Yağla"
   - **Yazıcı** — ilgili yazıcı(lar)ı seçin
   - **Aralık türü** — Saatler / Günler / Baskı Sayısı
   - **Aralık** — ör. 300 saat
   - **Son yapıldı** — en son yapıldığında belirtin (geriye dönük tarih ayarlayın)
3. **Oluştur**'a tıklayın

## Aralıklar ve Hatırlatıcılar

Aktif görevler için gösterilir:
- **Yeşil** — bir sonraki bakıma aralığın %50'sinden fazlası kaldı
- **Sarı** — bir sonraki bakıma aralığın %50'sinden azı kaldı
- **Turuncu** — bir sonraki bakıma aralığın %20'sinden azı kaldı
- **Kırmızı** — bakım süresi geçti

### Hatırlatıcıları Yapılandırma

1. Bir göreve tıklayın → **Düzenle**
2. **Hatırlatıcılar**'ı etkinleştirin
3. **Şu kadar kaldığında Bildir**'i ayarlayın, ör. vadeye %10 kaldığında
4. Bildirim kanalını seçin ([Bildirimler](../features/notifications) sayfasına bakın)

## Tamamlandı Olarak İşaretleme

1. Listedeki görevi bulun
2. **Tamamlandı**'ya tıklayın (onay işareti simgesi)
3. Aralık bugünün tarihinden/saatinden yeniden başlar
4. Kayıt girişi otomatik olarak oluşturulur

## Maliyet Kaydı

Tüm bakım görevlerinin ilgili bir maliyeti olabilir:

- **Parçalar** — nozüller, PTFE boruları, yağlayıcılar
- **Zaman** — harcanan saatler × saatlik ücret
- **Harici servis** — ücretli tamir

Maliyetler yazıcı başına toplandı ve istatistik genel bakışında gösterilir.

## Bakım Geçmişi

Şunları görmek için **Bakım → Geçmiş**'e gidin:
- Gerçekleştirilen tüm bakım görevleri
- Tarih, saatler ve maliyet
- Kim yaptı (çok kullanıcılı sistemde)
- Yorumlar ve notlar

Muhasebe amacıyla geçmişi CSV'ye aktarın.
