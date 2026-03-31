---
sidebar_position: 1
title: Twój pierwszy wydruk
description: Przewodnik krok po kroku, jak rozpocząć pierwszy wydruk 3D i monitorować go w 3DPrintForge
---

# Twój pierwszy wydruk

Ten przewodnik przeprowadzi Cię przez cały proces — od podłączonej drukarki do gotowego wydruku — z 3DPrintForge jako centrum sterowania.

## Krok 1 — Sprawdź połączenie z drukarką

Po otwarciu panelu na górze paska bocznego lub na panelu przeglądowym widoczna jest karta statusu drukarki.

**Zielony status** oznacza, że drukarka jest online i gotowa.

| Status | Kolor | Znaczenie |
|--------|-------|-----------|
| Online | Zielony | Gotowa do druku |
| Bezczynna | Szary | Połączona, ale nieaktywna |
| Drukuje | Niebieski | Trwa druk |
| Błąd | Czerwony | Wymaga uwagi |

Jeśli drukarka wyświetla czerwony status:
1. Sprawdź, czy drukarka jest włączona
2. Zweryfikuj, czy jest połączona z tą samą siecią co panel
3. Przejdź do **Ustawienia → Drukarki** i potwierdź adres IP oraz kod dostępu

:::tip Użyj trybu LAN dla szybszej reakcji
Tryb LAN zapewnia mniejsze opóźnienia niż tryb chmurowy. Włącz go w ustawieniach drukarki, jeśli drukarka i panel są w tej samej sieci.
:::

## Krok 2 — Prześlij swój model

3DPrintForge nie uruchamia wydruków bezpośrednio — to zadanie Bambu Studio lub MakerWorld. Panel przejmuje kontrolę, gdy tylko wydruk się rozpocznie.

**Przez Bambu Studio:**
1. Otwórz Bambu Studio na swoim komputerze
2. Zaimportuj lub otwórz plik `.stl` lub `.3mf`
3. Pokrój model (wybierz filament, podpory, wypełnienie itp.)
4. Kliknij **Drukuj** w prawym górnym rogu

**Przez MakerWorld:**
1. Znajdź model na [makerworld.com](https://makerworld.com)
2. Kliknij **Drukuj** bezpośrednio na stronie
3. Bambu Studio otworzy się automatycznie z gotowym modelem

## Krok 3 — Uruchom wydruk

W Bambu Studio wybierz metodę wysyłania:

| Metoda | Wymagania | Zalety |
|--------|-----------|--------|
| **Chmura** | Konto Bambu + internet | Działa wszędzie |
| **LAN** | Ta sama sieć | Szybsze, bez chmury |
| **Karta SD** | Dostęp fizyczny | Brak wymagań sieciowych |

Kliknij **Wyślij** — drukarka odbiera zadanie i automatycznie rozpoczyna fazę nagrzewania.

:::info Wydruk pojawi się w panelu
W ciągu kilku sekund od wysłania zadania przez Bambu Studio aktywny wydruk pojawi się w panelu w sekcji **Aktywny wydruk**.
:::

## Krok 4 — Monitorowanie w panelu

Gdy wydruk jest w toku, panel daje Ci pełny przegląd:

### Postęp
- Procent ukończenia i szacowany pozostały czas wyświetlane są na karcie drukarki
- Kliknij na kartę, aby zobaczyć szczegółowy widok z informacjami o warstwach

### Temperatury
Panel szczegółów pokazuje temperatury w czasie rzeczywistym:
- **Dysza** — aktualna i docelowa temperatura
- **Płyta robocza** — aktualna i docelowa temperatura
- **Komora** — temperatura powietrza wewnątrz drukarki (ważna dla ABS/ASA)

### Kamera
Kliknij ikonę kamery na karcie drukarki, aby zobaczyć podgląd na żywo bezpośrednio w panelu. Możesz mieć otwartą kamerę w osobnym oknie podczas wykonywania innych czynności.

:::warning Sprawdzaj pierwsze warstwy
Pierwsze 3–5 warstw to moment krytyczny. Słaba przyczepność teraz oznacza nieudany wydruk później. Obserwuj kamerę i weryfikuj, czy filament układa się równo i gładko.
:::

### Print Guard
3DPrintForge posiada oparty na AI **Print Guard**, który automatycznie wykrywa błędy spaghetti i może wstrzymać wydruk. Włącz go w **Monitorowanie → Print Guard**.

## Krok 5 — Po zakończeniu wydruku

Gdy wydruk jest gotowy, panel wyświetla komunikat o ukończeniu (i wysyła powiadomienie, jeśli skonfigurowano [powiadomienia](./notification-setup)).

### Sprawdź historię
Przejdź do **Historia** na pasku bocznym, aby zobaczyć ukończony wydruk:
- Całkowity czas druku
- Zużycie filamentu (użyte gramy, szacowany koszt)
- Błędy lub zdarzenia HMS podczas druku
- Zdjęcie z kamery po zakończeniu (jeśli włączone)

### Dodaj notatkę
Kliknij wydruk w historii i dodaj notatkę — np. „Potrzebna trochę większa krawędź" lub „Idealny wynik". Przydatne, gdy późnej drukujesz ten sam model.

### Sprawdź zużycie filamentu
W sekcji **Filament** możesz zobaczyć, że waga szpuli została zaktualizowana na podstawie zużytego materiału. Panel odejmuje to automatycznie.

## Wskazówki dla początkujących

:::tip Nie opuszczaj pierwszego wydruku
Obserwuj przez pierwsze 10–15 minut. Gdy upewnisz się, że wydruk dobrze przylega, możesz pozwolić panelowi monitorować resztę.
:::

- **Ważenie pustych szpul** — wprowadź wagę startową szpul dla dokładnych obliczeń pozostałości (patrz [Zarządzanie filamentem](./filament-setup))
- **Skonfiguruj powiadomienia Telegram** — otrzymuj wiadomość po zakończeniu wydruku bez konieczności czekania (patrz [Powiadomienia](./notification-setup))
- **Sprawdzaj płytę roboczą** — czysta płyta = lepsza przyczepność. Wytrzyj IPA (izopropanolem) między wydrukami
- **Używaj odpowiedniej płyty** — patrz [Wybór odpowiedniej płyty roboczej](./choosing-plate), co pasuje do Twojego filamentu
