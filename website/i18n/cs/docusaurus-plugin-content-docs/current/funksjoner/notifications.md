---
sidebar_position: 6
title: Oznámení
description: Nastavte oznámení přes Telegram, Discord, e-mail, webhook, ntfy, Pushover a SMS pro všechny události tiskárny
---

# Oznámení

Bambu Dashboard podporuje oznámení prostřednictvím řady kanálů, takže vždy víte, co se děje s vašimi tiskárnami — ať jste doma nebo na cestách.

Přejděte na: **https://localhost:3443/#settings** → záložka **Oznámení**

## Dostupné kanály

| Kanál | Vyžaduje | Podporuje obrázky |
|---|---|---|
| Telegram | Bot token + Chat-ID | ✅ |
| Discord | Webhook URL | ✅ |
| E-mail | SMTP server | ✅ |
| Webhook | URL + volitelný klíč | ✅ (base64) |
| ntfy | ntfy server + topic | ❌ |
| Pushover | API token + User-key | ✅ |
| SMS (Twilio) | Account SID + Auth token | ❌ |
| Browser push | Není potřeba konfigurace | ❌ |

## Nastavení pro každý kanál

### Telegram

1. Vytvořte bota přes [@BotFather](https://t.me/BotFather) — odešlete `/newbot`
2. Zkopírujte **bot token** (formát: `123456789:ABC-def...`)
3. Začněte konverzaci s botem a odešlete `/start`
4. Najděte své **Chat-ID**: přejděte na `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. V Bambu Dashboard: vložte token a Chat-ID, klikněte na **Test**

:::tip Skupinový kanál
Jako příjemce můžete použít skupinu Telegram. Chat-ID skupin začíná `-`.
:::

### Discord

1. Otevřete Discord server, na který chcete zasílat oznámení
2. Přejděte na nastavení kanálu → **Integrace → Webhooks**
3. Klikněte na **Nový webhook**, pojmenujte ho a vyberte kanál
4. Zkopírujte webhook URL
5. Vložte URL do Bambu Dashboard a klikněte na **Test**

### E-mail

1. Vyplňte SMTP server, port (obvykle 587 pro TLS)
2. Uživatelské jméno a heslo pro SMTP účet
3. Adresy **Od** a **Komu** (oddělené čárkou pro více adres)
4. Aktivujte **TLS/STARTTLS** pro zabezpečené odesílání
5. Kliknutím na **Test** odešlete testovací e-mail

:::warning Gmail
Použijte **Heslo aplikace** pro Gmail, ne běžné heslo. Nejprve aktivujte dvoufaktorové ověření ve svém účtu Google.
:::

### ntfy

1. Vytvořte topic na [ntfy.sh](https://ntfy.sh) nebo provozujte vlastní ntfy server
2. Vyplňte URL serveru (např. `https://ntfy.sh`) a název topicu
3. Nainstalujte aplikaci ntfy na mobil a přihlaste se k odběru stejného topicu
4. Klikněte na **Test**

### Pushover

1. Vytvořte účet na [pushover.net](https://pushover.net)
2. Vytvořte novou aplikaci — zkopírujte **API Token**
3. Najděte svůj **User Key** v dashboardu Pushover
4. Vyplňte obě hodnoty v Bambu Dashboard a klikněte na **Test**

### Webhook (vlastní)

Bambu Dashboard odesílá HTTP POST s JSON payload:

```json
{
  "event": "print_complete",
  "printer": "Moje X1C",
  "printer_id": "abc123",
  "timestamp": "2026-03-22T14:30:00Z",
  "data": {
    "file": "benchy.3mf",
    "duration_minutes": 47,
    "filament_used_g": 12.4
  }
}
```

Přidejte **Tajný klíč** pro ověření požadavků s podpisem HMAC-SHA256 v záhlaví `X-Bambu-Signature`.

## Filtr událostí

Vyberte, které události mají spouštět oznámení pro každý kanál:

| Událost | Popis |
|---|---|
| Tisk zahájen | Nový výtisk začíná |
| Tisk dokončen | Výtisk hotov (s obrázkem) |
| Tisk selhal | Výtisk přerušen s chybou |
| Tisk pozastaven | Ruční nebo automatická pauza |
| Print Guard upozornil | XCam nebo senzor spustil akci |
| Filament nízký | Cívka téměř prázdná |
| Chyba AMS | Ucpání, vlhký filament atd. |
| Tiskárna odpojena | Ztráta MQTT připojení |
| Odeslaná úloha z fronty | Úloha odeslána z fronty |

Zaškrtněte události, které chcete pro každý kanál individuálně.

## Tichá hodina

Vyhněte se oznámením v noci:

1. Aktivujte **Tichou hodinu** v nastavení oznámení
2. Nastavte časy **Od** a **Do** (např. 23:00 → 07:00)
3. Vyberte **Časové pásmo** pro hodinu
4. Kritická oznámení (chyby Print Guard) lze přepsat — zaškrtněte **Vždy posílat kritická**

## Browser push oznámení

Dostávejte oznámení přímo v prohlížeči bez aplikace:

1. Přejděte na **Nastavení → Oznámení → Browser Push**
2. Klikněte na **Aktivovat push oznámení**
3. Přijměte dialog o povolení z prohlížeče
4. Oznámení fungují i když je dashboard minimalizován (vyžaduje otevřenou záložku)

:::info PWA
Nainstalujte Bambu Dashboard jako PWA pro push oznámení na pozadí bez otevřené záložky. Viz [PWA](../system/pwa).
:::
