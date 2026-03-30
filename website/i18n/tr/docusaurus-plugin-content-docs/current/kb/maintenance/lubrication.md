---
sidebar_position: 4
title: Yağlama
description: Bambu Lab yazıcıları için doğrusal miller, kızaklar ve yağlama aralıkları
---

# Yağlama

Hareketli parçaların doğru yağlanması aşınmayı azaltır, gürültü seviyesini düşürür ve hassas hareketi sağlar. Bambu Lab yazıcıları, periyodik yağlama gerektiren doğrusal hareket sistemleri kullanır.

## Yağlama Türleri

| Bileşen | Yağlama Türü | Ürün |
|---------|-------------|------|
| Doğrusal miller (XY) | Hafif makine yağı veya PTFE spreyi | 3-in-1, Super Lube |
| Z ekseni kurşun vida | Kalın gres | Super Lube gres |
| Doğrusal kızaklar | Hafif lityum gres | Bambu Lab gres |
| Kablo zinciri eklemleri | Yok (kuru) | — |

## Doğrusal Miller

### X ve Y Ekseni
Miller, doğrusal kızaklardan kayan sertleştirilmiş çelik çubuklardır:

```
Aralık: Her 200–300 saatte bir veya gıcırtılı sesler çıktığında
Miktar: Çok az — çubuk başına bir damla yeterlidir
Yöntem:
1. Yazıcıyı kapatın
2. Arabayı manuel olarak uca taşıyın
3. Milin ortasına 1 damla hafif yağ uygulayın
4. Arabayı yavaşça 10 kez ileri geri hareket ettirin
5. Fazla yağı tüy bırakmayan kağıtla silin
```

:::warning Aşırı Yağlamayın
Fazla yağ toz çeker ve aşındırıcı bir macun oluşturur. Minimum miktarda kullanın ve fazlasını her zaman silin.
:::

### Z Ekseni (Dikey)
Z ekseni, yağ değil gres gerektiren bir kurşun vida (leadscrew) kullanır:

```
Aralık: Her 200 saatte bir
Yöntem:
1. Yazıcıyı kapatın
2. Kurşun vida boyunca ince bir gres tabakası sürün
3. Z eksenini manuel olarak yukarı aşağı hareket ettirin (veya bakım menüsünden)
4. Gres otomatik olarak dağılır
```

## Doğrusal Kızaklar

Bambu Lab P1S ve X1C, Y ekseninde doğrusal kızaklar (MGN12) kullanır:

```
Aralık: Her 300–500 saatte bir
Yöntem:
1. İğne veya kürdan ile giriş açıklığından biraz gres çıkarın
2. İnce kanüllü şırınga ile yeni gres enjekte edin
3. Gresin dağılması için ekseni ileri geri hareket ettirin
```

Bambu Lab, sistem için kalibre edilmiş resmi gres (Bambu Lubricant) satmaktadır.

## Farklı Modeller için Yağlama Bakımı

### X1C / P1S
- Y ekseni: Doğrusal kızaklar — Bambu gres
- X ekseni: Karbon miller — hafif yağ
- Z ekseni: Çift kurşun vida — Bambu gres

### A1 / A1 Mini
- Tüm eksenler: Çelik miller — hafif yağ
- Z ekseni: Tek kurşun vida — Bambu gres

## Yağlama Gerektiğinin Belirtileri

- **Hareket sırasında gıcırtı veya kazıma sesleri**
- **Dikey duvarlarda titreşim desenleri** (VFA)
- **Başka bir nedeni olmayan boyutsal hatalar**
- **Hareket sisteminden gelen artan ses yüksekliği**

## Yağlama Aralıkları

| Aktivite | Aralık |
|----------|--------|
| XY miller yağlama | Her 200–300 saatte bir |
| Z mili gres uygulama | Her 200 saatte bir |
| Doğrusal kızak gres (X1C/P1S) | Her 300–500 saatte bir |
| Tam bakım döngüsü | Altı ayda bir (veya 500 saatte bir) |

Aralıkları otomatik olarak takip etmek için panodaki bakım modülünü kullanın.
