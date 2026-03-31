---
sidebar_position: 7
title: Nastavení upozornění
description: Nakonfigurujte Telegram, Discord, e-mail a push upozornění v 3DPrintForge
---

# Nastavení upozornění

3DPrintForge vás může upozorňovat na vše — od dokončených tisků po kritické chyby — prostřednictvím Telegramu, Discordu, e-mailu nebo push upozornění prohlížeče.

## Přehled kanálů upozornění

| Kanál | Nejlepší pro | Vyžaduje |
|-------|-------------|---------|
| Telegram | Rychle, odkudkoli | Účet Telegram + token bota |
| Discord | Tým/komunita | Server Discord + URL webhooku |
| E-mail (SMTP) | Oficiální upozornění | SMTP server |
| Push prohlížeče | Upozornění na ploše | Prohlížeč s podporou push |

---

## Bot Telegram

### Krok 1 — Vytvořte bota

1. Otevřete Telegram a vyhledejte **@BotFather**
2. Odešlete `/newbot`
3. Dejte botovi jméno (např. "Bambu Upozornění")
4. Dejte botovi uživatelské jméno (např. `bambu_upozorneni_bot`) — musí končit na `bot`
5. BotFather odpoví s **API tokenem**: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
6. Zkopírujte a uložte tento token

### Krok 2 — Najděte své Chat ID

1. Zahajte konverzaci s vaším botem (vyhledejte uživatelské jméno a klikněte na **Start**)
2. Odešlete botovi zprávu (např. "ahoj")
3. Přejděte na `https://api.telegram.org/bot<VÁŠ_TOKEN>/getUpdates` v prohlížeči
4. Najděte `"chat":{"id": 123456789}` — to je vaše Chat ID

### Krok 3 — Připojte k panelu

1. Přejděte do **Nastavení → Upozornění → Telegram**
2. Vložte **Token bota**
3. Vložte **Chat ID**
4. Klikněte na **Otestovat upozornění** — měli byste obdržet testovací zprávu v Telegramu
5. Klikněte na **Uložit**

:::tip Skupinové upozornění
Chcete upozorňovat celou skupinu? Přidejte bota do skupiny Telegram, najděte skupinové Chat ID (záporné číslo, např. `-100123456789`) a použijte ho místo osobního.
:::

---

## Webhook Discord

### Krok 1 — Vytvořte webhook v Discordu

1. Přejděte na svůj server Discord
2. Pravým tlačítkem klikněte na kanál, kde chcete dostávat upozornění → **Upravit kanál**
3. Přejděte do **Integrace → Webhooky**
4. Klikněte na **Nový Webhook**
5. Dejte mu jméno (např. "3DPrintForge")
6. Zvolte avatar (volitelné)
7. Klikněte na **Kopírovat URL Webhooku**

URL vypadá takto:
```
https://discord.com/api/webhooks/123456789/abcdefghijk...
```

### Krok 2 — Přidejte do panelu

1. Přejděte do **Nastavení → Upozornění → Discord**
2. Vložte **URL Webhooku**
3. Klikněte na **Otestovat upozornění** — kanál Discord by měl obdržet testovací zprávu
4. Klikněte na **Uložit**

---

## E-mail (SMTP)

### Potřebné informace

Potřebujete nastavení SMTP od svého poskytovatele e-mailu:

| Poskytovatel | SMTP server | Port | Šifrování |
|-------------|------------|------|-----------|
| Gmail | smtp.gmail.com | 587 | TLS |
| Outlook/Hotmail | smtp-mail.outlook.com | 587 | TLS |
| Yahoo | smtp.mail.yahoo.com | 587 | TLS |
| Vlastní doména | smtp.vasadomena.cz | 587 | TLS |

:::warning Gmail vyžaduje heslo aplikace
Gmail blokuje přihlášení s normálním heslem. Musíte vytvořit **Heslo aplikace** v účtu Google → Zabezpečení → Dvoufázové ověření → Hesla aplikací.
:::

### Konfigurace v panelu

1. Přejděte do **Nastavení → Upozornění → E-mail**
2. Vyplňte:
   - **SMTP server**: např. `smtp.gmail.com`
   - **Port**: `587`
   - **Uživatelské jméno**: vaše e-mailová adresa
   - **Heslo**: heslo aplikace nebo normální heslo
   - **Adresa od**: e-mail, ze kterého se odesílá upozornění
   - **Adresa komu**: e-mail, na který chcete dostávat upozornění
3. Klikněte na **Otestovat e-mail**
4. Klikněte na **Uložit**

---

## Push upozornění prohlížeče

Push upozornění se zobrazují jako systémová upozornění na ploše — i když je záložka prohlížeče na pozadí.

**Aktivace:**
1. Přejděte do **Nastavení → Upozornění → Push upozornění**
2. Klikněte na **Aktivovat push upozornění**
3. Prohlížeč požádá o povolení — klikněte na **Povolit**
4. Klikněte na **Otestovat upozornění**

:::info Pouze v prohlížeči, kde jste to aktivovali
Push upozornění jsou vázána na konkrétní prohlížeč a zařízení. Aktivujte na každém zařízení, kde chcete dostávat upozornění.
:::

---

## Výběr událostí pro upozornění

Po nastavení kanálu upozornění si můžete přesně vybrat, které události spustí upozornění:

**V Nastavení → Upozornění → Události:**

| Událost | Doporučeno |
|---------|-----------|
| Tisk dokončen | Ano |
| Tisk se nezdařil / zrušen | Ano |
| Print Guard: spaghetti zjištěno | Ano |
| Chyba HMS (kritická) | Ano |
| Varování HMS | Volitelné |
| Nízká hladina filamentu | Ano |
| Chyba AMS | Ano |
| Tiskárna odpojena | Volitelné |
| Připomínka údržby | Volitelné |
| Noční záloha dokončena | Ne (rušivé) |

---

## Tichá hodiny (bez upozornění v noci)

Vyvarujte se probuzení dokončeným tiskem ve 03:00:

1. Přejděte do **Nastavení → Upozornění → Tichá hodiny**
2. Aktivujte **Tichá hodiny**
3. Nastavte čas od-do (např. **22:00 do 07:00**)
4. Zvolte, které události mohou v tichém období přesto upozorňovat:
   - **Kritické chyby HMS** — doporučeno ponechat aktivní
   - **Print Guard** — doporučeno ponechat aktivní
   - **Tisk dokončen** — lze vypnout v noci

:::tip Noční tisky bez rušení
Spouštějte tisky v noci s aktivovanými tichými hodinami. Print Guard hlídá — a ráno dostanete shrnutí.
:::
