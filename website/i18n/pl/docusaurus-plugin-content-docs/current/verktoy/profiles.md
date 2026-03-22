---
sidebar_position: 3
title: Profile drukowania
description: Twórz, edytuj i zarządzaj profilami drukowania z predefiniowanymi ustawieniami dla szybkiego i spójnego drukowania
---

# Profile drukowania

Profile drukowania to zapisane zestawy ustawień drukowania, które można ponownie używać na różnych wydrukach i drukarkach. Oszczędzaj czas i zapewnij spójną jakość, definiując profile dla różnych celów.

Przejdź do: **https://localhost:3443/#profiles**

## Tworzenie profilu

1. Przejdź do **Narzędzia → Profile drukowania**
2. Kliknij **Nowy profil** (ikona +)
3. Wypełnij:
   - **Nazwa profilu** — opisowa nazwa, np. „PLA - Szybka produkcja"
   - **Materiał** — wybierz z listy (PLA / PETG / ABS / PA / PC / TPU itp.)
   - **Model drukarki** — X1C / X1C Combo / X1E / P1S / P1S Combo / P1P / P2S / P2S Combo / A1 / A1 Combo / A1 mini / H2S / H2D / H2C / Wszystkie
   - **Opis** — opcjonalny tekst

4. Wypełnij ustawienia (patrz sekcje poniżej)
5. Kliknij **Zapisz profil**

## Ustawienia w profilu

### Temperatura
| Pole | Przykład |
|---|---|
| Temperatura dyszy | 220°C |
| Temperatura stołu | 60°C |
| Temperatura komory (X1C) | 35°C |

### Prędkość
| Pole | Przykład |
|---|---|
| Ustawienie prędkości | Standardowy |
| Maks. prędkość (mm/s) | 200 |
| Przyspieszenie | 5000 mm/s² |

### Jakość
| Pole | Przykład |
|---|---|
| Grubość warstwy | 0,2 mm |
| Procent wypełnienia | 15% |
| Wzór wypełnienia | Siatka |
| Materiał podporowy | Auto |

### AMS i kolory
| Pole | Opis |
|---|---|
| Objętość purge | Ilość czyszczenia przy zmianie kolorów |
| Preferowane sloty | Które sloty AMS są preferowane |

### Zaawansowane
| Pole | Opis |
|---|---|
| Tryb suszenia | Aktywuj suszenie AMS dla wilgotnych materiałów |
| Czas chłodzenia | Przerwa między warstwami na chłodzenie |
| Prędkość wentylatora | Prędkość wentylatora chłodzącego w procentach |

## Edycja profilu

1. Kliknij profil na liście
2. Kliknij **Edytuj** (ikona ołówka)
3. Wprowadź zmiany
4. Kliknij **Zapisz** (nadpisz) lub **Zapisz jako nowy** (tworzy kopię)

:::tip Wersjonowanie
Użyj „Zapisz jako nowy", aby zachować działający profil podczas eksperymentowania ze zmianami.
:::

## Używanie profilu

### Z biblioteki plików

1. Wybierz plik w bibliotece
2. Kliknij **Wyślij do drukarki**
3. Wybierz **Profil** z listy rozwijanej
4. Używane są ustawienia z profilu

### Z kolejki wydruków

1. Utwórz nowe zadanie w kolejce
2. Wybierz **Profil** w ustawieniach
3. Profil jest połączony z zadaniem kolejki

## Import i eksport profili

### Eksport
1. Wybierz jeden lub więcej profili
2. Kliknij **Eksportuj**
3. Wybierz format: **JSON** (do importu w innych dashboardach) lub **PDF** (do druku/dokumentacji)

### Import
1. Kliknij **Importuj profile**
2. Wybierz plik `.json` wyeksportowany z innego Bambu Dashboard
3. Istniejące profile o tej samej nazwie można nadpisać lub zachować oba

## Udostępnianie profili

Udostępniaj profile innym przez moduł filamentów społeczności (zob. [Filamenty społeczności](../integrasjoner/community)) lub przez bezpośredni eksport JSON.

## Profil domyślny

Ustaw domyślny profil na materiał:

1. Wybierz profil
2. Kliknij **Ustaw jako domyślny dla [materiału]**
3. Profil domyślny jest automatycznie wybierany podczas wysyłania pliku z tym materiałem
