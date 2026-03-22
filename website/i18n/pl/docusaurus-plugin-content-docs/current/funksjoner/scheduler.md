---
sidebar_position: 4
title: Harmonogram
description: Planuj wydruki, zarządzaj kolejką i konfiguruj automatyczne wysyłanie
---

# Harmonogram

Harmonogram pozwala organizować i automatyzować zadania drukowania z widokiem kalendarza i inteligentną kolejką.

## Widok kalendarza

Widok kalendarza zapewnia przegląd wszystkich zaplanowanych i ukończonych wydruków:

- **Widok miesięczny, tygodniowy i dzienny** — wybierz poziom szczegółowości
- **Kodowanie kolorami** — różne kolory według drukarki i statusu
- **Kliknij zdarzenie** — sprawdź szczegóły wydruku

Ukończone wydruki są wyświetlane automatycznie na podstawie historii wydruków.

## Kolejka wydruków

Kolejka wydruków pozwala ustawiać zadania, które są wysyłane do drukarki w kolejności:

### Dodawanie zadania do kolejki

1. Kliknij **+ Dodaj zadanie**
2. Wybierz plik (z karty SD drukarki, lokalnego przesyłania lub FTP)
3. Ustaw priorytet (wysoki, normalny, niski)
4. Wybierz docelową drukarkę (lub „automatyczna")
5. Kliknij **Dodaj**

### Zarządzanie kolejką

| Działanie | Opis |
|----------|------|
| Przeciągnij i upuść | Zmień kolejność |
| Wstrzymaj kolejkę | Tymczasowo zatrzymaj wysyłanie |
| Pomiń | Wyślij następne zadanie bez czekania |
| Usuń | Usuń zadanie z kolejki |

:::tip Wysyłanie do wielu drukarek
Przy wielu drukarkach kolejka może automatycznie rozdzielać zadania do dostępnych drukarek. Aktywuj **Automatyczne wysyłanie** w **Harmonogram → Ustawienia**.
:::

## Zaplanowane wydruki

Skonfiguruj wydruki, które mają się rozpocząć o określonej godzinie:

1. Kliknij **+ Zaplanuj wydruk**
2. Wybierz plik i drukarkę
3. Ustaw czas startu
4. Skonfiguruj powiadamianie (opcjonalnie)
5. Zapisz

:::warning Drukarka musi być bezczynna
Zaplanowane wydruki startują tylko jeśli drukarka jest w trybie czuwania o wskazanej godzinie. Jeśli drukarka jest zajęta, start zostanie przesunięty do następnego dostępnego czasu (konfigurowalne).
:::

## Równoważenie obciążenia

Przy automatycznym równoważeniu obciążenia, zadania są inteligentnie rozdzielane między drukarkami:

- **Round-robin** — równomierne rozdzielanie między wszystkimi drukarkami
- **Najmniej zajęta** — wysyłaj do drukarki z najkrótszym szacowanym czasem zakończenia
- **Ręczne** — sam wybierasz drukarkę dla każdego zadania

Skonfiguruj w **Harmonogram → Równoważenie obciążenia**.

## Powiadomienia

Harmonogram integruje się z kanałami powiadomień:

- Powiadomienie gdy zadanie się rozpoczyna
- Powiadomienie gdy zadanie jest gotowe
- Powiadomienie przy błędzie lub opóźnieniu

Zobacz [Przegląd funkcji](./oversikt#varsler), aby skonfigurować kanały powiadomień.
