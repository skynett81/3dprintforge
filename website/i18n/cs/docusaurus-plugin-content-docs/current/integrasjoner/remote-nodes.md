---
sidebar_position: 4
title: Vzdálený server
description: Propojte více instancí Bambu Dashboard pro zobrazení všech tiskáren z jednoho centrálního dashboardu
---

# Vzdálený server (Remote Nodes)

Funkce vzdáleného serveru umožňuje propojit více instancí Bambu Dashboard tak, aby bylo možné zobrazit a ovládat všechny tiskárny z jediného centrálního rozhraní — bez ohledu na to, zda se nacházejí ve stejné síti nebo na různých místech.

Přejděte na: **https://localhost:3443/#settings** → **Integrace → Vzdálené servery**

## Případy použití

- **Domov + kancelář** — Zobrazení tiskáren na obou místech ze stejného dashboardu
- **Makerspace** — Centrální dashboard pro všechny instance v prostoru
- **Hostitelské instance** — Poskytnutí omezeného přístupu zákazníkům bez plného přístupu

## Architektura

```
Primární instance (váš PC)
  ├── Tiskárna A (lokální MQTT)
  ├── Tiskárna B (lokální MQTT)
  └── Vzdálený server: Sekundární instance
        ├── Tiskárna C (MQTT na vzdáleném místě)
        └── Tiskárna D (MQTT na vzdáleném místě)
```

Primární instance dotazuje vzdálené servery přes REST API a agreguje data lokálně.

## Přidání vzdáleného serveru

### Krok 1: Vygenerujte API klíč na vzdálené instanci

1. Přihlaste se do vzdálené instance (např. `https://192.168.2.50:3443`)
2. Přejděte na **Nastavení → API klíče**
3. Klikněte na **Nový klíč** → pojmenujte jej „Primární uzel"
4. Nastavte oprávnění: **Čtení** (minimum) nebo **Čtení + Zápis** (pro vzdálené ovládání)
5. Zkopírujte klíč

### Krok 2: Připojte se z primární instance

1. Přejděte na **Nastavení → Vzdálené servery**
2. Klikněte na **Přidat vzdálený server**
3. Vyplňte:
   - **Název**: např. „Kancelář" nebo „Garáž"
   - **URL**: `https://192.168.2.50:3443` nebo externí URL
   - **API klíč**: klíč z kroku 1
4. Klikněte na **Test připojení**
5. Klikněte na **Uložit**

:::warning Vlastní podepsaný certifikát
Pokud vzdálená instance používá vlastní podepsaný certifikát, aktivujte **Ignorovat TLS chyby** — ale pouze pro připojení v interní síti.
:::

## Agregované zobrazení

Po připojení se vzdálené tiskárny zobrazují v:

- **Přehledu flotily** — označeny názvem vzdáleného serveru a ikonou cloudu
- **Statistikách** — agregovány napříč všemi instancemi
- **Skladu filamentů** — celkový přehled

## Vzdálené ovládání

S oprávněním **Čtení + Zápis** lze vzdálené tiskárny ovládat přímo:

- Pauza / Obnovení / Zastavení
- Přidání do tiskové fronty (úloha je odeslána do vzdálené instance)
- Zobrazení kamerového streamu (proxováno přes vzdálenou instanci)

:::info Latence
Kamerový stream přes vzdálený server může mít znatelné zpoždění v závislosti na rychlosti sítě a vzdálenosti.
:::

## Řízení přístupu

Omezte, která data vzdálený server sdílí:

1. Na vzdálené instanci: přejděte na **Nastavení → API klíče → [Název klíče]**
2. Omezte přístup:
   - Pouze konkrétní tiskárny
   - Žádný kamerový stream
   - Pouze pro čtení

## Zdraví a monitorování

Stav každého vzdáleného serveru se zobrazuje v **Nastavení → Vzdálené servery**:

- **Připojeno** — poslední dotaz byl úspěšný
- **Odpojeno** — nelze dosáhnout vzdáleného serveru
- **Chyba autentizace** — API klíč je neplatný nebo vypršel
- **Poslední synchronizace** — časové razítko poslední úspěšné synchronizace dat
