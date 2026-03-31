---
sidebar_position: 1
title: Встановлення
description: Встановіть 3DPrintForge на свій сервер або локальний комп'ютер
---

# Встановлення

## Вимоги

| Вимога | Мінімум | Рекомендовано |
|--------|---------|---------------|
| Node.js | 22.x | 22.x LTS |
| RAM | 512 МБ | 1 ГБ+ |
| Диск | 500 МБ | 2 ГБ+ |
| ОС | Linux, macOS, Windows | Linux (Ubuntu/Debian) |

:::warning Node.js 22 обов'язковий
3DPrintForge використовує `--experimental-sqlite`, вбудований у Node.js 22. Старіші версії не підтримуються.
:::

## Встановлення за допомогою install.sh (рекомендовано)

Найпростіший спосіб — скористатися інтерактивним скриптом встановлення:

```bash
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge
./install.sh
```

Скрипт проведе вас через налаштування у браузері. Для встановлення через термінал із підтримкою systemd:

```bash
./install.sh --cli
```

## Ручне встановлення

```bash
# 1. Клонуйте репозиторій
git clone https://github.com/skynett81/3dprintforge.git
cd 3dprintforge

# 2. Встановіть залежності
npm install

# 3. Запустіть дашборд
npm start
```

Відкрийте браузер за адресою `https://localhost:3443` (або `http://localhost:3000`, яка перенаправляє).

:::info Самопідписаний SSL-сертифікат
При першому запуску дашборд генерує самопідписаний SSL-сертифікат. Браузер відобразить попередження — це нормально. Дивіться [HTTPS-сертифікати](./setup#https-sertifikater) для встановлення власного сертифіката.
:::

## Docker

```bash
docker-compose up -d
```

Дивіться [Налаштування Docker](../advanced/docker) для повної конфігурації.

## Служба systemd

Щоб запустити дашборд як фонову службу:

```bash
./install.sh --cli
# Виберіть "Так" при запиті про службу systemd
```

Або вручну:

```bash
sudo systemctl enable --now 3dprintforge
sudo systemctl status 3dprintforge
```

## Оновлення

3DPrintForge має вбудоване автоматичне оновлення через GitHub Releases. Оновлення можна виконати з дашборду в розділі **Налаштування → Оновлення** або вручну:

```bash
git pull
npm install
npm start
```

## Видалення

```bash
./uninstall.sh
```

Скрипт видалить службу, конфігурацію та дані (ви обираєте, що саме видалити).
