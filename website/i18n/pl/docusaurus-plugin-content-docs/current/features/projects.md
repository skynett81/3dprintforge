---
sidebar_position: 9
title: Projekty
description: Organizuj wydruki w projekty, śledź koszty, generuj faktury i udostępniaj projekty klientom
---

# Projekty

Projekty pozwalają grupować powiązane wydruki, śledzić koszty materiałów, fakturować klientów i udostępniać przegląd swojej pracy.

Przejdź do: **https://localhost:3443/#projects**

## Tworzenie projektu

1. Kliknij **Nowy projekt** (ikona +)
2. Wypełnij:
   - **Nazwa projektu** — opisowa nazwa (maks. 100 znaków)
   - **Klient** — opcjonalne konto klienta (zobacz [E-handel](../integrations/ecommerce))
   - **Opis** — krótki opis tekstowy
   - **Kolor** — wybierz kolor do wizualnej identyfikacji
   - **Tagi** — słowa kluczowe oddzielone przecinkami
3. Kliknij **Utwórz projekt**

## Łączenie wydruków z projektem

### Podczas wydruku

1. Otwórz dashboard podczas trwającego wydruku
2. Kliknij **Połącz z projektem** na bocznym panelu
3. Wybierz istniejący projekt lub utwórz nowy
4. Wydruk zostanie automatycznie powiązany z projektem po ukończeniu

### Z historii

1. Przejdź do **Historia**
2. Znajdź dany wydruk
3. Kliknij wydruk → **Połącz z projektem**
4. Wybierz projekt z listy rozwijanej

### Masowe łączenie

1. Wybierz wiele wydruków w historii za pomocą pól wyboru
2. Kliknij **Działania → Połącz z projektem**
3. Wybierz projekt — wszystkie wybrane wydruki zostaną połączone

## Przegląd kosztów

Każdy projekt oblicza całkowite koszty na podstawie:

| Typ kosztu | Źródło |
|---|---|
| Zużycie filamentu | Gramy × cena za gram według materiału |
| Energia | kWh × cena energii (z Tibber/Nordpool jeśli skonfigurowane) |
| Zużycie maszyny | Obliczone z [Przewidywania zużycia](../monitoring/wearprediction) |
| Koszt ręczny | Pozycje dodane ręcznie |

Przegląd kosztów wyświetlany jest jako tabela i wykres kołowy na wydruk i łącznie.

:::tip Ceny energii
Aktywuj integrację Tibber lub Nordpool, aby uzyskać dokładne koszty energii na wydruk. Zobacz [Cena energii](../integrations/energy).
:::

## Fakturowanie

1. Otwórz projekt i kliknij **Generuj fakturę**
2. Wypełnij:
   - **Data faktury** i **data płatności**
   - **Stawka VAT** (0%, 15%, 25%)
   - **Narzut** (%)
   - **Uwaga dla klienta**
3. Podejrzyj fakturę w formacie PDF
4. Kliknij **Pobierz PDF** lub **Wyślij do klienta** (przez e-mail)

Faktury są zapisywane pod projektem i można je ponownie otworzyć i edytować do czasu wysłania.

:::info Dane klienta
Dane klienta (nazwa, adres, NIP) są pobierane z konta klienta powiązanego z projektem. Zobacz [E-handel](../integrations/ecommerce), aby zarządzać klientami.
:::

## Status projektu

| Status | Opis |
|---|---|
| Aktywny | Projekt jest w trakcie realizacji |
| Ukończony | Wszystkie wydruki gotowe, faktura wysłana |
| Zarchiwizowany | Ukryty ze standardowego widoku, ale przeszukiwalny |
| Wstrzymany | Tymczasowo zatrzymany |

Zmień status, klikając wskaźnik statusu u góry projektu.

## Udostępnianie projektu

Wygeneruj udostępnialny link, aby pokazać przegląd projektu klientom:

1. Kliknij **Udostępnij projekt** w menu projektu
2. Wybierz, co ma być wyświetlane:
   - ✅ Wydruki i zdjęcia
   - ✅ Łączne zużycie filamentu
   - ❌ Koszty i ceny (ukryte domyślnie)
3. Ustaw czas wygaśnięcia linku
4. Skopiuj i udostępnij link

Klient widzi stronę tylko do odczytu bez logowania.
