---
sidebar_position: 8
title: PVA och stödmaterial
description: Guide till PVA, HIPS, PVB och andra stödmaterial för Bambu Lab-skrivare
---

# PVA och stödmaterial

Stödmaterial används för att skriva ut komplexa geometrier med överhäng, broar och inre hålrum som inte kan skrivas ut utan tillfälligt stöd. Efter utskrift avlägsnas stödmaterialet — antingen mekaniskt eller genom upplösning i ett lösningsmedel.

## Översikt

| Material | Lösningsmedel | Kombinera med | Upplösningstid | Svårighetsgrad |
|----------|--------------|---------------|----------------|----------------|
| PVA | Vatten | PLA, PETG | 12–24 timmar | Krävande |
| HIPS | d-Limonen | ABS, ASA | 12–24 timmar | Måttlig |
| PVB | Isopropanol (IPA) | PLA, PETG | 6–12 timmar | Måttlig |
| BVOH | Vatten | PLA, PETG, PA | 4–8 timmar | Krävande |

---

## PVA (Polyvinylalkohol)

PVA är ett vattenlösligt stödmaterial som är det vanligaste valet för PLA-baserade utskrifter med komplexa stödstrukturer.

### Inställningar

| Parameter | Värde |
|-----------|-------|
| Munstyckstemperatur | 190–210 °C |
| Bäddtemperatur | 45–60 °C |
| Delkylning | 100% |
| Hastighet | 60–80% |
| Retraction | Ökad (6–8 mm) |

### Rekommenderade byggplattor

| Platta | Lämplighet | Limstift? |
|--------|-----------|----------|
| Cool Plate (Smooth PEI) | Utmärkt | Nej |
| Textured PEI | Bra | Nej |
| Engineering Plate | Bra | Nej |
| High Temp Plate | Undvik | — |

### Kompatibilitet

PVA fungerar bäst med material som skriver ut vid **liknande temperaturer**:

| Huvudmaterial | Kompatibilitet | Anmärkning |
|---------------|---------------|------------|
| PLA | Utmärkt | Idealisk kombination |
| PETG | Bra | Bäddtemp kan vara lite hög för PVA |
| ABS/ASA | Dålig | För hög kammartemp — PVA degraderas |
| PA (Nylon) | Dålig | För höga temperaturer |

### Upplösning

- Lägg den färdiga utskriften i **ljummet vatten** (ca 40 °C)
- PVA löser sig inom **12–24 timmar** beroende på tjocklek
- Rör i vattnet regelbundet för att påskynda processen
- Byt vatten var 6–8:e timme för snabbare upplösning
- Ultraljudsrengörare ger betydligt snabbare resultat (2–6 timmar)

:::danger PVA är extremt hygroskopiskt
PVA absorberar fukt från luften **mycket snabbt** — även timmar av exponering kan förstöra utskriftsresultatet. PVA som har absorberat fukt ger:

- Kraftigt bubblande och poppande ljud
- Dålig vidhäftning till huvudmaterialet
- Stringing och klibbig yta
- Igentäppt munstycke

**Torka alltid PVA omedelbart före användning** och skriv ut från torr miljö (torklåda).
:::

### Torkning av PVA

| Parameter | Värde |
|-----------|-------|
| Torktemperatur | 45–55 °C |
| Torktid | 6–10 timmar |
| Hygroskopisk nivå | Extremt hög |
| Förvaringsmetod | Förseglad låda med torkmedel, alltid |

---

## HIPS (High Impact Polystyrene)

HIPS är ett stödmaterial som löser sig i d-limonen (citrusbaserat lösningsmedel). Det är det föredragna stödmaterialet för ABS och ASA.

### Inställningar

| Parameter | Värde |
|-----------|-------|
| Munstyckstemperatur | 220–240 °C |
| Bäddtemperatur | 90–100 °C |
| Kammartemperatur | 40–50 °C (rekommenderad) |
| Delkylning | 20–40% |
| Hastighet | 70–90% |

### Kompatibilitet

| Huvudmaterial | Kompatibilitet | Anmärkning |
|---------------|---------------|------------|
| ABS | Utmärkt | Idealisk kombination — liknande temperaturer |
| ASA | Utmärkt | Mycket bra vidhäftning |
| PLA | Dålig | För stor temperaturskillnad |
| PETG | Dålig | Olika termiskt beteende |

### Upplösning i d-Limonen

- Lägg utskriften i **d-limonen** (citrusbaserat lösningsmedel)
- Upplösningstid: **12–24 timmar** vid rumstemperatur
- Uppvärmning till 35–40 °C påskyndar processen
- d-Limonen kan återanvändas 2–3 gånger
- Skölj delen i vatten och torka efter upplösning

