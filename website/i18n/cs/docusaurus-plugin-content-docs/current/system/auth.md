---
sidebar_position: 1
title: Autentizace
description: Spravujte uživatele, role, oprávnění, API klíče a dvoufaktorovou autentizaci pomocí TOTP
---

# Autentizace

Bambu Dashboard podporuje více uživatelů s řízením přístupu na základě rolí, API klíče a volitelnou dvoufaktorovou autentizaci (2FA) přes TOTP.

Přejděte na: **https://localhost:3443/#settings** → **Uživatelé a přístup**

## Uživatelé

### Vytvoření uživatele

1. Přejděte na **Nastavení → Uživatelé**
2. Klikněte na **Nový uživatel**
3. Vyplňte:
   - **Uživatelské jméno** — používá se pro přihlášení
   - **E-mailová adresa**
   - **Heslo** — doporučeno minimum 12 znaků
   - **Role** — viz role níže
4. Klikněte na **Vytvořit**

Nový uživatel se nyní může přihlásit na **https://localhost:3443/login**.

### Změna hesla

1. Přejděte na **Profil** (pravý horní roh → klikněte na uživatelské jméno)
2. Klikněte na **Změnit heslo**
3. Zadejte aktuální heslo a nové heslo
4. Klikněte na **Uložit**

Administrátoři mohou resetovat hesla ostatních z části **Nastavení → Uživatelé → [Uživatel] → Resetovat heslo**.

## Role

| Role | Popis |
|---|---|
| **Administrátor** | Plný přístup — všechna nastavení, uživatelé a funkce |
| **Operátor** | Ovládání tiskáren, zobrazení všeho, ale ne změna systémových nastavení |
| **Host** | Pouze čtení — zobrazení dashboardu, historie a statistik |
| **API uživatel** | Pouze přístup přes API — žádné webové rozhraní |

### Vlastní role

1. Přejděte na **Nastavení → Role**
2. Klikněte na **Nová role**
3. Vyberte oprávnění jednotlivě:
   - Zobrazit dashboard / historii / statistiky
   - Ovládat tiskárny (pauza/stop/start)
   - Spravovat sklad filamentů
   - Spravovat frontu
   - Zobrazit kamerový stream
   - Změnit nastavení
   - Spravovat uživatele
4. Klikněte na **Uložit**

## API klíče

API klíče umožňují programový přístup bez přihlášení.

### Vytvoření API klíče

1. Přejděte na **Nastavení → API klíče**
2. Klikněte na **Nový klíč**
3. Vyplňte:
   - **Název** — popisný název (např. „Home Assistant", „Python skript")
   - **Datum vypršení** — volitelné, nastavte pro bezpečnost
   - **Oprávnění** — vyberte roli nebo konkrétní oprávnění
4. Klikněte na **Vygenerovat**
5. **Zkopírujte klíč nyní** — zobrazí se pouze jednou

### Použití API klíče

Přidejte do HTTP hlavičky pro všechna volání API:
```
Authorization: Bearer VÁŠ_API_KLÍČ
```

Viz [API lekárna](../verktoy/playground) pro testování.

:::danger Bezpečné uložení
API klíče mají stejný přístup jako uživatel, se kterým jsou spojeny. Uchovávejte je bezpečně a pravidelně je obměňujte.
:::

## TOTP 2FA

Aktivujte dvoufaktorovou autentizaci s autentizační aplikací (Google Authenticator, Authy, Bitwarden atd.):

### Aktivace 2FA

1. Přejděte na **Profil → Zabezpečení → Dvoufaktorová autentizace**
2. Klikněte na **Aktivovat 2FA**
3. Naskenujte QR kód autentizační aplikací
4. Zadejte vygenerovaný 6místný kód pro potvrzení
5. Uložte **obnovovací kódy** (10 jednorázových kódů) na bezpečném místě
6. Klikněte na **Aktivovat**

### Přihlášení s 2FA

1. Zadejte uživatelské jméno a heslo jako obvykle
2. Zadejte 6místný TOTP kód z aplikace
3. Klikněte na **Přihlásit se**

### Vynucení 2FA pro všechny uživatele

Administrátoři mohou vyžadovat 2FA pro všechny uživatele:

1. Přejděte na **Nastavení → Zabezpečení → Vynutit 2FA**
2. Aktivujte nastavení
3. Uživatelé bez 2FA budou nuceni ji nastavit při příštím přihlášení

## Správa relací

- Výchozí délka relace: 24 hodin
- Upravte v části **Nastavení → Zabezpečení → Délka relace**
- Zobrazujte aktivní relace pro každého uživatele a ukončujte jednotlivé relace
