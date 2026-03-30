---
sidebar_position: 3
title: Bambu Cloud integrace
description: Propojte dashboard s Bambu Lab Cloud pro synchronizaci modelů a historie tisku
---

# Bambu Cloud integrace

Bambu Dashboard se může připojit k **Bambu Lab Cloud** pro načítání obrázků modelů, historie tisku a dat o filamentech. Dashboard funguje zcela bez cloudového připojení, ale cloud integrace přináší další výhody.

## Výhody cloud integrace

| Funkce | Bez cloudu | S cloudem |
|---------|-----------|----------|
| Živý stav tiskárny | Ano | Ano |
| Historie tisku (lokální) | Ano | Ano |
| Obrázky modelů z MakerWorld | Ne | Ano |
| Profily filamentů od Bambu | Ne | Ano |
| Synchronizace historie tisku | Ne | Ano |
| AMS filament z cloudu | Ne | Ano |

## Připojení k Bambu Cloud

1. Přejděte na **Nastavení → Bambu Cloud**
2. Zadejte e-mail a heslo pro Bambu Lab
3. Klikněte na **Přihlásit se**
4. Vyberte, která data se mají synchronizovat

:::warning Ochrana soukromí
Uživatelské jméno a heslo nejsou uloženy v čitelném textu. Dashboard používá API Bambu Labs k získání OAuth tokenu, který je uložen lokálně. Vaše data neopouštějí váš server.
:::

## Synchronizace

### Obrázky modelů

Když je cloud připojen, obrázky modelů se automaticky načítají z **MakerWorld** a zobrazují se v:
- Historii tisku
- Dashboardu (během aktivního tisku)
- 3D prohlížeči modelů

### Historie tisku

Cloud synchronizace importuje historii tisku z aplikace Bambu Lab. Duplikáty jsou automaticky filtrovány na základě časového razítka a sériového čísla.

### Profily filamentů

Oficiální profily filamentů Bambu Labs jsou synchronizovány a zobrazeny ve skladu filamentů. Můžete je použít jako výchozí bod pro vlastní profily.

## Co funguje bez cloudu?

Všechny základní funkce fungují bez cloudového připojení:

- Přímé MQTT připojení k tiskárně přes LAN
- Živý stav, teplota, kamera
- Lokální historie tisku a statistiky
- Sklad filamentů (spravován ručně)
- Upozornění a plánovač

:::tip Pouze LAN režim
Chcete používat dashboard zcela bez internetového připojení? Funguje skvěle v izolované síti — stačí se připojit k tiskárně přes IP a nechat cloud integraci vypnutou.
:::

## Řešení problémů

**Přihlášení selhává:**
- Zkontrolujte, zda je e-mail a heslo správné pro aplikaci Bambu Lab
- Zkontrolujte, zda účet používá dvoufaktorové ověřování (zatím není podporováno)
- Zkuste se odhlásit a znovu přihlásit

**Synchronizace se zastaví:**
- Token mohl vypršet — odhlaste se a znovu přihlaste v Nastavení
- Zkontrolujte internetové připojení serveru
