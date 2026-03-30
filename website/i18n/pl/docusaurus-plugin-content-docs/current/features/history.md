---
sidebar_position: 3
title: Historia wydruków
description: Kompletny dziennik wszystkich wydruków ze statystykami, śledzeniem filamentów i eksportem
---

# Historia wydruków

Historia wydruków zapewnia kompletny dziennik wszystkich wydruków wykonanych za pomocą dashboardu, w tym statystyki, zużycie filamentów i linki do źródeł modeli.

## Tabela historii

Tabela wyświetla wszystkie wydruki z:

| Kolumna | Opis |
|---------|------|
| Data/godzina | Czas rozpoczęcia |
| Nazwa modelu | Nazwa pliku lub tytuł z MakerWorld |
| Drukarka | Która drukarka była używana |
| Czas trwania | Łączny czas wydruku |
| Filament | Materiał i użyte gramy |
| Warstwy | Liczba warstw i waga (g) |
| Status | Ukończony, przerwany, błąd |
| Zdjęcie | Miniatura (przy integracji z chmurą) |

## Wyszukiwanie i filtrowanie

Używaj pola wyszukiwania i filtrów, aby znaleźć wydruki:

- Wyszukiwanie pełnotekstowe po nazwie modelu
- Filtruj według drukarki, materiału, statusu, daty
- Sortuj według wszystkich kolumn

## Linki do źródeł modeli

Jeśli wydruk został uruchomiony z MakerWorld, wyświetlany jest link bezpośrednio do strony modelu. Kliknij nazwę modelu, aby otworzyć MakerWorld w nowej karcie.

:::info Bambu Cloud
Linki do modeli i miniatury wymagają integracji z Bambu Cloud. Zobacz [Bambu Cloud](../getting-started/bambu-cloud).
:::

## Śledzenie filamentów

Dla każdego wydruku rejestrowane są:

- **Materiał** — PLA, PETG, ABS itp.
- **Użyte gramy** — szacowane zużycie
- **Szpula** — która szpula była używana (jeśli zarejestrowana w magazynie)
- **Kolor** — kod hex koloru

Zapewnia to dokładny obraz zużycia filamentu w czasie i pomaga planować zakupy.

## Statystyki

W **Historia → Statystyki** znajdziesz zagregowane dane:

- **Łączna liczba wydruków** — i wskaźnik sukcesu
- **Łączny czas drukowania** — godziny i dni
- **Zużycie filamentu** — gramy i km według materiału
- **Wydruki na dzień** — wykres liniowy
- **Najczęściej używane materiały** — wykres kołowy
- **Rozkład długości wydruku** — histogram

Statystyki można filtrować według okresu (7d, 30d, 90d, 1 rok, wszystko).

## Eksport

### Eksport CSV
Eksportuj całą historię lub przefiltrowane wyniki:
**Historia → Eksport → Pobierz CSV**

Pliki CSV zawierają wszystkie kolumny i można je otwierać w Excelu, LibreOffice Calc lub importować do innych narzędzi.

### Automatyczna kopia zapasowa
Historia jest częścią bazy danych SQLite, która jest automatycznie tworzona w kopii zapasowej przy aktualizacjach. Ręczna kopia zapasowa w **Ustawienia → Kopia zapasowa**.

## Edycja

Możesz edytować wpisy dziennika wydruków po fakcie:

- Koryguj nazwy modeli
- Dodawaj notatki
- Koryguj zużycie filamentu
- Usuwaj błędnie zarejestrowane wydruki

Kliknij prawym przyciskiem myszy wiersz i wybierz **Edytuj** lub kliknij ikonę ołówka.
