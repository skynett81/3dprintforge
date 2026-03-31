---
sidebar_position: 1
title: Váš první tisk
description: Průvodce krok za krokem pro zahájení prvního 3D tisku a jeho sledování v 3DPrintForge
---

# Váš první tisk

Tento průvodce vás provede celým procesem — od připojené tiskárny k hotovému výtisku — s 3DPrintForge jako řídicím centrem.

## Krok 1 — Ověřte připojení tiskárny

Při otevření panelu uvidíte stavovou kartu tiskárny v horní části postranního panelu nebo na přehledovém panelu.

**Zelený stav** znamená, že tiskárna je online a připravena.

| Stav | Barva | Význam |
|------|-------|--------|
| Online | Zelená | Připravena k tisku |
| Nečinná | Šedá | Připojena, ale neaktivní |
| Tiskne | Modrá | Probíhá tisk |
| Chyba | Červená | Vyžaduje pozornost |

Pokud tiskárna zobrazuje červený stav:
1. Zkontrolujte, zda je tiskárna zapnutá
2. Ověřte, zda je připojena ke stejné síti jako panel
3. Přejděte do **Nastavení → Tiskárny** a potvrďte IP adresu a přístupový kód

:::tip Používejte LAN režim pro rychlejší odezvu
LAN režim poskytuje nižší latenci než cloudový režim. Aktivujte jej v nastavení tiskárny, pokud jsou tiskárna a panel ve stejné síti.
:::

## Krok 2 — Nahrajte svůj model

3DPrintForge nespouští tisky přímo — to je práce Bambu Studia nebo MakerWorld. Panel převezme kontrolu, jakmile tisk začne.

**Přes Bambu Studio:**
1. Otevřete Bambu Studio na svém počítači
2. Importujte nebo otevřete soubor `.stl` nebo `.3mf`
3. Nakrájejte model (zvolte filament, podpory, výplň atd.)
4. Klikněte na **Tisknout** vpravo nahoře

**Přes MakerWorld:**
1. Najděte model na [makerworld.com](https://makerworld.com)
2. Klikněte na **Tisknout** přímo na webu
3. Bambu Studio se automaticky otevře s připraveným modelem

## Krok 3 — Spusťte tisk

V Bambu Studiu zvolte způsob odeslání:

| Metoda | Požadavky | Výhody |
|--------|-----------|--------|
| **Cloud** | Účet Bambu + internet | Funguje odkudkoli |
| **LAN** | Stejná síť | Rychlejší, bez cloudu |
| **SD karta** | Fyzický přístup | Bez síťových požadavků |

Klikněte na **Odeslat** — tiskárna obdrží úlohu a automaticky zahájí fázi zahřívání.

:::info Tisk se zobrazí v panelu
Několik sekund poté, co Bambu Studio odešle úlohu, se aktivní tisk zobrazí v panelu pod **Aktivní tisk**.
:::

## Krok 4 — Sledování v panelu

Zatímco tisk probíhá, panel vám poskytne úplný přehled:

### Průběh
- Procento dokončení a odhadovaná zbývající doba se zobrazují na kartě tiskárny
- Klikněte na kartu pro podrobné zobrazení s informacemi o vrstvách

### Teploty
Panel s podrobnostmi zobrazuje teploty v reálném čase:
- **Tryska** — aktuální a cílová teplota
- **Tisková deska** — aktuální a cílová teplota
- **Komora** — teplota vzduchu uvnitř tiskárny (důležité pro ABS/ASA)

### Kamera
Klikněte na ikonu kamery na kartě tiskárny pro zobrazení živého přenosu přímo v panelu. Kameru můžete mít otevřenou v samostatném okně, zatímco děláte jiné věci.

:::warning Sledujte první vrstvy
Prvních 3–5 vrstev je kritických. Špatná přilnavost nyní znamená neúspěšný tisk později. Sledujte kameru a ověřte, zda se filament ukládá čistě a rovnoměrně.
:::

### Print Guard
3DPrintForge má **Print Guard** poháněný umělou inteligencí, který automaticky detekuje chyby "spaghetti" a může tisk pozastavit. Aktivujte jej v **Monitorování → Print Guard**.

## Krok 5 — Po dokončení tisku

Když je tisk hotov, panel zobrazí zprávu o dokončení (a odešle upozornění, pokud máte nastavena [upozornění](./notification-setup)).

### Zkontrolujte historii
Přejděte do **Historie** na postranním panelu pro zobrazení dokončeného tisku:
- Celková doba tisku
- Spotřeba filamentu (použité gramy, odhadované náklady)
- Chyby nebo události HMS během tisku
- Snímek kamery při ukončení (je-li aktivováno)

### Přidejte poznámku
Klikněte na tisk v historii a přidejte poznámku — např. "Potřeboval trochu větší okraj" nebo "Perfektní výsledek". Užitečné, když budete tisknout stejný model znovu.

### Zkontrolujte spotřebu filamentu
V části **Filament** vidíte, že hmotnost cívky byla aktualizována na základě spotřebovaného materiálu. Panel to automaticky odečte.

## Tipy pro začátečníky

:::tip Neopouštějte první tisk
Sledujte prvních 10–15 minut. Jakmile jste přesvědčeni, že tisk dobře přilnul, můžete nechat panel sledovat zbytek.
:::

- **Važte prázdné cívky** — zadejte počáteční hmotnost cívek pro přesný výpočet zbytku (viz [Správa filamentů](./filament-setup))
- **Nastavte upozornění Telegram** — dostávejte zprávu, když je tisk hotov, aniž byste čekali (viz [Upozornění](./notification-setup))
- **Kontrolujte tiskovou desku** — čistá deska = lepší přilnavost. Otřete IPA (isopropanolem) mezi tisky
- **Používejte správnou desku** — viz [Výběr správné tiskové desky](./choosing-plate), co se hodí pro váš filament
