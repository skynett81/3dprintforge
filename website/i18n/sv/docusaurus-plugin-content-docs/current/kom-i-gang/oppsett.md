---
sidebar_position: 2
title: Förstagångsinställning
description: Anslut din Bambu Lab-skrivare och konfigurera dashboardet
---

# Förstagångsinställning

När dashboardet körs för första gången öppnas installationsguiden automatiskt.

## Installationsguide

Guiden är tillgänglig på `https://din-server:3443/setup`. Den guidar dig genom:

1. Skapa administratörskonto
2. Lägg till skrivare
3. Testa anslutning
4. Konfigurera aviseringar (valfritt)

## Lägga till en skrivare

Du behöver tre saker för att ansluta till skrivaren:

| Fält | Beskrivning | Exempel |
|------|-------------|---------|
| IP-adress | Skrivarens lokala IP | `192.168.1.100` |
| Serienummer | 15 tecken, finns under skrivaren | `01P09C123456789` |
| Access Code | 8 tecken, finns i skrivarens nätverksinställningar | `12345678` |

### Hitta Access Code på skrivaren

**X1C / P1S / P1P:**
1. Gå till **Inställningar** på skärmen
2. Välj **WLAN** eller **LAN**
3. Leta efter **Access Code**

**A1 / A1 Mini:**
1. Tryck på skärmen och välj **Inställningar**
2. Gå till **WLAN**
3. Leta efter **Access Code**

:::tip Fast IP-adress
Ange en fast IP-adress för skrivaren i din router (DHCP-reservation). Då slipper du uppdatera dashboardet varje gång skrivaren får en ny IP.
:::

## AMS-konfiguration

När skrivaren är ansluten uppdateras AMS-statusen automatiskt. Du kan:

- Ge varje spår ett namn och en färg
- Koppla spolar till ditt filamentlager
- Se filamentförbrukning per spole

Gå till **Inställningar → Skrivare → AMS** för manuell konfiguration.

## HTTPS-certifikat {#https-certifikat}

### Självgenererat certifikat (standard)

Dashboardet genererar automatiskt ett självgenererat certifikat vid uppstart. För att lita på det i webbläsaren:

- **Chrome/Edge:** Klicka "Avancerat" → "Fortsätt till sidan"
- **Firefox:** Klicka "Avancerat" → "Acceptera risken och fortsätt"

### Eget certifikat

Lägg certifikatfilerna i mappen och konfigurera i `config.json`:

```json
{
  "ssl": {
    "cert": "/sökväg/till/cert.pem",
    "key": "/sökväg/till/key.pem"
  }
}
```

:::info Let's Encrypt
Använder du ett domännamn? Generera ett gratis certifikat med Let's Encrypt och Certbot, och peka `cert` och `key` till filerna i `/etc/letsencrypt/live/din-domän/`.
:::

## Miljövariabler

Alla inställningar kan åsidosättas med miljövariabler:

| Variabel | Standard | Beskrivning |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP-port |
| `HTTPS_PORT` | `3443` | HTTPS-port |
| `NODE_ENV` | `production` | Miljö |
| `AUTH_SECRET` | (auto) | JWT-hemlighet |

## Flerskrivar-inställning

Du kan lägga till flera skrivare under **Inställningar → Skrivare → Lägg till skrivare**. Använd skrivarväljarens överkant i dashboardet för att växla mellan dem.
