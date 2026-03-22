---
sidebar_position: 3
title: Každodenní použití
description: Praktický průvodce každodenním používáním Bambu Dashboard — ranní rutina, monitorování, po tisku a údržba
---

# Každodenní použití

Tento průvodce popisuje, jak efektivně používat Bambu Dashboard v každodenním životě — od začátku do konce dne.

## Ranní rutina

Otevřete panel a rychle projděte tyto body:

### 1. Zkontrolujte stav tiskáren
Přehledový panel zobrazuje stav všech vašich tiskáren. Hledejte:
- **Červené ikony** — chyby vyžadující pozornost
- **Čekající zprávy** — HMS varování z noci
- **Nedokončené tisky** — pokud jste měli noční tisk, je hotov?

### 2. Zkontrolujte hladiny AMS
Přejděte do **Filament** nebo si prohlédněte widget AMS na panelu:
- Jsou některé cívky pod 100 g? Vyměňte nebo objednejte nové
- Správný filament ve správném slotu pro dnešní tisky?

### 3. Zkontrolujte upozornění a události
V části **Protokol upozornění** (ikona zvonku) vidíte:
- Události, které nastaly v noci
- Automaticky zaznamenané chyby
- Kódy HMS, které spustily alarm

## Spuštění tisku

### Ze souboru (Bambu Studio)
1. Otevřete Bambu Studio
2. Načtěte a nakrájejte model
3. Odešlete na tiskárnu — panel se automaticky aktualizuje

### Z fronty
Pokud jste tisky naplánovali předem:
1. Přejděte do **Fronta**
2. Klikněte na **Spustit další** nebo přetáhněte úlohu na začátek
3. Potvrďte kliknutím na **Odeslat na tiskárnu**

Viz [Dokumentace tiskové fronty](../funksjoner/queue) pro úplné informace o správě fronty.

### Plánovaný tisk (plánovač)
Pro spuštění tisku v konkrétní čas:
1. Přejděte do **Plánovač**
2. Klikněte na **+ Nová úloha**
3. Zvolte soubor, tiskárnu a čas
4. Aktivujte **Optimalizaci ceny elektřiny** pro automatický výběr nejlevnější hodiny

Viz [Plánovač](../funksjoner/scheduler) pro podrobnosti.

## Monitorování aktivního tisku

### Zobrazení kamery
Klikněte na ikonu kamery na kartě tiskárny. Můžete:
- Sledovat živý přenos v panelu
- Otevřít na samostatné záložce pro sledování na pozadí
- Pořídit ruční snímek obrazovky

### Informace o průběhu
Karta aktivního tisku zobrazuje:
- Procento dokončení
- Odhadovaná zbývající doba
- Aktuální vrstva / celkový počet vrstev
- Aktivní filament a barva

### Teploty
Křivky teplot v reálném čase se zobrazují na panelu s podrobnostmi:
- Teplota trysky — měla by se pohybovat stabilně v rozsahu ±2°C
- Teplota desky — důležitá pro dobrou přilnavost
- Teplota komory — postupně stoupá, zvláště důležité pro ABS/ASA

### Print Guard
Při aktivaci **Print Guard** panel automaticky sleduje spaghetti a objemové odchylky. Pokud je něco zjištěno:
1. Tisk se pozastaví
2. Obdržíte upozornění
3. Snímky kamery se uloží pro pozdější kontrolu

## Po tisku — kontrolní seznam

### Zkontrolujte kvalitu
1. Otevřete kameru a podívejte se na výsledek, dokud je ještě na desce
2. Přejděte do **Historie → Poslední tisk** pro zobrazení statistik
3. Zaznamenejte poznámku: co šlo dobře, co lze zlepšit

### Archivace
Tisky v historii se nikdy automaticky nearchivují — zůstávají tam. Chcete-li uspořádat:
- Klikněte na tisk → **Archivovat** pro přesun do archivu
- Použijte **Projekty** pro seskupení souvisejících tisků

### Aktualizujte hmotnost filamentu
Pokud vážíte cívku pro přesnost (doporučeno):
1. Zvažte cívku
2. Přejděte do **Filament → [Cívka]**
3. Aktualizujte **Zbývající hmotnost**

## Připomínky údržby

Panel automaticky sleduje intervaly údržby. V části **Údržba** vidíte:

| Úloha | Interval | Stav |
|-------|----------|------|
| Čištění trysky | Každých 50 hodin | Automaticky kontrolováno |
| Mazání tyčí | Každých 200 hodin | Sledováno v panelu |
| Kalibrace desky | Po výměně desky | Ruční připomínka |
| Čištění AMS | Měsíčně | Upozornění v kalendáři |

Aktivujte upozornění údržby v **Monitorování → Údržba → Upozornění**.

:::tip Nastavte si týdenní den údržby
Pevný den údržby v týdnu (např. nedělní večer) vás ušetří od zbytečných odstávek. Použijte funkci připomínek v panelu.
:::

## Cena elektřiny — nejlepší čas pro tisk

Pokud jste připojili integraci cen elektřiny (Nordpool / Home Assistant):

1. Přejděte do **Analýza → Cena elektřiny**
2. Zobrazte cenový graf pro příštích 24 hodin
3. Nejlevnější hodiny jsou označeny zeleně

Použijte **Plánovač** s aktivovanou **Optimalizací ceny elektřiny** — panel automaticky spustí úlohu v nejlevnějším dostupném časovém okně.

:::info Typicky nejlevnější hodiny
Noc (01:00–06:00) bývá obvykle nejlevnější. 8hodinový tisk přidaný do fronty předchozí večer vám může ušetřit 30–50 % nákladů na elektřinu.
:::