### Fördelar jämfört med PVA

- **Mycket mindre fuktkänsligt** — enklare att förvara och hantera
- **Starkare som stödmaterial** — tål mer utan att brytas ner
- **Bättre termisk kompatibilitet** med ABS/ASA
- **Enklare att skriva ut** — färre tilltäppningar och problem

:::warning d-Limonen är ett lösningsmedel
Använd handskar och arbeta i ventilerat rum. d-Limonen kan irritera hud och slemhinnor. Förvaras otillgängligt för barn.
:::

---

## PVB (Polyvinylbutyral)

PVB är ett unikt stödmaterial som löser sig i isopropanol (IPA) och kan användas för att jämna ut ytor med IPA-ånga.

### Inställningar

| Parameter | Värde |
|-----------|-------|
| Munstyckstemperatur | 200–220 °C |
| Bäddtemperatur | 55–75 °C |
| Delkylning | 80–100% |
| Hastighet | 70–80% |

### Kompatibilitet

| Huvudmaterial | Kompatibilitet | Anmärkning |
|---------------|---------------|------------|
| PLA | Bra | Acceptabel vidhäftning |
| PETG | Måttlig | Bäddtemp kan variera |
| ABS/ASA | Dålig | För höga temperaturer |

### Ytglättning med IPA-ånga

PVB:s unika egenskap är att ytan kan glättas med IPA-ånga:

1. Placera delen i en sluten behållare
2. Lägg en IPA-fuktad trasa i botten (ingen direkt kontakt med delen)
3. Låt ångan verka i **30–60 minuter**
4. Ta ut och låt torka i 24 timmar
5. Resultatet är en slät, halvblank yta

:::tip PVB som ytfinish
Även om PVB primärt är ett stödmaterial kan det skrivas ut som yttersta lager på PLA-delar för att ge en yta som kan IPA-glättas. Detta ger en finish som liknar acetonglättat ABS.
:::

---

## Jämförelse av stödmaterial

| Egenskap | PVA | HIPS | PVB | BVOH |
|----------|-----|------|-----|------|
| Lösningsmedel | Vatten | d-Limonen | IPA | Vatten |
| Upplösningstid | 12–24 h | 12–24 h | 6–12 h | 4–8 h |
| Fuktkänslighet | Extremt hög | Låg | Måttlig | Extremt hög |
| Svårighetsgrad | Krävande | Måttlig | Måttlig | Krävande |
| Pris | Högt | Måttligt | Högt | Mycket högt |
| Bäst med | PLA, PETG | ABS, ASA | PLA | PLA, PETG, PA |
| Tillgänglighet | Bra | Bra | Begränsad | Begränsad |
| AMS-kompatibel | Ja (med torkmedel) | Ja | Ja | Problematisk |

---

## Tips för dubbelextrudering och flerfärg

### Allmänna riktlinjer

- **Purge-mängd** — stödmaterial kräver bra purge vid materialbyte (minst 150–200 mm³)
- **Gränssnittslager** — använd 2–3 gränssnittslager mellan stöd och huvuddel för ren yta
- **Avstånd** — ställ in stödavståndet till 0,1–0,15 mm för enkel borttagning efter upplösning
- **Stödmönster** — använd triangelmönster för PVA/BVOH, rutnät för HIPS

### AMS-konfiguration

- Placera stödmaterialet i en **AMS-slot med torkmedel**
- För PVA: överväg extern torklåda med Bowden-anslutning
- Konfigurera rätt materialprofil i Bambu Studio
- Testa med en enkel överhängsmodell innan du skriver ut komplexa delar

### Vanliga problem och lösningar

| Problem | Orsak | Lösning |
|---------|-------|---------|
| Stöd fäster inte | För stort avstånd | Minska gränssnittsavståndet till 0,05 mm |
| Stöd fäster för bra | För litet avstånd | Öka gränssnittsavståndet till 0,2 mm |
| Bubblor i stödmaterial | Fukt | Torka filamentet ordentligt |
| Stringing mellan material | Otillräcklig retraction | Öka retraction med 1–2 mm |
| Dålig yta mot stöd | För få gränssnittslager | Öka till 3–4 gränssnittslager |

:::tip Börja enkelt
För din första utskrift med stödmaterial: använd PLA + PVA, en enkel modell med tydligt överhäng (45°+) och standardinställningar i Bambu Studio. Optimera efterhand som du får erfarenhet.
:::
