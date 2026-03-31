---
sidebar_position: 1
title: Print Guard
description: Automatisk övervakning med XCam-händelsedetektering, sensorövervakning och konfigurerbara åtgärder vid avvikelser
---

# Print Guard

Print Guard är 3DPrintForges realtidsövervakningssystem. Det övervakar kamera, sensorer och skrivardata kontinuerligt och utför konfigurerbara åtgärder när något är fel.

Gå till: **https://localhost:3443/#protection**

## XCam-händelsedetektering

Bambu Lab-skrivare skickar XCam-händelser via MQTT när AI-kameran upptäcker problem:

| Händelse | Kod | Allvarlighet |
|---|---|---|
| Spaghetti detekterad | `xcam_spaghetti` | Kritisk |
| Platta-häftningsfel | `xcam_detach` | Hög |
| Misslyckande första lager | `xcam_first_layer` | Hög |
| Stringing | `xcam_stringing` | Medium |
| Extruderingsfel | `xcam_extrusion` | Hög |

För varje händelsetyp kan du konfigurera en eller flera åtgärder:

- **Avisera** — skicka avisering via aktiva aviseringskanaler
- **Pausa** — sätt utskriften på paus för manuell kontroll
- **Stopp** — avbryt utskriften omedelbart
- **Ingen** — ignorera händelsen (logga den ändå)

:::danger Standardbeteende
Som standard är XCam-händelser inställda på **Avisera** och **Pausa**. Ändra till **Stopp** om du litar fullt på AI-detekteringen.
:::

## Sensorövervakning

Print Guard övervakar sensordata kontinuerligt och larmar vid avvikelser:

### Temperaturavvikelse

1. Gå till **Print Guard → Temperatur**
2. Ange **Max avvikelse från måltemperatur** (rekommenderat: ±5°C för munstycke, ±3°C för bädd)
3. Välj **Åtgärd vid avvikelse**: Avisera / Pausa / Stopp
4. Ange **Fördröjning** (sekunder) innan åtgärd utförs — ger temperaturen tid att stabilisera sig

### Filament lågt

Systemet beräknar återstående filament på spolarna:

1. Gå till **Print Guard → Filament**
2. Ange **Minimigräns** i gram (t.ex. 50 g)
3. Välj åtgärd: **Pausa och avisera** (rekommenderat) för att byta spole manuellt

### Utskriftstopp-detektering

Detekterar när utskriften har stoppat oväntat (MQTT-timeout, filamentbrott, o.s.v.):

1. Aktivera **Stoppdetektering**
2. Ange **Timeout** (rekommenderat: 120 sekunder utan data = stoppat)
3. Åtgärd: Avisera alltid — utskriften kan redan ha stoppat

## Konfiguration

### Aktivera Print Guard

1. Gå till **Inställningar → Print Guard**
2. Aktivera **Aktivera Print Guard**
3. Välj vilka skrivare som ska övervakas
4. Klicka **Spara**

### Per-skrivar-regler

Olika skrivare kan ha olika regler:

1. Klicka på en skrivare i Print Guard-översikten
2. Stäng av **Ärv globala regler**
3. Konfigurera egna regler för denna skrivare

## Logg och händelsehistorik

Alla Print Guard-händelser loggas:

- Gå till **Print Guard → Logg**
- Filtrera på skrivare, händelsetyp, datum och allvarlighetsgrad
- Klicka på en händelse för att se detaljerad information och eventuella åtgärder som utfördes
- Exportera logg till CSV

:::tip Falska positiver
Om Print Guard utlöser onödiga pauser, justera känsligheten under **Print Guard → Inställningar → Känslighet**. Börja med «Låg» och öka gradvis.
:::
