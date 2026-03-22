---
sidebar_position: 5
title: Felsökning av misslyckad utskrift
description: Diagnostisera och lös vanliga utskriftsfel med hjälp av Bambu Dashboards felloggar och verktyg
---

# Felsökning av misslyckad utskrift

Gick något fel? Oroa dig inte — de flesta utskriftsfel har enkla lösningar. Bambu Dashboard hjälper dig att hitta orsaken snabbt.

## Steg 1 — Kontrollera HMS-felkoderna

HMS (Handling, Monitoring, Sensing) är Bambu Labs felsystem. Alla fel loggas automatiskt i instrumentpanelen.

1. Gå till **Övervakning → Fel**
2. Hitta den misslyckade utskriften
3. Klicka på felkoden för detaljerad beskrivning och föreslagen lösning

Vanliga HMS-koder:

| Kod | Beskrivning | Snabb lösning |
|-----|-------------|---------------|
| 0700 1xxx | AMS-fel (fastsittande, motorproblem) | Kontrollera filamentbana i AMS |
| 0300 0xxx | Extrusionsfel (under/över-extrusion) | Rengör munstycke, kontrollera filament |
| 0500 xxxx | Kalibrationsfel | Kör omklibration |
| 1200 xxxx | Temperaturavvikelse | Kontrollera kabelanslutningar |
| 0C00 xxxx | Kamerafel | Starta om skrivaren |

:::tip Felkoder i historiken
Under **Historik → [Utskrift] → HMS-logg** kan du se alla felkoder som uppstod under utskriften — även om utskriften "slutfördes".
:::

## Vanliga fel och lösningar

### Dålig vidhäftning (första lagret sitter inte fast)

**Symptom:** Utskriften lossnar från plattan, krullar sig, första lagret saknas

**Orsaker och lösningar:**

| Orsak | Lösning |
|-------|---------|
| Smutsig platta | Torka av med IPA-alkohol |
| Fel platttemperatur | Höj med 5°C |
| Z-offset fel | Kör Auto Bed Leveling igen |
| Saknar limstift (PETG/ABS) | Applicera tunt lager limstift |
| För snabb första-lagerhastighet | Sänk till 20–30 mm/s i första lager |

**Snabbchecklista:**
1. Är plattan ren? (IPA + luddfritt torkpapper)
2. Använder du rätt platta för filamenttypen? (se [Välja rätt platta](./velge-rett-plate))
3. Har Z-kalibreringen gjorts efter senaste plattbyte?

---

### Warping (hörnen lyfter sig)

**Symptom:** Hörnen böjer sig upp från plattan, särskilt på stora platta modeller

**Orsaker och lösningar:**

| Orsak | Lösning |
|-------|---------|
| Temperaturdifferens | Stäng frontluckan på skrivaren |
| Saknar brim | Aktivera brim i Bambu Studio (3–5 mm) |
| För kall platta | Höj platttemperaturen 5–10°C |
| Filament med hög krympning (ABS) | Använd Engineering Plate + kammare >40°C |

**ABS och ASA är särskilt utsatta.** Se alltid till att:
- Frontluckan är stängd
- Ventilation minimeras
- Engineering Plate + limstift
- Kammartemperatur 40°C+

---

### Stringing (trådar mellan delar)

**Symptom:** Fina plasttrådar mellan separata delar av modellen

**Orsaker och lösningar:**

| Orsak | Lösning |
|-------|---------|
| Fuktigt filament | Torka filament 6–8 timmar (60–70°C) |
| För hög munstyckstemperatur | Sänk med 5°C |
| För lite retraktion | Öka retraktionslängd i Bambu Studio |
| För låg reshastighet | Öka travel speed till 200+ mm/s |

**Fuktighetstest:** Lyssna efter knasterljud eller se efter bubblor i extrusionen — det tyder på fuktigt filament. Bambu AMS har inbyggd fuktighetsmätning; kontrollera fuktigheten under **AMS-status**.

:::tip Filamenttork
Investera i en filamenttork (t.ex. Bambu Filament Dryer) om du jobbar med nylon eller TPU — dessa absorberar fuktighet på under 12 timmar.
:::

---

### Spaghetti (utskriften kollapsar till en klump)

**Symptom:** Filament hänger i lösa trådar i luften, utskriften är inte igenkännlig

**Orsaker och lösningar:**

| Orsak | Lösning |
|-------|---------|
| Dålig vidhäftning tidigt → lossnade → kollapsade | Se vidhäftningsavsnittet ovan |
| För hög hastighet | Sänk hastigheten 20–30% |
| Fel stödkonfiguration | Aktivera stöd i Bambu Studio |
| Överhånget för brant | Dela modellen eller rotera 45° |

**Använd Print Guard för att stoppa spaghetti automatiskt** — se nästa avsnitt.

---

### Underextrusion (tunna, svaga lager)

**Symptom:** Lagren är inte solida, hål i väggar, svag modell

**Orsaker och lösningar:**

| Orsak | Lösning |
|-------|---------|
| Munstycket delvis tilltäppt | Kör Cold Pull (se underhåll) |
| Filament för fuktigt | Torka filament |
| För låg temperatur | Höj munstyckstemperatur 5–10°C |
| För hög hastighet | Sänk 20–30% |
| PTFE-rör skadat | Inspektera och byt PTFE-rör |

## Använda Print Guard för automatiskt skydd

Print Guard övervakar kamerabilder med bildigenkänning och stoppar utskriften automatiskt om spaghetti upptäcks.

**Aktivera Print Guard:**
1. Gå till **Övervakning → Print Guard**
2. Aktivera **Automatisk identifiering**
3. Välj åtgärd: **Pausa** (rekommenderat) eller **Avbryt**
4. Ange känslighet (börja med **Medium**)

**När Print Guard ingriper:**
1. Du får en avisering med en kamerabild av vad som identifierades
2. Utskriften sätts på paus
3. Du kan välja: **Fortsätt** (om falskt positivt) eller **Avbryt utskrift**

:::info Falska positiver
Print Guard kan ibland reagera på modeller med många tunna pelare. Sänk känsligheten eller inaktivera tillfälligt för komplexa modeller.
:::

## Diagnostikverktyg i instrumentpanelen

### Temperaturlogg
Under **Historik → [Utskrift] → Temperaturer** kan du se temperaturkurvan under hela utskriften. Håll utkik efter:
- Plötsliga temperaturfall (munstyckes- eller plattaproblem)
- Ojämna temperaturer (kalibreringsbehov)

### Filamentstatistik
Kontrollera om förbrukat filament stämmer överens med uppskattning. Stor avvikelse kan tyda på underextrusion eller filamentbrott.

## När ska du kontakta support?

Kontakta Bambu Labs support om:
- HMS-koden upprepas efter att du har följt alla lösningsförslag
- Du ser mekanisk skada på skrivaren (böjda stänger, trasiga kugghjul)
- Temperaturvärden är omöjliga (t.ex. munstycket läser -40°C)
- En firmware-uppdatering löser inte problemet

**Bra att ha redo till support:**
- HMS-felkoder från instrumentpanelens fellogg
- Kamerabild på felet
- Vilket filament och vilka inställningar som användes (kan exporteras från historiken)
- Skrivarmodell och firmware-version (visas under **Inställningar → Skrivare → Info**)
