---
sidebar_position: 2
title: Prvotní nastavení
description: Připojte svou tiskárnu Bambu Lab a nakonfigurujte dashboard
---

# Prvotní nastavení

Při prvním spuštění dashboardu se automaticky otevře průvodce nastavením.

## Průvodce nastavením

Průvodce je dostupný na `https://váš-server:3443/setup`. Provede vás kroky:

1. Vytvoření administrátorského uživatele
2. Přidání tiskárny
3. Test připojení
4. Konfigurace upozornění (volitelné)

## Přidání tiskárny

Pro připojení tiskárny potřebujete tři věci:

| Pole | Popis | Příklad |
|------|-------------|---------|
| IP adresa | Lokální IP tiskárny | `192.168.1.100` |
| Sériové číslo | 15 znaků, uvedeno pod tiskárnou | `01P09C123456789` |
| Access Code | 8 znaků, dostupný v nastavení sítě tiskárny | `12345678` |

### Najděte Access Code na tiskárně

**X1C / P1S / P1P:**
1. Přejděte na **Nastavení** na obrazovce
2. Vyberte **WLAN** nebo **LAN**
3. Vyhledejte **Access Code**

**A1 / A1 Mini:**
1. Klepněte na obrazovku a vyberte **Nastavení**
2. Přejděte na **WLAN**
3. Vyhledejte **Access Code**

:::tip Pevná IP adresa
Nastavte pevnou IP adresu tiskárny ve vašem routeru (rezervace DHCP). Tím se vyhnete nutnosti aktualizovat dashboard pokaždé, když tiskárna získá novou IP.
:::

## Konfigurace AMS

Po připojení tiskárny se stav AMS aktualizuje automaticky. Můžete:

- Pojmenovat každou pozici a nastavit barvu
- Propojit cívky se skladem filamentů
- Sledovat spotřebu filamentu na cívku

Přejděte na **Nastavení → Tiskárna → AMS** pro ruční konfiguraci.

## HTTPS certifikáty {#https-sertifikater}

### Vlastní podepsaný certifikát (výchozí)

Dashboard při spuštění automaticky vygeneruje vlastní podepsaný certifikát. Pro důvěřování mu v prohlížeči:

- **Chrome/Edge:** Klikněte na „Rozšířené" → „Pokračovat na stránku"
- **Firefox:** Klikněte na „Rozšířené" → „Přijmout riziko a pokračovat"

### Vlastní certifikát

Umístěte soubory certifikátu do složky a nakonfigurujte v `config.json`:

```json
{
  "ssl": {
    "cert": "/cesta/k/cert.pem",
    "key": "/cesta/k/key.pem"
  }
}
```

:::info Let's Encrypt
Používáte doménové jméno? Vygenerujte bezplatný certifikát pomocí Let's Encrypt a Certbot a nastavte `cert` a `key` na soubory v `/etc/letsencrypt/live/vaše-doména/`.
:::

## Proměnné prostředí

Všechna nastavení lze přepsat proměnnými prostředí:

| Proměnná | Výchozí | Popis |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP port |
| `HTTPS_PORT` | `3443` | HTTPS port |
| `NODE_ENV` | `production` | Prostředí |
| `AUTH_SECRET` | (auto) | JWT tajemství |

## Nastavení více tiskáren

Další tiskárny lze přidat v části **Nastavení → Tiskárny → Přidat tiskárnu**. Pomocí výběru tiskárny v horní části dashboardu lze přepínat mezi nimi.
