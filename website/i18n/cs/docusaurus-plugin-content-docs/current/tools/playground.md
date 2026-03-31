---
sidebar_position: 4
title: API lekárna
description: Testujte všech 177 API endpointů přímo v prohlížeči s vestavěnou dokumentací OpenAPI a autentizací
---

# API lekárna

API lekárna vám umožňuje prozkoumat a testovat všech 177 API endpointů v 3DPrintForge přímo v prohlížeči — bez psaní kódu.

Přejděte na: **https://localhost:3443/api/docs**

## Co je API lekárna?

Lekárna je interaktivní verze dokumentace OpenAPI (Swagger UI), která je plně integrována s dashboardem. Pokud jste přihlášeni, jste již autentizováni, takže můžete endpointy testovat přímo.

## Navigace v dokumentaci

Endpointy jsou organizovány do kategorií:

| Kategorie | Počet endpointů | Popis |
|---|---|---|
| Tiskárny | 24 | Načtení stavu, ovládání, konfigurace |
| Tisky / Historie | 18 | Načtení, vyhledávání, export historie |
| Filament | 22 | Sklad, cívky, profily |
| Fronta | 12 | Správa tiskové fronty |
| Statistiky | 15 | Agregované statistiky a export |
| Upozornění | 8 | Konfigurace a testování kanálů |
| Uživatelé | 10 | Uživatelé, role, API klíče |
| Nastavení | 14 | Čtení a změna konfigurace |
| Údržba | 12 | Úlohy údržby a protokol |
| Integrace | 18 | HA, Tibber, webhooks atd. |
| Knihovna souborů | 14 | Nahrání, analýza, správa |
| Systém | 10 | Záloha, zdraví, protokol |

Kliknutím na kategorii ji rozbalíte a zobrazíte všechny endpointy.

## Testování endpointu

1. Klikněte na endpoint (např. `GET /api/printers`)
2. Klikněte na **Try it out** (vyzkoušet)
3. Vyplňte případné parametry (filtr, stránkování, ID tiskárny atd.)
4. Klikněte na **Execute**
5. Zobrazí se odpověď níže: HTTP stavový kód, hlavičky a tělo JSON

### Příklad: Načtení všech tiskáren

```
GET /api/printers
```
Vrátí seznam všech registrovaných tiskáren s aktuálním stavem.

### Příklad: Odeslání příkazu tiskárně

```
POST /api/printers/{id}/command
Body: {"command": "pause"}
```

:::warning Produkční prostředí
API lekárna je připojena ke skutečnému systému. Příkazy jsou odesílány skutečným tiskárnám. Buďte opatrní s destruktivními operacemi jako `DELETE` a `POST /command`.
:::

## Autentizace

### Autentizace relací (přihlášený uživatel)
Pokud jste přihlášeni do dashboardu, je lekárna již autentizována přes session cookie. Není potřeba žádná další konfigurace.

### Autentizace API klíčem

Pro externí přístup:

1. Klikněte na **Authorize** (ikona zámku v horní části lekárny)
2. Vyplňte svůj API klíč do pole **ApiKeyAuth**: `Bearer VÁŠ_KLÍČ`
3. Klikněte na **Authorize**

Vygenerujte API klíče v části **Nastavení → API klíče** (viz [Autentizace](../system/auth)).

## Omezení počtu požadavků

API má omezení počtu požadavků na **200 požadavků za minutu** na uživatele/klíč. Lekárna zobrazuje zbývající požadavky v hlavičce odpovědi `X-RateLimit-Remaining`.

:::info OpenAPI specifikace
Stáhněte celou specifikaci OpenAPI jako YAML nebo JSON:
- `https://localhost:3443/api/docs/openapi.yaml`
- `https://localhost:3443/api/docs/openapi.json`

Použijte specifikaci pro generování klientských knihoven v Pythonu, TypeScript, Go atd.
:::

## Testování webhooků

Testujte integrace webhooků přímo:

1. Přejděte na `POST /api/webhooks/test`
2. Vyberte typ události z rozbalovacího seznamu
3. Systém odešle testovací událost na nakonfigurovanou URL webhooků
4. Zobrazí se požadavek/odpověď v lekárně
