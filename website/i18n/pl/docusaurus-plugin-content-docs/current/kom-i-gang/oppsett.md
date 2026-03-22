---
sidebar_position: 2
title: Pierwsze uruchomienie
description: Podłącz drukarkę Bambu Lab i skonfiguruj dashboard
---

# Pierwsze uruchomienie

Gdy dashboard uruchomi się po raz pierwszy, kreator konfiguracji zostanie otwarty automatycznie.

## Kreator konfiguracji

Kreator jest dostępny pod adresem `https://twoj-serwer:3443/setup`. Przeprowadzi Cię przez:

1. Tworzenie konta administratora
2. Dodanie drukarki
3. Test połączenia
4. Konfigurację powiadomień (opcjonalnie)

## Dodawanie drukarki

Do podłączenia drukarki potrzebujesz trzech rzeczy:

| Pole | Opis | Przykład |
|------|------|---------|
| Adres IP | Lokalny adres IP drukarki | `192.168.1.100` |
| Numer seryjny | 15 znaków, znajduje się pod drukarką | `01P09C123456789` |
| Kod dostępu | 8 znaków, w ustawieniach sieciowych drukarki | `12345678` |

### Znajdź kod dostępu na drukarce

**X1C / P1S / P1P:**
1. Przejdź do **Ustawień** na ekranie
2. Wybierz **WLAN** lub **LAN**
3. Znajdź **Access Code**

**A1 / A1 Mini:**
1. Dotknij ekranu i wybierz **Ustawienia**
2. Przejdź do **WLAN**
3. Znajdź **Access Code**

:::tip Stały adres IP
Ustaw stały adres IP dla drukarki w swoim routerze (rezerwacja DHCP). Dzięki temu nie będziesz musiał aktualizować dashboardu za każdym razem, gdy drukarka otrzyma nowy adres IP.
:::

## Konfiguracja AMS

Po podłączeniu drukarki status AMS jest aktualizowany automatycznie. Możesz:

- Nadać każdemu slotowi nazwę i kolor
- Powiązać szpule z magazynem filamentów
- Przeglądać zużycie filamentu na szpulę

Przejdź do **Ustawienia → Drukarka → AMS**, aby dokonać ręcznej konfiguracji.

## Certyfikaty HTTPS {#https-sertifikater}

### Certyfikat samopodpisany (domyślny)

Dashboard automatycznie generuje samopodpisany certyfikat przy uruchomieniu. Aby mu zaufać w przeglądarce:

- **Chrome/Edge:** Kliknij „Zaawansowane" → „Przejdź do strony"
- **Firefox:** Kliknij „Zaawansowane" → „Akceptuj ryzyko i kontynuuj"

### Własny certyfikat

Umieść pliki certyfikatu w folderze i skonfiguruj w `config.json`:

```json
{
  "ssl": {
    "cert": "/ścieżka/do/cert.pem",
    "key": "/ścieżka/do/key.pem"
  }
}
```

:::info Let's Encrypt
Używasz nazwy domeny? Wygeneruj bezpłatny certyfikat za pomocą Let's Encrypt i Certbot, a następnie wskaż `cert` i `key` na pliki w `/etc/letsencrypt/live/twoja-domena/`.
:::

## Zmienne środowiskowe

Wszystkie ustawienia można nadpisać zmiennymi środowiskowymi:

| Zmienna | Domyślna | Opis |
|---------|---------|------|
| `PORT` | `3000` | Port HTTP |
| `HTTPS_PORT` | `3443` | Port HTTPS |
| `NODE_ENV` | `production` | Środowisko |
| `AUTH_SECRET` | (auto) | Sekret JWT |

## Konfiguracja wielu drukarek

Możesz dodać kolejne drukarki w **Ustawienia → Drukarki → Dodaj drukarkę**. Użyj selektora drukarki u góry dashboardu, aby przełączać się między nimi.
