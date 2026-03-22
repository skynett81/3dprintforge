---
sidebar_position: 1
title: Uwierzytelnianie
description: Zarządzaj użytkownikami, rolami, uprawnieniami, kluczami API i uwierzytelnianiem dwuskładnikowym z TOTP
---

# Uwierzytelnianie

Bambu Dashboard obsługuje wielu użytkowników z kontrolą dostępu opartą na rolach, kluczami API i opcjonalnym uwierzytelnianiem dwuskładnikowym (2FA) przez TOTP.

Przejdź do: **https://localhost:3443/#settings** → **Użytkownicy i dostęp**

## Użytkownicy

### Tworzenie użytkownika

1. Przejdź do **Ustawienia → Użytkownicy**
2. Kliknij **Nowy użytkownik**
3. Wypełnij:
   - **Nazwa użytkownika** — używana do logowania
   - **Adres e-mail**
   - **Hasło** — zalecane minimum 12 znaków
   - **Rola** — patrz role poniżej
4. Kliknij **Utwórz**

Nowy użytkownik może teraz zalogować się na **https://localhost:3443/login**.

### Zmiana hasła

1. Przejdź do **Profil** (prawy górny róg → kliknij na nazwę użytkownika)
2. Kliknij **Zmień hasło**
3. Wypełnij aktualne hasło i nowe hasło
4. Kliknij **Zapisz**

Administratorzy mogą resetować hasła innych z **Ustawienia → Użytkownicy → [Użytkownik] → Resetuj hasło**.

## Role

| Rola | Opis |
|---|---|
| **Administrator** | Pełny dostęp — wszystkie ustawienia, użytkownicy i funkcje |
| **Operator** | Sterowanie drukarkami, widok wszystkiego, ale bez zmiany ustawień systemu |
| **Gość** | Tylko odczyt — widok dashboardu, historii i statystyk |
| **Użytkownik API** | Tylko dostęp do API — brak interfejsu webowego |

### Role niestandardowe

1. Przejdź do **Ustawienia → Role**
2. Kliknij **Nowa rola**
3. Wybierz uprawnienia indywidualnie:
   - Widok dashboardu / historii / statystyk
   - Sterowanie drukarkami (wstrzymaj/zatrzymaj/start)
   - Zarządzanie magazynem filamentów
   - Zarządzanie kolejką
   - Widok strumienia kamery
   - Zmiana ustawień
   - Zarządzanie użytkownikami
4. Kliknij **Zapisz**

## Klucze API

Klucze API zapewniają programowy dostęp bez logowania.

### Tworzenie klucza API

1. Przejdź do **Ustawienia → Klucze API**
2. Kliknij **Nowy klucz**
3. Wypełnij:
   - **Nazwa** — opisowa nazwa (np. „Home Assistant", „Skrypt Python")
   - **Data wygaśnięcia** — opcjonalna, ustaw dla bezpieczeństwa
   - **Uprawnienia** — wybierz rolę lub konkretne uprawnienia
4. Kliknij **Generuj**
5. **Skopiuj klucz teraz** — jest wyświetlany tylko raz

### Używanie klucza API

Dodaj do nagłówka HTTP dla wszystkich wywołań API:
```
Authorization: Bearer TWÓJ_KLUCZ_API
```

Zobacz [Plac zabaw API](../verktoy/playground) do testowania.

:::danger Bezpieczne przechowywanie
Klucze API mają taki sam dostęp jak użytkownik, z którym są powiązane. Przechowuj je bezpiecznie i regularnie je rotuj.
:::

## TOTP 2FA

Aktywuj uwierzytelnianie dwuskładnikowe za pomocą aplikacji uwierzytelniającej (Google Authenticator, Authy, Bitwarden itp.):

### Aktywowanie 2FA

1. Przejdź do **Profil → Bezpieczeństwo → Uwierzytelnianie dwuskładnikowe**
2. Kliknij **Aktywuj 2FA**
3. Zeskanuj kod QR aplikacją uwierzytelniającą
4. Wpisz wygenerowany 6-cyfrowy kod, aby potwierdzić
5. Zapisz **kody odzyskiwania** (10 jednorazowych kodów) w bezpiecznym miejscu
6. Kliknij **Aktywuj**

### Logowanie z 2FA

1. Wpisz nazwę użytkownika i hasło jak zwykle
2. Wpisz 6-cyfrowy kod TOTP z aplikacji
3. Kliknij **Zaloguj się**

### Wymuszenie 2FA dla wszystkich użytkowników

Administratorzy mogą wymagać 2FA dla wszystkich użytkowników:

1. Przejdź do **Ustawienia → Bezpieczeństwo → Wymuś 2FA**
2. Aktywuj ustawienie
3. Użytkownicy bez 2FA będą zmuszeni je skonfigurować przy następnym logowaniu

## Zarządzanie sesjami

- Domyślny czas trwania sesji: 24 godziny
- Dostosuj w **Ustawienia → Bezpieczeństwo → Czas trwania sesji**
- Przeglądaj aktywne sesje na użytkownika i kończ poszczególne sesje
