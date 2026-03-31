---
sidebar_position: 1
title: API-довідник
description: REST API з 284+ ендпоінтами, автентифікацією та обмеженням запитів
---

# API-довідник

3DPrintForge відкриває повноцінний REST API з 284+ ендпоінтами. Документація API доступна безпосередньо в дашборді.

## Інтерактивна документація

Відкрийте документацію OpenAPI у браузері:

```
https://ваш-сервер:3443/api/docs
```

Тут ви знайдете всі ендпоінти, параметри, схеми запиту/відповіді та можливість тестувати API безпосередньо.

## Автентифікація

API використовує автентифікацію **Bearer token** (JWT):

```bash
# Увійдіть та отримайте токен
curl -X POST https://ваш-сервер:3443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "ваш-пароль"}'

# Відповідь
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

Використовуйте токен у всіх наступних викликах:

```bash
curl https://ваш-сервер:3443/api/printers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Обмеження запитів

API обмежений для захисту сервера:

| Обмеження | Значення |
|--------|-------|
| Запитів за хвилину | 200 |
| Burst (макс. за секунду) | 20 |
| Відповідь при перевищенні | `429 Too Many Requests` |

Заголовок `Retry-After` у відповіді вказує, через скільки секунд дозволено наступний запит.

## Огляд ендпоінтів

### Автентифікація
| Метод | Ендпоінт | Опис |
|--------|-----------|-------------|
| POST | `/api/auth/login` | Увійдіть, отримайте JWT |
| POST | `/api/auth/logout` | Вийдіть |
| GET | `/api/auth/me` | Отримайте поточного користувача |

### Принтери
| Метод | Ендпоінт | Опис |
|--------|-----------|-------------|
| GET | `/api/printers` | Список всіх принтерів |
| POST | `/api/printers` | Додати принтер |
| GET | `/api/printers/:id` | Отримати принтер |
| PUT | `/api/printers/:id` | Оновити принтер |
| DELETE | `/api/printers/:id` | Видалити принтер |
| GET | `/api/printers/:id/status` | Статус у реальному часі |
| POST | `/api/printers/:id/command` | Надіслати команду |

### Філамент
| Метод | Ендпоінт | Опис |
|--------|-----------|-------------|
| GET | `/api/filaments` | Список всіх котушок |
| POST | `/api/filaments` | Додати котушку |
| PUT | `/api/filaments/:id` | Оновити котушку |
| DELETE | `/api/filaments/:id` | Видалити котушку |
| GET | `/api/filaments/stats` | Статистика споживання |

### Історія друку
| Метод | Ендпоінт | Опис |
|--------|-----------|-------------|
| GET | `/api/history` | Список історії (з пагінацією) |
| GET | `/api/history/:id` | Отримати окремий друк |
| GET | `/api/history/export` | Експортувати CSV |
| GET | `/api/history/stats` | Статистика |

### Черга друку
| Метод | Ендпоінт | Опис |
|--------|-----------|-------------|
| GET | `/api/queue` | Отримати чергу |
| POST | `/api/queue` | Додати завдання |
| PUT | `/api/queue/:id` | Оновити завдання |
| DELETE | `/api/queue/:id` | Видалити завдання |
| POST | `/api/queue/dispatch` | Примусовий dispatch |

## WebSocket API

Крім REST, є WebSocket API для даних у реальному часі:

```javascript
const ws = new WebSocket('wss://ваш-сервер:3443/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data.payload);
};
```

### Типи повідомлень (вхідні)
- `printer.status` — оновлений статус принтера
- `print.progress` — оновлення відсотку прогресу
- `ams.update` — зміна стану AMS
- `notification` — повідомлення сповіщення

## Коди помилок

| Код | Значення |
|------|-------|
| 200 | OK |
| 201 | Створено |
| 400 | Невірний запит |
| 401 | Не автентифіковано |
| 403 | Не авторизовано |
| 404 | Не знайдено |
| 429 | Забагато запитів |
| 500 | Помилка сервера |
