---
sidebar_position: 5
title: Utskriftskö
description: Planera och automatisera utskrifter med prioriterad kö, automatisk dispatch och staggered start
---

# Utskriftskö

Utskriftskön låter dig planera utskrifter i förväg och skicka dem automatiskt till tillgängliga skrivare när de är lediga.

Gå till: **https://localhost:3443/#queue**

## Skapa en kö

1. Gå till **Utskriftskö** i navigationsmenyn
2. Klicka **Nytt jobb** (+ ikon)
3. Fyll i:
   - **Filnamn** — ladda upp `.3mf` eller `.gcode`
   - **Målskrivare** — välj specifik skrivare eller **Automatisk**
   - **Prioritet** — Låg / Normal / Hög / Kritisk
   - **Planerad start** — nu eller ett bestämt datum/klockslag
4. Klicka **Lägg till i kö**

:::tip Dra och släpp
Du kan dra filer direkt från filutforskaren till kösidan för att lägga till dem snabbt.
:::

## Lägga till filer

### Ladda upp fil

1. Klicka **Ladda upp** eller dra en fil till uppladdningsfältet
2. Format som stöds: `.3mf`, `.gcode`, `.bgcode`
3. Filen sparas i filbiblioteket och kopplas till köjobbet

### Från filbiblioteket

1. Gå till **Filbibliotek** och hitta filen
2. Klicka **Lägg till i kö** på filen
3. Jobbet skapas med standardinställningar — redigera om nödvändigt

### Från historik

1. Öppna en tidigare utskrift i **Historik**
2. Klicka **Skriv ut igen**
3. Jobbet läggs till med samma inställningar som sist

## Prioritet

Kön behandlas i prioritetsordning:

| Prioritet | Färg | Beskrivning |
|---|---|---|
| Kritisk | Röd | Skickas till första lediga skrivare oavsett andra jobb |
| Hög | Orange | Framför normala och låga jobb |
| Normal | Blå | Standardordning (FIFO) |
| Låg | Grå | Skickas bara när inga högre jobb väntar |

Dra och släpp jobb i kön för att ändra ordningen manuellt inom samma prioritetsnivå.

## Automatisk dispatch

När **Automatisk dispatch** är aktiverat övervakar 3DPrintForge alla skrivare och skickar nästa jobb automatiskt:

1. Gå till **Inställningar → Kö**
2. Aktivera **Automatisk dispatch**
3. Välj **Dispatch-strategi**:
   - **Första lediga** — skickar till första skrivare som blir ledig
   - **Minst använd** — prioriterar skrivaren med färst utskrifter idag
   - **Round-robin** — roterar jämnt mellan alla skrivare

:::warning Bekräftelse
Aktivera **Kräv bekräftelse** i inställningarna om du vill godkänna varje dispatch manuellt innan filen skickas.
:::

## Staggered start (förskjuten start)

Staggered start är användbart för att undvika att alla skrivare startar och slutar samtidigt:

1. I dialogen **Nytt jobb**, expandera **Avancerade inställningar**
2. Aktivera **Staggered start**
3. Ange **Fördröjning mellan skrivare** (t.ex. 30 minuter)
4. Systemet fördelar starttiderna automatiskt

**Exempel:** 4 identiska jobb med 30 minuters fördröjning startar kl. 08:00, 08:30, 09:00 och 09:30.

## Köstatus och uppföljning

Kööversikten visar alla jobb med status:

| Status | Beskrivning |
|---|---|
| Väntar | Jobbet är i kö och väntar på skrivare |
| Planerat | Har planerat starttidpunkt i framtiden |
| Skickar | Överförs till skrivare |
| Skriver | Pågår på vald skrivare |
| Slutförd | Klar — kopplas till historik |
| Misslyckades | Fel vid sändning eller under utskrift |
| Avbruten | Manuellt avbruten |

:::info Aviseringar
Aktivera aviseringar för köhändelser under **Inställningar → Aviseringar → Kö** för att få meddelande när ett jobb startar, slutförs eller misslyckas. Se [Aviseringar](./notifications).
:::
