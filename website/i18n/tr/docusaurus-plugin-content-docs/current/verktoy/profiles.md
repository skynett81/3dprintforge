---
sidebar_position: 3
title: Baskı Profilleri
description: Hızlı ve tutarlı yazdırma için önceden ayarlanmış baskı profilleri oluşturun, düzenleyin ve yönetin
---

# Baskı Profilleri

Baskı profilleri, baskılar ve yazıcılar genelinde yeniden kullanabileceğiniz kaydedilmiş baskı ayarları setleridir. Farklı amaçlar için profiller tanımlayarak zaman kazanın ve tutarlı kalite sağlayın.

Gidin: **https://localhost:3443/#profiles**

## Profil Oluşturma

1. **Araçlar → Baskı Profilleri**'ne gidin
2. **Yeni Profil**'e tıklayın (+ simgesi)
3. Doldurun:
   - **Profil adı** — açıklayıcı ad, örn. «PLA - Hızlı Üretim»
   - **Malzeme** — listeden seçin (PLA / PETG / ABS / PA / PC / TPU vb.)
   - **Yazıcı modeli** — X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C / Tümü
   - **Açıklama** — isteğe bağlı metin

4. Ayarları doldurun (aşağıdaki bölümlere bakın)
5. **Profili Kaydet**'e tıklayın

## Profildeki Ayarlar

### Sıcaklık
| Alan | Örnek |
|---|---|
| Nozül sıcaklığı | 220°C |
| Tabla sıcaklığı | 60°C |
| Kasa sıcaklığı (X1C) | 35°C |

### Hız
| Alan | Örnek |
|---|---|
| Hız ayarı | Standart |
| Maks. hız (mm/s) | 200 |
| İvme | 5000 mm/s² |

### Kalite
| Alan | Örnek |
|---|---|
| Katman kalınlığı | 0,2 mm |
| Dolgu yüzdesi | %15 |
| Dolgu deseni | Izgara |
| Destek malzemesi | Otomatik |

### AMS ve Renkler
| Alan | Açıklama |
|---|---|
| Temizleme hacmi | Renk değişiminde temizleme miktarı |
| Tercih edilen slotlar | Hangi AMS slotlarının tercih edildiği |

### Gelişmiş
| Alan | Açıklama |
|---|---|
| Kurutma modu | Nemli malzemeler için AMS kurutmayı etkinleştir |
| Soğuma süresi | Soğuma için katmanlar arasındaki duraklama |
| Fan hızı | Soğutma fanı hızı yüzde olarak |

## Profil Düzenleme

1. Listede profile tıklayın
2. **Düzenle**'ye tıklayın (kalem simgesi)
3. Değişiklikler yapın
4. **Kaydet** (üzerine yaz) veya **Yeni Olarak Kaydet** (bir kopya oluşturur) üzerine tıklayın

:::tip Sürümleme
Değişikliklerle denemeler yaparken çalışan bir profili korumak için «Yeni Olarak Kaydet»'i kullanın.
:::

## Profil Kullanma

### Dosya Kütüphanesinden

1. Kütüphanede dosya seçin
2. **Yazıcıya Gönder**'e tıklayın
3. Açılır listeden **Profil** seçin
4. Profildeki ayarlar kullanılır

### Baskı Kuyruğundan

1. Yeni bir kuyruk işi oluşturun
2. Ayarlar altında **Profil** seçin
3. Profil kuyruk işine bağlanır

## Profil İçe ve Dışa Aktarma

### Dışa Aktarma
1. Bir veya daha fazla profil seçin
2. **Dışa Aktar**'a tıklayın
3. Format seçin: **JSON** (diğer panolara içe aktarmak için) veya **PDF** (yazdırma/dokümantasyon için)

### İçe Aktarma
1. **Profilleri İçe Aktar**'a tıklayın
2. Başka bir Bambu Dashboard'dan dışa aktarılmış bir `.json` dosyası seçin
3. Aynı ada sahip mevcut profiller üzerine yazılabilir veya her ikisi de tutulabilir

## Profil Paylaşma

Profilleri topluluk filament modülü aracılığıyla diğerleriyle paylaşın ([Topluluk Filamentleri](../integrasjoner/community) sayfasına bakın) veya doğrudan JSON dışa aktarma yoluyla.

## Varsayılan Profil

Malzeme başına varsayılan profil ayarlayın:

1. Profili seçin
2. **[Malzeme] için Varsayılan Olarak Ayarla**'ya tıklayın
3. O malzemeyle dosya gönderdiğinizde varsayılan profil otomatik olarak seçilir
