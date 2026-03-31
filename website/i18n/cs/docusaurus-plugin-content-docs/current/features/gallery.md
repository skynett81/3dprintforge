---
sidebar_position: 8
title: Galerie
description: Zobrazujte milníkové snímky pořízené automaticky při 25, 50, 75 a 100 % průběhu pro všechny tisky
---

# Galerie

Galerie shromažďuje automatické snímky pořízené v průběhu každého tisku. Snímky se pořizují při pevně daných milnících a poskytují vizuální protokol vývoje tisku.

Přejděte na: **https://localhost:3443/#gallery**

## Milníkové snímky

3DPrintForge automaticky pořizuje snímek z kamery při následujících milnících:

| Milník | Čas |
|---|---|
| **25 %** | Čtvrtina tisku |
| **50 %** | Polovina |
| **75 %** | Tři čtvrtiny tisku |
| **100 %** | Tisk dokončen |

Snímky se ukládají a propojují s příslušným záznamem v historii tisků a zobrazují se v galerii.

:::info Požadavky
Milníkové snímky vyžadují, aby kamera byla připojena a aktivní. Deaktivované kamery negenerují žádné snímky.
:::

## Aktivace funkce snímků

1. Přejděte na **Nastavení → Galerie**
2. Zapněte **Automatické milníkové snímky**
3. Vyberte, které milníky chcete aktivovat (všechny čtyři jsou ve výchozím nastavení zapnuty)
4. Vyberte **Kvalitu snímku**: Nízká (640×360) / Střední (1280×720) / Vysoká (1920×1080)
5. Klikněte na **Uložit**

## Prohlížení snímků

Galerie je organizována podle tisků:

1. Použijte **filtr** nahoře pro výběr tiskárny, data nebo názvu souboru
2. Kliknutím na řádek tisku rozbalíte a zobrazíte všechny čtyři snímky
3. Kliknutím na snímek otevřete náhled

### Náhled

Náhled zobrazuje:
- Snímek v plné velikosti
- Milník a časové razítko
- Název tisku a tiskárnu
- **←** / **→** pro procházení snímků v rámci stejného tisku

## Celostránkové zobrazení

Kliknutím na **Celá obrazovka** (nebo stisknutím `F`) v náhledu vyplníte celou obrazovku. Použijte šipkové klávesy pro procházení snímků.

## Stahování snímků

- **Jeden snímek**: Klikněte na **Stáhnout** v náhledu
- **Všechny snímky tisku**: Klikněte na **Stáhnout vše** na řádku tisku — dostanete soubor `.zip`
- **Výběr více**: Zaškrtněte políčka a klikněte na **Stáhnout vybrané**

## Mazání snímků

:::warning Úložný prostor
Snímky galerie mohou v průběhu času zabírat značné místo. Nastavte automatické mazání starých snímků.
:::

### Ruční mazání

1. Vyberte jeden nebo více snímků (zaškrtnutím)
2. Klikněte na **Smazat vybrané**
3. Potvrďte v dialogu

### Automatické čištění

1. Přejděte na **Nastavení → Galerie → Automatické čištění**
2. Aktivujte **Smazat snímky starší než**
3. Nastavte počet dní (např. 90 dní)
4. Čištění se automaticky spouští každou noc ve 03:00

## Propojení s historií tisků

Každý snímek je propojen se záznamem tisku v historii:

- Kliknutím na **Zobrazit v historii** v galerii přejdete na záznam v historii
- V historii se zobrazuje miniatura 100% snímku, pokud existuje

## Sdílení

Sdílejte snímek z galerie prostřednictvím časově omezeného odkazu:

1. Otevřete snímek v náhledu
2. Klikněte na **Sdílet**
3. Vyberte čas vypršení a zkopírujte odkaz
