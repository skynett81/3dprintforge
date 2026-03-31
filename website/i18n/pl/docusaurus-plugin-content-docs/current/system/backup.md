---
sidebar_position: 2
title: Kopia zapasowa
description: Twórz, przywracaj i planuj automatyczne kopie zapasowe danych 3DPrintForge
---

# Kopia zapasowa

3DPrintForge może tworzyć kopie zapasowe całej konfiguracji, historii i danych, abyś mógł łatwo przywrócić je w przypadku awarii systemu, przeniesienia serwera lub problemów z aktualizacją.

Przejdź do: **https://localhost:3443/#settings** → **System → Kopia zapasowa**

## Co jest zawarte w kopii zapasowej

| Typ danych | Zawarte | Uwaga |
|---|---|---|
| Konfiguracje drukarek | ✅ | |
| Historia wydruków | ✅ | |
| Magazyn filamentów | ✅ | |
| Użytkownicy i role | ✅ | Hasła są przechowywane jako hash |
| Ustawienia | ✅ | W tym konfiguracje powiadomień |
| Dziennik konserwacji | ✅ | |
| Projekty i faktury | ✅ | |
| Biblioteka plików (metadane) | ✅ | |
| Biblioteka plików (pliki) | Opcjonalnie | Może być duże |
| Filmy timelapse | Opcjonalnie | Może być bardzo duże |
| Zdjęcia galerii | Opcjonalnie | |

## Tworzenie ręcznej kopii zapasowej

1. Przejdź do **Ustawienia → Kopia zapasowa**
2. Wybierz, co uwzględnić (patrz tabela powyżej)
3. Kliknij **Utwórz kopię zapasową teraz**
4. Wskaźnik postępu jest wyświetlany podczas tworzenia kopii zapasowej
5. Kliknij **Pobierz**, gdy kopia zapasowa jest gotowa

Kopia zapasowa jest zapisywana jako plik `.zip` z znacznikiem czasu w nazwie:
```
3dprintforge-backup-2026-03-22T14-30-00.zip
```

## Pobieranie kopii zapasowej

Pliki kopii zapasowych są przechowywane w folderze backupów na serwerze (konfigurowalne). Możesz je też pobrać bezpośrednio:

1. Przejdź do **Kopia zapasowa → Istniejące kopie zapasowe**
2. Znajdź kopię zapasową na liście (posortowanej według daty)
3. Kliknij **Pobierz** (ikona pobierania)

:::info Folder przechowywania
Domyślny folder przechowywania: `./data/backups/`. Zmień w **Ustawienia → Kopia zapasowa → Folder przechowywania**.
:::

## Planowe automatyczne kopie zapasowe

1. Aktywuj **Automatyczna kopia zapasowa** w **Kopia zapasowa → Planowanie**
2. Wybierz interwał:
   - **Dziennie** — uruchamiany o 03:00 (konfigurowalne)
   - **Tygodniowo** — określony dzień i godzina
   - **Miesięcznie** — pierwszego dnia miesiąca
3. Wybierz **Liczba kopii zapasowych do zachowania** (np. 7 — starsze są automatycznie usuwane)
4. Kliknij **Zapisz**

:::tip Zewnętrzne przechowywanie
Dla ważnych danych: zamontuj zewnętrzny dysk lub dysk sieciowy jako folder przechowywania kopii zapasowych. Wtedy kopie zapasowe przeżyją nawet awarię dysku systemowego.
:::

## Przywracanie z kopii zapasowej

:::warning Przywracanie nadpisuje istniejące dane
Przywracanie zastępuje wszystkie istniejące dane zawartością pliku kopii zapasowej. Upewnij się, że masz najpierw świeżą kopię zapasową bieżących danych.
:::

### Z istniejącej kopii zapasowej na serwerze

1. Przejdź do **Kopia zapasowa → Istniejące kopie zapasowe**
2. Znajdź kopię zapasową na liście
3. Kliknij **Przywróć**
4. Potwierdź w oknie dialogowym
5. System automatycznie restartuje po przywróceniu

### Z pobranego pliku kopii zapasowej

1. Kliknij **Prześlij kopię zapasową**
2. Wybierz plik `.zip` z komputera
3. Plik jest walidowany — widzisz, co jest zawarte
4. Kliknij **Przywróć z pliku**
5. Potwierdź w oknie dialogowym

## Walidacja kopii zapasowej

3DPrintForge waliduje wszystkie pliki kopii zapasowych przed przywróceniem:

- Sprawdza, czy format ZIP jest prawidłowy
- Weryfikuje, czy schemat bazy danych jest kompatybilny z bieżącą wersją
- Wyświetla ostrzeżenie, jeśli kopia zapasowa pochodzi ze starszej wersji (migracja zostanie wykonana automatycznie)
