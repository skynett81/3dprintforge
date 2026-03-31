---
sidebar_position: 1
title: Dålig vidhäftning
description: Orsaker och lösningar för dålig första-lagers-vidhäftning — platta, temp, limstift, hastighet, Z-offset
---

# Dålig vidhäftning

Dålig vidhäftning är ett av de vanligaste problemen inom 3D-utskrift. Första lagret fäster inte, eller utskrifter slutar häfta i mitten av jobbet.

## Symptom

- Första lagret fäster inte — utskriften rör sig eller lyfter sig
- Kanter och hörn lyfter sig (warping)
- Utskriften lossnar mitt i jobbet
- Ojämnt första lager med hål eller lösa trådar

## Checklista — prova i denna ordning

### 1. Rengör plattan
Den vanligaste orsaken till dålig vidhäftning är fett eller smuts på plattan.

```
1. Torka plattan med IPA (isopropylalkohol)
2. Undvik att röra utskriftsytan med bara fingrar
3. Vid bestående problem: tvätta med vatten och milt diskmedel
```

### 2. Kalibrera Z-offset

Z-offset är höjden mellan munstycket och plattan vid första lagret. För högt = tråden hänger löst. För lågt = munstycket skrapar plattan.

**Korrekt Z-offset:**
- Första lagret ska se lätt transparent ut
- Tråden ska tryckas ner mot plattan med en liten «squish»
- Trådarna ska smälta lätt in i varandra

Justera Z-offset via **Kontroll → Livejustera Z** under utskrift.

:::tip Livejustera under utskrift
3DPrintForge visar Z-offsetjusteringsknappar under aktiv utskrift. Justera i steg om ±0.02 mm medan du tittar på första lagret.
:::

### 3. Kontrollera bäddtemperatur

| Material | För låg temp | Rekommenderat |
|-----------|-------------|---------|
| PLA | Under 30 °C | 35–45 °C |
| PETG | Under 60 °C | 70–85 °C |
| ABS | Under 80 °C | 90–110 °C |
| TPU | Under 25 °C | 30–45 °C |

Prova att öka bäddtemperaturen med 5 °C i taget.

### 4. Använd limstift

Limstift förbättrar vidhäftningen för de flesta material på de flesta plattor:
- Påför ett tunt, jämnt lager
- Låt torka 30 sekunder innan start
- Särskilt viktigt för: ABS, PA, PC, PETG (på smooth PEI)

### 5. Sänk första-lagrets hastighet

Lägre hastighet vid första lagret ger bättre kontakt mellan filament och platta:
- Standard: 50 mm/s för första lagret
- Prova: 30–40 mm/s
- Bambu Studio: under **Kvalitet → Första lagrets hastighet**

### 6. Kontrollera plattans skick

En sliten platta ger dålig vidhäftning även med perfekta inställningar. Byt plattan om:
- PEI-beläggningen är synligt skadad
- Rengöring inte hjälper

### 7. Använd brim

För material med warptendens (ABS, PA, stora platta objekt):
- Lägg till brim i slicer: 5–10 mm bredd
- Ökar kontaktytan och håller ner kanterna

## Speciella fall

### Stora platta objekt
Stora platta objekt är mest utsatta för lossnande. Åtgärder:
- Brim 8–10 mm
- Öka bäddtemperatur
- Stäng kammaren (ABS/PA)
- Sänk delavkylning

### Glaserade ytor
Plattor med för mycket limstift över tid kan bli glaserade. Tvätta noggrant med vatten och börja om.

### Efter filamentbyte
Olika material kräver olika inställningar. Kontrollera att bäddtemp och platta är konfigurerade för det nya materialet.
