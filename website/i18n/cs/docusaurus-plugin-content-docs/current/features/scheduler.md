---
sidebar_position: 4
title: Plánovač
description: Plánujte tisky, spravujte frontu tisků a nastavte automatické odesílání
---

# Plánovač

Plánovač vám umožňuje organizovat a automatizovat tiskové úlohy s kalendářním zobrazením a inteligentní frontou tisků.

## Kalendářní zobrazení

Kalendářní zobrazení poskytuje přehled všech naplánovaných a dokončených tisků:

- **Zobrazení měsíce, týdne a dne** — vyberte úroveň detailu
- **Barevné kódování** — různé barvy pro každou tiskárnu a stav
- **Kliknutí na událost** — zobrazení podrobností tisku

Dokončené tisky se zobrazují automaticky na základě historie tisků.

## Fronta tisků

Fronta tisků umožňuje řadit úlohy, které se odesílají na tiskárnu v pořadí:

### Přidání úlohy do fronty

1. Klikněte na **+ Přidat úlohu**
2. Vyberte soubor (z SD karty tiskárny, místního nahrání nebo FTP)
3. Zadejte prioritu (vysoká, normální, nízká)
4. Vyberte cílovou tiskárnu (nebo "automaticky")
5. Klikněte na **Přidat**

### Správa fronty

| Akce | Popis |
|----------|-------------|
| Přetáhnout | Přeorganizovat pořadí |
| Pozastavit frontu | Dočasně zastavit odesílání |
| Přeskočit | Odeslat další úlohu bez čekání |
| Smazat | Odebrat úlohu z fronty |

:::tip Dispatch pro více tiskáren
S více tiskárnami může fronta automaticky distribuovat úlohy na volné tiskárny. Aktivujte **Automatické odesílání** v části **Plánovač → Nastavení**.
:::

## Naplánované tisky

Nastavte tisky, které se mají spustit v určený čas:

1. Klikněte na **+ Naplánovat tisk**
2. Vyberte soubor a tiskárnu
3. Zadejte čas spuštění
4. Nastavte oznámení (volitelné)
5. Uložte

:::warning Tiskárna musí být volná
Naplánované tisky se spustí pouze pokud je tiskárna v pohotovostním režimu v daném čase. Pokud je tiskárna zaneprázdněna, spuštění se odloží na příštější dostupný čas (konfigurovatelné).
:::

## Vyrovnávání zátěže

S automatickým vyrovnáváním zátěže se úlohy inteligentně distribuují mezi tiskárny:

- **Round-robin** — rovnoměrné rozdělení mezi všechny tiskárny
- **Nejméně zaneprázdněná** — odesílání na tiskárnu s nejkratším odhadovaným časem dokončení
- **Ručně** — sami vyberete tiskárnu pro každou úlohu

Nastavte v části **Plánovač → Vyrovnávání zátěže**.

## Oznámení

Plánovač se integruje s kanály oznámení:

- Oznámení při spuštění úlohy
- Oznámení při dokončení úlohy
- Oznámení při chybě nebo zpoždění

Viz [Přehled funkcí](./overview#varsler) pro nastavení kanálů oznámení.
