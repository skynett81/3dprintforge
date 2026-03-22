---
sidebar_position: 2
title: Biblioteka plików
description: Przesyłaj i zarządzaj modelami 3D i plikami G-kodu, analizuj G-kod i łącz z MakerWorld i Printables
---

# Biblioteka plików

Biblioteka plików to centralne miejsce do przechowywania i zarządzania wszystkimi modelami 3D i plikami G-kodu — z automatyczną analizą G-kodu i integracją z MakerWorld i Printables.

Przejdź do: **https://localhost:3443/#library**

## Przesyłanie modeli

### Pojedyncze przesyłanie

1. Przejdź do **Biblioteka plików**
2. Kliknij **Prześlij** lub przeciągnij pliki do obszaru przesyłania
3. Obsługiwane formaty: `.3mf`, `.gcode`, `.bgcode`, `.stl`, `.obj`
4. Plik jest analizowany automatycznie po przesłaniu

:::info Folder przechowywania
Pliki są przechowywane w folderze skonfigurowanym w **Ustawienia → Biblioteka plików → Folder przechowywania**. Domyślnie: `./data/library/`
:::

### Przesyłanie zbiorcze

Przeciągnij i upuść cały folder, aby przesłać wszystkie obsługiwane pliki naraz. Pliki są przetwarzane w tle i zostaniesz powiadomiony, gdy wszystko będzie gotowe.

## Analiza G-kodu

Po przesłaniu pliki `.gcode` i `.bgcode` są automatycznie analizowane:

| Metryka | Opis |
|---|---|
| Szacowany czas drukowania | Czas obliczony z poleceń G-kodu |
| Zużycie filamentu | Gramy i metry na materiał/kolor |
| Licznik warstw | Łączna liczba warstw |
| Grubość warstwy | Zarejestrowana grubość warstwy |
| Materiały | Wykryte materiały (PLA, PETG itp.) |
| Procent wypełnienia | Jeśli dostępne w metadanych |
| Materiał podporowy | Szacowana waga podpor |
| Model drukarki | Docelowa drukarka z metadanych |

Dane z analizy są wyświetlane na karcie pliku i używane przez [Kalkulator kosztów](../analyse/costestimator).

## Karty plików i metadane

Każda karta pliku pokazuje:
- **Nazwę pliku** i format
- **Datę przesłania**
- **Miniaturę** (z `.3mf` lub wygenerowaną)
- **Przeanalizowany czas drukowania** i zużycie filamentu
- **Tagi** i kategorię
- **Powiązane wydruki** — ile razy drukowano

Kliknij kartę, aby otworzyć widok szczegółowy z pełnymi metadanymi i historią.

## Organizacja

### Tagi

Dodaj tagi do łatwego wyszukiwania:
1. Kliknij plik → **Edytuj metadane**
2. Wpisz tagi (oddzielone przecinkami): `benchy, test, PLA, kalibracja`
3. Szukaj w bibliotece z filtrem tagów

### Kategorie

Organizuj pliki w kategoriach:
- Kliknij **Nowa kategoria** na pasku bocznym
- Przeciągnij pliki do kategorii
- Kategorie mogą być zagnieżdżone (obsługiwane są podkategorie)

## Połączenie z MakerWorld

1. Przejdź do **Ustawienia → Integracje → MakerWorld**
2. Zaloguj się kontem Bambu Lab
3. W bibliotece: kliknij plik → **Połącz z MakerWorld**
4. Wyszukaj model na MakerWorld i wybierz właściwy wynik
5. Metadane (projektant, licencjonowanie, ocena) są importowane z MakerWorld

Połączenie pokazuje nazwę projektanta i oryginalny URL na karcie pliku.

## Połączenie z Printables

1. Przejdź do **Ustawienia → Integracje → Printables**
2. Wklej swój klucz API Printables
3. Łącz pliki z modelami Printables tak samo jak MakerWorld

## Wysyłanie do drukarki

Z biblioteki plików możesz wysyłać bezpośrednio do drukarki:

1. Kliknij plik → **Wyślij do drukarki**
2. Wybierz docelową drukarkę
3. Wybierz slot AMS (dla wydruków wielokolorowych)
4. Kliknij **Rozpocznij drukowanie** lub **Dodaj do kolejki**

:::warning Bezpośrednie wysyłanie
Bezpośrednie wysyłanie uruchamia drukowanie natychmiast bez potwierdzenia w Bambu Studio. Upewnij się, że drukarka jest gotowa.
:::
