---
sidebar_position: 1
title: Konserwacja dyszy
description: Czyszczenie, cold pull, wymiana dyszy i typy dysz dla drukarek Bambu Lab
---

# Konserwacja dyszy

Dysza jest jednym z najważniejszych komponentów drukarki. Właściwa konserwacja wydłuża jej żywotność i zapewnia dobre wyniki drukowania.

## Typy dysz

| Typ dyszy | Materiały | Żywotność (szacowana) | Maks. temp |
|----------|-----------|-------------------|----------|
| Mosiądz (standardowa) | PLA, PETG, ABS, TPU | 200–500 godzin | 300 °C |
| Hartowana stal | Wszystkie w tym CF/GF | 300–600 godzin | 300 °C |
| HS01 (Bambu) | Wszystkie w tym CF/GF | 500–1000 godzin | 300 °C |

:::danger Nigdy nie używaj mosiężnej dyszy z CF/GF
Filamenty z włóknem węglowym i szklanym zużywają mosiężne dysze w ciągu godzin. Przed drukowaniem materiałów CF/GF przejdź na hartowaną stal.
:::

## Czyszczenie

### Proste czyszczenie (między szpulami)
1. Podgrzej dyszę do 200–220 °C
2. Ręcznie przepchnij filament, aż wytrysnie czysto
3. Szybko wyciągnij filament ("cold pull" — patrz poniżej)

### Czyszczenie IPA
Dla upartych resztek:
1. Podgrzej dyszę do 200 °C
2. Nakrop 1–2 krople IPA na koniec dyszy (ostrożnie!)
3. Pozwól parze rozpuścić resztki
4. Przepuść świeży filament

:::warning Ostrożnie z IPA na gorącej dyszy
IPA wrze przy 83 °C i intensywnie paruje na gorącej dyszy. Używaj małych ilości i unikaj wdychania.
:::

## Cold Pull (zimne wyciąganie)

Cold pull to najskuteczniejsza metoda usuwania zanieczyszczeń i resztek węgla z dyszy.

**Krok po kroku:**
1. Podgrzej dyszę do 200–220 °C
2. Ręcznie wciśnij filament nylonowy (lub to, co jest w dyszy)
3. Pozwól nylonowi nasączyć się w dyszy przez 1–2 minuty
4. Obniż temperaturę do 80–90 °C (dla nylonu)
5. Poczekaj, aż dysza ostygnie do docelowej wartości
6. Wyciągnij filament szybko i zdecydowanie w jednym ruchu
7. Obejrzyj koniec: powinien mieć kształt wnętrza dyszy — czysty i bez resztek
8. Powtórz 3–5 razy, aż filament będzie wyciągany czysto i biało

:::tip Nylon do cold pull
Nylon daje najlepsze wyniki przy cold pull, ponieważ dobrze chwyta zanieczyszczenia. Biały nylon ułatwia sprawdzenie, czy wyciąganie jest czyste.
:::

## Wymiana dyszy

### Oznaki, że dysza powinna być wymieniona
- Kłaczkowate powierzchnie i słaba dokładność wymiarowa
- Utrzymujące się problemy z ekstrudowaniem po czyszczeniu
- Widoczne zużycie lub deformacja otworu dyszy
- Dysza przekroczyła szacowaną żywotność

### Procedura (P1S/X1C)
1. Podgrzej dyszę do 200 °C
2. Zwolnij silnik ekstrudera (zwolnij filament)
3. Użyj klucza do obluzowania dyszy (w lewo)
4. Wymień dyszę gdy jest gorąca — **nie pozwól dyszy ostygnąć z narzędziem na niej**
5. Dokręć do pożądanego momentu (nie przekręcaj)
6. Uruchom kalibrację po wymianie

:::warning Zawsze wymieniaj gdy gorąca
Moment dokręcania zimnej dyszy może spowodować pęknięcie podczas nagrzewania. Zawsze wymieniaj i dokręcaj gdy dysza jest gorąca (200 °C).
:::

## Interwały konserwacji

| Czynność | Interwał |
|-----------|---------|
| Czyszczenie (cold pull) | Po 50 godzinach lub przy zmianie materiału |
| Inspekcja wzrokowa | Tygodniowo |
| Wymiana dyszy (mosiądz) | 200–500 godzin |
| Wymiana dyszy (hartowana stal) | 300–600 godzin |
