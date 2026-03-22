---
sidebar_position: 1
title: Údržba trysky
description: Čištění, cold pull, výměna trysky a typy trysek pro tiskárny Bambu Lab
---

# Údržba trysky

Tryska je jednou z nejkritičtějších součástí tiskárny. Správná údržba prodlužuje životnost a zajišťuje dobré výsledky tisku.

## Typy trysek

| Typ trysky | Materiály | Odhadovaná životnost | Max. teplota |
|----------|-----------|-------------------|----------|
| Mosaz (standardní) | PLA, PETG, ABS, TPU | 200–500 hodin | 300 °C |
| Kalená ocel | Všechny včetně CF/GF | 300–600 hodin | 300 °C |
| HS01 (Bambu) | Všechny včetně CF/GF | 500–1000 hodin | 300 °C |

:::danger Nikdy nepoužívejte mosaznou trysku s CF/GF
Karbonová a skelná vlákna opotřebují mosazné trysky za hodiny. Před tiskem CF/GF materiálů přejděte na kalennou ocel.
:::

## Čištění

### Jednoduché čištění (mezi cívkami)
1. Zahřejte trysku na 200–220 °C
2. Ručně protlačte filament, dokud se nevyčistí
3. Rychle vytáhněte filament („cold pull" — viz níže)

### Čištění IPA
Pro tvrdošíjné zbytky:
1. Zahřejte trysku na 200 °C
2. Kapněte 1–2 kapky IPA na konec trysky (opatrně!)
3. Nechte páru rozpustit zbytky
4. Protáhněte čerstvý filament

:::warning Buďte opatrní s IPA na horké trysce
IPA vaří při 83 °C a silně se odpařuje na horké trysce. Používejte malá množství a vyhněte se vdechování.
:::

## Cold Pull (Studené vytažení)

Cold pull je nejúčinnější metoda pro odstranění nečistot a uhlíkových zbytků z trysky.

**Postup krok za krokem:**
1. Zahřejte trysku na 200–220 °C
2. Ručně zatlačte nylonový filament (nebo co je v trysce) dovnitř
3. Nechte nylon nasytit trysku po dobu 1–2 minut
4. Snižte teplotu na 80–90 °C (pro nylon)
5. Počkejte, až se tryska ochladí na cílovou hodnotu
6. Rychle a rozhodně vytáhněte filament jedním pohybem
7. Podívejte se na konec: měl by mít tvar vnitřku trysky — čistý a bez zbytků
8. Opakujte 3–5×, dokud se filament nevytahuje čistý a bílý

:::tip Nylon pro cold pull
Nylon dává nejlepší výsledky pro cold pull, protože se dobře chytá nečistot. Bílý nylon usnadňuje vidět, zda je vytažení čisté.
:::

## Výměna trysky

### Příznaky, že je třeba vyměnit trysku
- Hrudkovité spodní povrchy a špatná rozměrová přesnost
- Přetrvávající problémy s extruzí po čištění
- Viditelné opotřebení nebo deformace otvoru trysky
- Tryska překročila odhadovanou životnost

### Postup (P1S/X1C)
1. Zahřejte trysku na 200 °C
2. Uvolněte extruderový motor (uvolní filament)
3. Použijte klíč pro uvolnění trysky (proti směru hodinových ručiček)
4. Vyměňte trysku, když je teplá — **nenechávejte trysku chladnout s nástrojem na ní**
5. Utáhněte na požadovanou hodnotu (nepřetáhněte)
6. Po výměně spusťte kalibraci

:::warning Vždy vyměňujte za tepla
Utahovací moment studené trysky může prasknout díl při zahřátí. Vždy vyměňujte a utahujte, když je tryska teplá (200 °C).
:::

## Intervaly údržby

| Aktivita | Interval |
|-----------|---------|
| Čištění (cold pull) | Po 50 hodinách nebo při výměně materiálu |
| Vizuální kontrola | Týdně |
| Výměna trysky (mosaz) | 200–500 hodin |
| Výměna trysky (kalená ocel) | 300–600 hodin |
