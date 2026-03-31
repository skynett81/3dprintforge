---
sidebar_position: 1
title: Print Guard
description: Automatické monitorování s detekcí XCam událostí, monitorováním senzorů a konfigurovatelnými akcemi při odchylkách
---

# Print Guard

Print Guard je systém monitorování 3DPrintForgeu v reálném čase. Nepřetržitě monitoruje kameru, senzory a data tiskárny a provádí konfiguratelné akce při výskytu problémů.

Přejděte na: **https://localhost:3443/#protection**

## Detekce XCam událostí

Tiskárny Bambu Lab odesílají XCam události přes MQTT, když AI kamera detekuje problémy:

| Událost | Kód | Závažnost |
|---|---|---|
| Detekce spaghetti | `xcam_spaghetti` | Kritická |
| Odtržení od podložky | `xcam_detach` | Vysoká |
| Porucha první vrstvy | `xcam_first_layer` | Vysoká |
| Stringing | `xcam_stringing` | Střední |
| Chyba extruze | `xcam_extrusion` | Vysoká |

Pro každý typ události lze nakonfigurovat jednu nebo více akcí:

- **Upozornit** — odeslat upozornění přes aktivní kanály
- **Pozastavit** — pozastavit tisk pro ruční kontrolu
- **Zastavit** — okamžitě přerušit tisk
- **Žádná** — ignorovat událost (přesto ji zaznamenat)

:::danger Výchozí chování
Výchozí nastavení XCam událostí je **Upozornit** a **Pozastavit**. Změňte na **Zastavit**, pokud plně důvěřujete detekci AI.
:::

## Monitorování senzorů

Print Guard nepřetržitě monitoruje data senzorů a spouští alarm při odchylkách:

### Odchylky teploty

1. Přejděte na **Print Guard → Teplota**
2. Nastavte **Maximální odchylku od cílové teploty** (doporučeno: ±5 °C pro trysku, ±3 °C pro podložku)
3. Vyberte **Akci při odchylce**: Upozornit / Pozastavit / Zastavit
4. Nastavte **Zpoždění** (sekundy) před provedením akce — dává teplotě čas na stabilizaci

### Nízký filament

Systém vypočítává zbývající filament na cívkách:

1. Přejděte na **Print Guard → Filament**
2. Nastavte **Minimální limit** v gramech (např. 50 g)
3. Vyberte akci: **Pozastavit a upozornit** (doporučeno) pro ruční výměnu cívky

### Detekce zastavení tisku

Detekuje neočekávané zastavení tisku (timeout MQTT, přetržení filamentu atd.):

1. Aktivujte **Detekci zastavení**
2. Nastavte **Timeout** (doporučeno: 120 sekund bez dat = zastaveno)
3. Akce: Vždy upozornit — tisk mohl již být zastaven

## Konfigurace

### Aktivace Print Guard

1. Přejděte na **Nastavení → Print Guard**
2. Zapněte **Aktivovat Print Guard**
3. Vyberte, které tiskárny mají být monitorovány
4. Klikněte na **Uložit**

### Pravidla pro jednotlivé tiskárny

Různé tiskárny mohou mít různá pravidla:

1. Klikněte na tiskárnu v přehledu Print Guard
2. Vypněte **Zdědit globální pravidla**
3. Nakonfigurujte vlastní pravidla pro tuto tiskárnu

## Protokol a historie událostí

Všechny události Print Guard jsou zaznamenávány:

- Přejděte na **Print Guard → Protokol**
- Filtrujte podle tiskárny, typu události, data a závažnosti
- Kliknutím na událost zobrazíte podrobné informace a provedené akce
- Exportujte protokol do CSV

:::tip Falešné poplachy
Pokud Print Guard spouští zbytečná pozastavení, upravte citlivost v části **Print Guard → Nastavení → Citlivost**. Začněte s „Nízkou" a postupně zvyšujte.
:::
