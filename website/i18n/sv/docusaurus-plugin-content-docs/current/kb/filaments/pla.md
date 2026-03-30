---
sidebar_position: 1
title: PLA
description: Guide till PLA-utskrift med Bambu Lab — temperatur, plattor, tips och varianter
---

# PLA

PLA (Polylactic Acid) är det mest nybörjarvänliga filamentet. Det skrivs ut lätt, ger fina ytor och kräver inget kammer eller specialbehandling.

## Inställningar

| Parameter | Standard PLA | PLA+ | PLA Silk |
|-----------|-------------|------|---------|
| Munstycketemperatur | 220 °C | 230 °C | 230 °C |
| Bäddtemperatur | 35–45 °C | 45–55 °C | 45–55 °C |
| Kammartemperatur | — | — | — |
| Delavkylning | 100% | 100% | 80% |
| Hastighet | Standard | Standard | 80% |
| Torkning behövs | Nej | Nej | Nej |

## Rekommenderade byggplattor

| Platta | Lämplighet | Limstift? |
|-------|---------|----------|
| Cool Plate (Smooth PEI) | Utmärkt | Nej |
| Textured PEI | Bra | Nej |
| Engineering Plate | Bra | Nej |
| High Temp Plate | Undvik | — |

## Tips för lyckad utskrift

- **Inget limstift behövs** — PLA häftar bra på de flesta plattor utan limstift
- **Låt plattan svalna** — PLA släpper lättare när den kyls till rumstemperatur
- **Första lagrets hastighet** — ställ in på 50–70% för bättre vidhäftning
- **Delavkylning** — håll på 100% för skarpare detaljer och bättre broar

:::tip Z-offset
Kalibrera Z-offset noggrant för första lagret. För PLA på Cool Plate: livejustera tills första lagret är lätt transparent och väl fastsatt, inte nedtryckt.
:::

## Varianter

### PLA+
Starkare och mer värmestabil än standard PLA. Körs något varmare (225–235 °C). Något mer flexibel och lättare att efterbehandla.

### PLA Silk
Ger blanka, metalliska ytor. Kräver lägre kylning och något lägre hastighet för bästa resultat. Broar är mer krävande.

### PLA-CF (kolfiberförstärkt)
Kolfiberförstärkt PLA ger ökad styvhet och är lätt. Kräver **härdat stålmunstycke** — använd aldrig vanligt messingmunstycke med CF-material.

### PLA Matte
Matt yta utan glans. Skrivs ut med samma inställningar som standard PLA.

## Förvaring

PLA absorberar inte fukt lika snabbt som PETG och PA, men bör ändå förvaras torrt:

- **Rekommenderat:** Förseglad påse med silikagel
- **Tecken på fuktigt filament:** Knackande ljud, bubblande yta, svag utskrift

Torka vid **45–55 °C i 4–6 timmar** vid behov.
