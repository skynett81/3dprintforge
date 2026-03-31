---
sidebar_position: 5
title: Predikce opotřebení
description: Prediktivní analýza 8 komponent tiskárny s výpočtem životnosti, upozorněními na údržbu a prognózou nákladů
---

# Predikce opotřebení

Predikce opotřebení vypočítává očekávanou životnost kritických komponent na základě skutečného používání, typu filamentu a chování tiskárny — abyste mohli plánovat údržbu proaktivně, nikoli reaktivně.

Přejděte na: **https://localhost:3443/#wear**

## Monitorované komponenty

3DPrintForge sleduje opotřebení 8 komponent na tiskárnu:

| Komponenta | Primární faktor opotřebení | Typická životnost |
|---|---|---|
| **Tryska (mosaz)** | Typ filamentu + hodiny | 300–800 hodin |
| **Tryska (kalená ocel)** | Hodiny + abrazivní materiál | 1500–3000 hodin |
| **PTFE trubice** | Hodiny + vysoká teplota | 500–1500 hodin |
| **Ozubené kolo extruderu** | Hodiny + abrazivní materiál | 1000–2000 hodin |
| **Osa X (CNC)** | Počet tisků + rychlost | 2000–5000 hodin |
| **Povrch podložky** | Počet tisků + teplota | 200–500 tisků |
| **Ozubené kolo AMS** | Počet výměn filamentu | 5000–15000 výměn |
| **Ventilátory komory** | Hodiny provozu | 3000–8000 hodin |

## Výpočet opotřebení

Opotřebení se počítá jako kumulativní procento (0–100 % opotřebeno):

```
Opotřebení % = (skutečné použití / očekávaná životnost) × 100
             × multiplikátor materiálu
             × multiplikátor rychlosti
```

**Multiplikátory materiálů:**
- PLA, PETG: 1,0× (normální opotřebení)
- ABS, ASA: 1,1× (o něco agresivnější)
- PA, PC: 1,2× (náročné na PTFE a trysku)
- CF/GF kompozity: 2,0–3,0× (velmi abrazivní)

:::warning Karbonová vlákna
Filamenty vyztužené karbonovými vlákny (CF-PLA, CF-PA atd.) extrémně rychle opotřebovávají mosazné trysky. Používejte trysku z kalené oceli a očekávejte 2–3× rychlejší opotřebení.
:::

## Výpočet životnosti

Pro každou komponentu se zobrazuje:

- **Aktuální opotřebení** — procento použití
- **Odhadovaná zbývající životnost** — hodiny nebo tisky
- **Odhadované datum konce životnosti** — na základě průměrného použití za posledních 30 dní
- **Interval spolehlivosti** — marže nejistoty pro predikci

Kliknutím na komponentu zobrazíte podrobný graf akumulace opotřebení v průběhu času.

## Upozornění

Nakonfigurujte automatická upozornění pro každou komponentu:

1. Přejděte na **Opotřebení → Nastavení**
2. Pro každou komponentu nastavte **Práh upozornění** (doporučeno: 75 % a 90 %)
3. Vyberte kanál upozornění (viz [Upozornění](../features/notifications))

**Příklad zprávy upozornění:**
> ⚠️ Tryska (mosaz) na Moje X1C je 78 % opotřebena. Odhadovaná životnost: ~45 hodin. Doporučeno: Naplánujte výměnu trysky.

## Náklady na údržbu

Modul opotřebení se integruje s protokolem nákladů:

- **Náklady na komponentu** — cena náhradního dílu
- **Celkové náklady na výměnu** — součet pro všechny komponenty blížící se limitu
- **Prognóza na příštích 6 měsíců** — odhadované budoucí náklady na údržbu

Zadejte ceny komponent v části **Opotřebení → Ceny**:

1. Klikněte na **Nastavit ceny**
2. Vyplňte cenu za kus pro každou komponentu
3. Cena se používá v prognózách nákladů a může se lišit podle modelu tiskárny

## Resetování čítače opotřebení

Po údržbě resetujte čítač pro příslušnou komponentu:

1. Přejděte na **Opotřebení → [Název komponenty]**
2. Klikněte na **Označit jako vyměněnou**
3. Vyplňte:
   - Datum výměny
   - Náklady (volitelné)
   - Poznámka (volitelné)
4. Čítač opotřebení se resetuje a přepočítá

Resetování se zobrazují v historii údržby.

:::tip Kalibrace
Porovnejte predikci opotřebení se skutečnými zkušenostmi a upravte parametry životnosti v části **Opotřebení → Konfigurovat životnost** pro přizpůsobení výpočtů vašemu skutečnému použití.
:::
