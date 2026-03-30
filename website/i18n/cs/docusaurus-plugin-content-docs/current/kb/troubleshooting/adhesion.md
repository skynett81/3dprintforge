---
sidebar_position: 1
title: Špatná přilnavost
description: Příčiny a řešení špatné přilnavosti první vrstvy — podložka, teplota, lepidlo, rychlost, Z-offset
---

# Špatná přilnavost

Špatná přilnavost je jedním z nejčastějších problémů v 3D tisku. První vrstva se nelepí, nebo tisky přestanou přilínat v polovině.

## Příznaky

- První vrstva se nelepí — tisk se pohybuje nebo zvedá
- Hrany a rohy se zvedají (warping)
- Tisk se uvolní uprostřed úlohy
- Nerovná první vrstva s dírami nebo volnými vlákny

## Kontrolní seznam — zkuste v tomto pořadí

### 1. Vyčistěte podložku
Nejčastější příčinou špatné přilnavosti je tuk nebo nečistota na podložce.

```
1. Otřete podložku IPA (isopropylalkohol)
2. Vyhněte se dotykání tiskového povrchu holými prsty
3. Při přetrvávajících problémech: umyjte vodou a jemným mycím prostředkem
```

### 2. Zkalibrujte Z-offset

Z-offset je výška mezi tryskou a podložkou při první vrstvě. Příliš vysoký = vlákno visí volně. Příliš nízký = tryska škrábe podložku.

**Správný Z-offset:**
- První vrstva by měla vypadat lehce průhledně
- Vlákno by mělo být přimáčknuto k podložce s lehkým „zmáčknutím"
- Vlákna by se měla lehce tavit do sebe

Upravte Z-offset přes **Ovládání → Živá úprava Z** během tisku.

:::tip Živá úprava během tisku
Bambu Dashboard zobrazuje tlačítka pro úpravu Z-offsetu během aktivního tisku. Upravujte v krocích ±0,02 mm při sledování první vrstvy.
:::

### 3. Zkontrolujte teplotu podložky

| Materiál | Příliš nízká teplota | Doporučeno |
|-----------|-------------|---------|
| PLA | Pod 30 °C | 35–45 °C |
| PETG | Pod 60 °C | 70–85 °C |
| ABS | Pod 80 °C | 90–110 °C |
| TPU | Pod 25 °C | 30–45 °C |

Zkuste zvyšovat teplotu podložky po 5 °C.

### 4. Použijte lepidlo

Lepidlo zlepšuje přilnavost pro většinu materiálů na většině podložek:
- Naneste tenkou, rovnoměrnou vrstvu
- Nechte schnout 30 sekund před startem
- Zvláště důležité pro: ABS, PA, PC, PETG (na smooth PEI)

### 5. Snižte rychlost první vrstvy

Nižší rychlost při první vrstvě dává lepší kontakt mezi filamentem a podložkou:
- Standardní: 50 mm/s pro první vrstvu
- Zkuste: 30–40 mm/s
- Bambu Studio: v části **Kvalita → Rychlost první vrstvy**

### 6. Zkontrolujte stav podložky

Opotřebovaná podložka dává špatnou přilnavost i při dokonalých nastaveních. Vyměňte podložku, pokud:
- PEI povrch je viditelně poškozen
- Čištění nepomáhá

### 7. Použijte brim

Pro materiály s tendencí k warpingu (ABS, PA, velké ploché objekty):
- Přidejte brim v sliceru: šířka 5–10 mm
- Zvyšuje kontaktní plochu a drží hrany dolů

## Speciální případy

### Velké ploché objekty
Velké ploché objekty jsou nejvíce náchylné k uvolnění. Opatření:
- Brim 8–10 mm
- Zvýšení teploty podložky
- Uzavřít komoru (ABS/PA)
- Snížení chlazení dílu

### Glazované povrchy
Podložky s příliš mnoha vrstvami lepidla mohou glazovat. Důkladně umyjte vodou a začněte znovu.

### Po výměně filamentu
Různé materiály vyžadují různá nastavení. Zkontrolujte, zda jsou teplota podložky a podložka nakonfigurovány pro nový materiál.
