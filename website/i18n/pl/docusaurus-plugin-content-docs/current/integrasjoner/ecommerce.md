---
sidebar_position: 5
title: E-handel
description: Zarządzaj zamówieniami, klientami i fakturowaniem dla sprzedaży wydruków 3D — wymaga licencji od geektech.no
---

# E-handel

Moduł e-handlu zapewnia kompletny system do zarządzania klientami, zamówieniami i fakturowaniem — idealny dla tych, którzy sprzedają wydruki 3D profesjonalnie lub półprofesjonalnie.

Przejdź do: **https://localhost:3443/#orders**

:::danger Wymagana licencja e-handlu
Moduł e-handlu wymaga ważnej licencji. Licencje można **kupić wyłącznie przez [geektech.no](https://geektech.no)**. Bez aktywnej licencji moduł jest zablokowany i niedostępny.
:::

## Licencja — zakup i aktywacja

### Kupowanie licencji

1. Przejdź do **[geektech.no](https://geektech.no)** i utwórz konto
2. Wybierz **Bambu Dashboard — licencja e-handlu**
3. Wybierz typ licencji:

| Typ licencji | Opis | Drukarki |
|---|---|---|
| **Hobby** | Jedna drukarka, użytek osobisty i drobna sprzedaż | 1 |
| **Profesjonalny** | Do 5 drukarek, użytek komercyjny | 1–5 |
| **Enterprise** | Nieograniczona liczba drukarek, pełne wsparcie | Nieograniczone |

4. Dokończ płatność
5. Otrzymasz **klucz licencyjny** na e-mail

### Aktywowanie licencji

1. Przejdź do **Ustawienia → E-handel** w dashboardzie
2. Wklej **klucz licencyjny** w polu
3. Kliknij **Aktywuj licencję**
4. Dashboard uwierzytelnia klucz w serwerach geektech.no
5. Po pomyślnej aktywacji wyświetlany jest typ licencji, data wygaśnięcia i liczba drukarek

:::warning Klucz licencyjny jest powiązany z twoją instalacją
Klucz jest aktywowany dla jednej instalacji Bambu Dashboard. Skontaktuj się z [geektech.no](https://geektech.no), jeśli musisz przenieść licencję na nowy serwer.
:::

### Weryfikacja licencji

- Licencja jest **weryfikowana online** przy uruchomieniu i co 24 godziny
- W przypadku awarii sieci licencja działa do **7 dni offline**
- Wygasła licencja → moduł jest zablokowany, ale istniejące dane są zachowane
- Odnowienie odbywa się przez **[geektech.no](https://geektech.no)** → Moje licencje → Odnów

### Sprawdzanie statusu licencji

Przejdź do **Ustawienia → E-handel** lub wywołaj API:

```bash
curl -sk https://localhost:3443/api/ecom-license/status
```

Odpowiedź zawiera:
```json
{
  "active": true,
  "type": "professional",
  "expires": "2027-03-22",
  "printers": 5,
  "licensee": "Nazwa Firmy Sp. z o.o.",
  "provider": "geektech.no"
}
```

## Klienci

### Tworzenie klienta

1. Przejdź do **E-handel → Klienci**
2. Kliknij **Nowy klient**
3. Wypełnij:
   - **Imię / Nazwa firmy**
   - **Osoba kontaktowa** (dla firm)
   - **Adres e-mail**
   - **Telefon**
   - **Adres** (adres rozliczeniowy)
   - **NIP / PESEL** (opcjonalne, dla zarejestrowanych płatników VAT)
   - **Notatka** — wewnętrzna uwaga
4. Kliknij **Utwórz**

### Przegląd klientów

Lista klientów pokazuje:
- Imię i dane kontaktowe
- Łączną liczbę zamówień
- Łączne obroty
- Datę ostatniego zamówienia
- Status (Aktywny / Nieaktywny)

Kliknij klienta, aby zobaczyć całą historię zamówień i fakturowania.

## Zarządzanie zamówieniami

### Tworzenie zamówienia

1. Przejdź do **E-handel → Zamówienia**
2. Kliknij **Nowe zamówienie**
3. Wybierz **Klienta** z listy
4. Dodaj pozycje zamówienia:
   - Wybierz plik/model z biblioteki lub dodaj pozycję jako dowolny tekst
   - Podaj ilość i cenę jednostkową
   - System automatycznie oblicza koszt jeśli powiązany z projektem
5. Podaj **Datę dostawy** (szacowaną)
6. Kliknij **Utwórz zamówienie**

### Status zamówienia

| Status | Opis |
|---|---|
| Zapytanie | Otrzymane zapytanie, niepotwierdzone |
| Potwierdzone | Klient potwierdził |
| W produkcji | Trwa drukowanie |
| Gotowe do dostawy | Gotowe, czeka na odbiór/wysyłkę |
| Dostarczone | Zamówienie zrealizowane |
| Anulowane | Anulowane przez klienta lub ciebie |

Aktualizuj status klikając zamówienie → **Zmień status**.

### Łączenie wydruków z zamówieniem

1. Otwórz zamówienie
2. Kliknij **Połącz wydruk**
3. Wybierz wydruki z historii (obsługiwany wielokrotny wybór)
4. Dane kosztów są automatycznie pobierane z historii wydruków

## Fakturowanie

Zobacz [Projekty → Fakturowanie](../funksjoner/projects#fakturowanie) dla szczegółowej dokumentacji fakturowania.

Fakturę można wygenerować bezpośrednio z zamówienia:

1. Otwórz zamówienie
2. Kliknij **Generuj fakturę**
3. Sprawdź kwotę i VAT
4. Pobierz PDF lub wyślij na e-mail klienta

### Seria numerów faktur

Skonfiguruj serię numerów faktur w **Ustawienia → E-handel**:
- **Prefiks**: np. `2026-`
- **Numer startowy**: np. `1001`
- Numery faktur są przypisywane automatycznie w kolejności rosnącej

## Raportowanie i podatki

### Raportowanie opłat

System śledzi wszystkie opłaty transakcyjne:
- Zobacz opłaty w **E-handel → Opłaty**
- Oznaczaj opłaty jako zgłoszone dla celów księgowych
- Eksportuj podsumowanie opłat za okres

### Statystyki

W **E-handel → Statystyki**:
- Miesięczne obroty (wykres słupkowy)
- Najlepsi klienci według obrotów
- Najczęściej sprzedawane modele/materiały
- Średnia wielkość zamówienia

Eksportuj do CSV dla systemu księgowego.

## Wsparcie i kontakt

:::info Potrzebujesz pomocy?
- **Pytania o licencje**: skontaktuj się ze wsparciem [geektech.no](https://geektech.no)
- **Problemy techniczne**: [GitHub Issues](https://github.com/skynett81/bambu-dashboard/issues)
- **Prośby o funkcje**: [GitHub Discussions](https://github.com/skynett81/bambu-dashboard/discussions)
:::
