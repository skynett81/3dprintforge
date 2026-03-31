---
sidebar_position: 7
title: Timelapse
description: Aktywuj automatyczne nagrywanie timelapse wydruków 3D, zarządzaj filmami i odtwarzaj je bezpośrednio w dashboardzie
---

# Timelapse

3DPrintForge może automatycznie robić zdjęcia podczas drukowania i łączyć je w film timelapse. Filmy są przechowywane lokalnie i można je odtwarzać bezpośrednio w dashboardzie.

Przejdź do: **https://localhost:3443/#timelapse**

## Aktywacja

1. Przejdź do **Ustawienia → Timelapse**
2. Włącz **Aktywuj nagrywanie timelapse**
3. Wybierz **Tryb nagrywania**:
   - **Na warstwę** — jedno zdjęcie na warstwę (zalecane dla wysokiej jakości)
   - **Czasowy** — jedno zdjęcie co N sekund (np. co 30 sekund)
4. Wybierz, które drukarki mają mieć aktywowany timelapse
5. Kliknij **Zapisz**

:::tip Interwał zdjęć
„Na warstwę" daje płynniejszą animację, ponieważ ruch jest spójny. „Czasowy" zużywa mniej miejsca na dysku.
:::

## Ustawienia nagrywania

| Ustawienie | Wartość domyślna | Opis |
|---|---|---|
| Rozdzielczość | 1280×720 | Rozmiar zdjęcia (640×480 / 1280×720 / 1920×1080) |
| Jakość zdjęcia | 85% | Jakość kompresji JPEG |
| FPS w filmie | 30 | Klatki na sekundę w gotowym filmie |
| Format wideo | MP4 (H.264) | Format wyjściowy |
| Obróć zdjęcie | Wył. | Obróć 90°/180°/270° w zależności od orientacji montażu |

:::warning Miejsce na dysku
Timelapse ze 500 zdjęciami w 1080p zajmuje ok. 200–400 MB przed złożeniem. Gotowy film MP4 zajmuje zazwyczaj 20–80 MB.
:::

## Przechowywanie

Zdjęcia i filmy timelapse są przechowywane w `data/timelapse/` w folderze projektu. Struktura jest zorganizowana według drukarki i wydruku:

```
data/timelapse/
├── <printer-id>/                     ← Unikalny ID drukarki
│   ├── 2026-03-22_nazwa_modelu/      ← Sesja wydruku (data_nazwa_modelu)
│   │   ├── frame_0001.jpg
│   │   ├── frame_0002.jpg
│   │   ├── frame_0003.jpg
│   │   └── ...                       ← Surowe zdjęcia (usuwane po złożeniu)
│   ├── 2026-03-22_nazwa_modelu.mp4   ← Gotowy film timelapse
│   ├── 2026-03-20_3dbenchy.mp4
│   └── 2026-03-15_uchwyt.mp4
├── <printer-id-2>/                   ← Kolejne drukarki (przy wielu drukarkach)
│   └── ...
```

:::tip Zewnętrzna pamięć masowa
Aby zaoszczędzić miejsce na dysku systemowym, możesz użyć dowiązania symbolicznego do folderu timelapse na zewnętrznym dysku:
```bash
# Przykład: przenieś na zewnętrzny dysk zamontowany w /mnt/storage
mv data/timelapse /mnt/storage/timelapse

# Utwórz dowiązanie symboliczne
ln -s /mnt/storage/timelapse data/timelapse
```
Dashboard automatycznie podąża za dowiązaniem symbolicznym. Możesz używać dowolnego dysku lub udziału sieciowego.
:::

## Automatyczne składanie

Po zakończeniu wydruku, zdjęcia są automatycznie składane w film za pomocą ffmpeg:

1. 3DPrintForge otrzymuje zdarzenie „print complete" z MQTT
2. ffmpeg jest wywoływany ze zebranymi zdjęciami
3. Film jest zapisywany w folderze przechowywania
4. Strona timelapse jest aktualizowana o nowy film

Postęp możesz śledzić w zakładce **Timelapse → Przetwarzanie**.

## Odtwarzanie

1. Przejdź do **https://localhost:3443/#timelapse**
2. Wybierz drukarkę z listy rozwijanej
3. Kliknij film na liście, aby go odtworzyć
4. Użyj elementów sterowania odtwarzaniem:
   - ▶ / ⏸ — Odtwórz / Pauza
   - ⏪ / ⏩ — Przewiń do tyłu / do przodu
   - Przyciski prędkości: 0.5× / 1× / 2× / 4×
5. Kliknij **Pełny ekran**, aby otworzyć w pełnym ekranie
6. Kliknij **Pobierz**, aby pobrać plik MP4

## Usuwanie timelapse

1. Wybierz film na liście
2. Kliknij **Usuń** (ikona kosza)
3. Potwierdź w oknie dialogowym

:::danger Trwałe usunięcie
Usuniętych filmów timelapse i surowych zdjęć nie można przywrócić. Najpierw pobierz film, jeśli chcesz go zachować.
:::

## Udostępnianie timelapse

Filmy timelapse można udostępniać za pomocą linku z ograniczonym czasem ważności:

1. Wybierz film i kliknij **Udostępnij**
2. Ustaw czas wygaśnięcia (1 godzina / 24 godziny / 7 dni / bez wygaśnięcia)
3. Skopiuj wygenerowany link i udostępnij go
4. Odbiorca nie musi się logować, aby obejrzeć film
