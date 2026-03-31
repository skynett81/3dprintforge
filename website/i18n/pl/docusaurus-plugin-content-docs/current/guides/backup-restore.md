---
sidebar_position: 9
title: Kopia zapasowa i przywracanie
description: Automatyczna i ręczna kopia zapasowa 3DPrintForge, przywracanie i przeniesienie na nowy serwer
---

# Kopia zapasowa i przywracanie

3DPrintForge przechowuje wszystkie dane lokalnie — historię wydruków, magazyn filamentów, ustawienia, użytkowników i więcej. Regularne tworzenie kopii zapasowych zapewnia, że nie stracisz niczego przy awarii serwera lub przy przenoszeniu.

## Co jest zawarte w kopii zapasowej?

| Dane | Zawarte | Uwaga |
|------|---------|-------|
| Historia wydruków | Tak | Wszystkie logi i statystyki |
| Magazyn filamentów | Tak | Szpule, wagi, marki |
| Ustawienia | Tak | Wszystkie ustawienia systemowe |
| Konfiguracja drukarek | Tak | Adresy IP, kody dostępu |
| Użytkownicy i role | Tak | Hasła przechowywane jako hash |
| Konfiguracja powiadomień | Tak | Tokeny Telegram itp. |
| Zdjęcia z kamery | Opcjonalne | Mogą tworzyć duże pliki |
| Filmy time-lapse | Opcjonalne | Domyślnie wykluczone |

## Automatyczna nocna kopia zapasowa

Domyślnie automatyczna kopia zapasowa jest wykonywana każdej nocy o 03:00.

**Przeglądanie i konfigurowanie automatycznej kopii zapasowej:**
1. Przejdź do **System → Kopia zapasowa**
2. W sekcji **Automatyczna kopia zapasowa** widzisz:
   - Ostatnią udaną kopię zapasową i czas
   - Następną zaplanowaną kopię zapasową
   - Liczbę przechowywanych kopii zapasowych (domyślnie: 7 dni)

**Konfigurowanie:**
- **Godzina** — zmień z domyślnej 03:00 na godzinę, która Ci odpowiada
- **Czas przechowywania** — liczba dni przechowywania kopii zapasowych (7, 14, 30 dni)
- **Miejsce przechowywania** — folder lokalny (domyślnie) lub ścieżka zewnętrzna
- **Kompresja** — domyślnie włączona (zmniejsza rozmiar o 60–80%)

:::info Pliki kopii zapasowych są domyślnie przechowywane tutaj
```
/ścieżka/do/3dprintforge/data/backups/
backup-2025-03-22-030000.tar.gz
backup-2025-03-21-030000.tar.gz
...
```
:::

## Ręczna kopia zapasowa

Utwórz kopię zapasową w dowolnym momencie:

1. Przejdź do **System → Kopia zapasowa**
2. Kliknij **Utwórz kopię zapasową teraz**
3. Poczekaj, aż status wyświetli **Ukończono**
4. Pobierz plik kopii zapasowej klikając **Pobierz**

**Alternatywnie przez terminal:**
```bash
cd /ścieżka/do/3dprintforge
node scripts/backup.js
```

Plik kopii zapasowej jest przechowywany w `data/backups/` z znacznikiem czasu w nazwie pliku.

## Przywracanie z kopii zapasowej

:::warning Przywracanie nadpisuje istniejące dane
Wszystkie istniejące dane są zastępowane zawartością pliku kopii zapasowej. Upewnij się, że przywracasz właściwy plik.
:::

### Przez panel

1. Przejdź do **System → Kopia zapasowa**
2. Kliknij **Przywróć**
3. Wybierz plik kopii zapasowej z listy lub prześlij plik z dysku
4. Kliknij **Przywróć teraz**
5. Panel uruchomi się ponownie automatycznie po przywróceniu

### Przez terminal

```bash
cd /ścieżka/do/3dprintforge
node scripts/restore.js data/backups/backup-2025-03-22-030000.tar.gz
```

Po przywróceniu uruchom panel ponownie:
```bash
sudo systemctl restart 3dprintforge
# lub
npm start
```

## Eksportowanie i importowanie ustawień

Chcesz tylko zachować ustawienia (bez całej historii)?

**Eksportowanie:**
1. Przejdź do **System → Ustawienia → Eksport**
2. Wybierz, co ma być zawarte:
   - Konfiguracja drukarek
   - Konfiguracja powiadomień
   - Konta użytkowników
   - Marki i profile filamentów
3. Kliknij **Eksportuj** — pobierasz plik `.json`

**Importowanie:**
1. Przejdź do **System → Ustawienia → Import**
2. Prześlij plik `.json`
3. Wybierz, które części mają być importowane
4. Kliknij **Importuj**

:::tip Przydatne przy nowej instalacji
Wyeksportowane ustawienia są praktyczne do zabrania na nowy serwer. Zaimportuj je po nowej instalacji, aby nie musieć konfigurować wszystkiego od nowa.
:::

## Przenoszenie na nowy serwer

Jak przenieść 3DPrintForge ze wszystkimi danymi na nową maszynę:

### Krok 1 — Utwórz kopię zapasową na starym serwerze

1. Przejdź do **System → Kopia zapasowa → Utwórz kopię zapasową teraz**
2. Pobierz plik kopii zapasowej
3. Skopiuj plik na nowy serwer (USB, scp, udostępnienie sieciowe)

### Krok 2 — Zainstaluj na nowym serwerze

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
./install.sh
```

Postępuj zgodnie z przewodnikiem instalacji. Nie musisz niczego konfigurować — po prostu uruchom panel.

### Krok 3 — Przywróć kopię zapasową

Gdy panel działa na nowym serwerze:

1. Przejdź do **System → Kopia zapasowa → Przywróć**
2. Prześlij plik kopii zapasowej ze starego serwera
3. Kliknij **Przywróć teraz**

Wszystko jest teraz na miejscu: historia, magazyn filamentów, ustawienia i użytkownicy.

### Krok 4 — Zweryfikuj połączenie

1. Przejdź do **Ustawienia → Drukarki**
2. Przetestuj połączenie z każdą drukarką
3. Sprawdź, czy adresy IP są nadal właściwe (nowy serwer może mieć inny adres IP)

## Wskazówki dotyczące dobrej higieny kopii zapasowych

- **Testuj przywracanie** — utwórz kopię zapasową i przywróć na maszynie testowej co najmniej raz. Niesprawdzone kopie zapasowe nie są kopiami zapasowymi.
- **Przechowuj zewnętrznie** — regularnie kopiuj plik kopii zapasowej na dysk zewnętrzny lub chmurę (Nextcloud, Google Drive itp.)
- **Skonfiguruj powiadomienie** — włącz powiadomienie o „Nieudanej kopii zapasowej" w **Ustawienia → Powiadomienia → Zdarzenia**, żebyś od razu wiedział, gdy coś pójdzie nie tak
