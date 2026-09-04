# Nexus Analytics

Демонстрационный аналитический сервис на **Next.js**, **TypeScript** и **Tailwind CSS**.

На главной странице (`/`) — лендинг сервиса с описанием и каруселью скринов.  
Дашборд доступен по адресу `/dashboard` после входа или регистрации (данные хранятся в `localStorage`).

## Возможности

- лендинг с описанием сервиса и каруселью экранов
- регистрация и вход через `localStorage`
- обзор продаж: KPI, график выручки, каналы трафика
- вкладка **Заказы** с фильтрами и карточкой деталей
- вкладка **Клиенты** с сегментами, LTV и связанными заказами
- вкладка **Аналитика**: воронка, продукты, оплаты, города
- настройки: переключение светлой и тёмной темы
- адаптивный интерфейс (сайдбар, шапка, поиск)

## Требования

- [Node.js](https://nodejs.org/) 18+ (рекомендуется LTS)
- npm 9+

## Установка

```bash
git clone <url-репозитория>
cd dashboard_2_Next_TS
npm install
```

## Запуск в режиме разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

- `/` — главная страница сервиса  
- `/dashboard` — дашборд (нужна регистрация / вход)

## Сборка

```bash
npm run build
```

Проект настроен на статический export (`output: "export"`).  
После сборки готовые файлы появятся в папке `out`.

Локальный просмотр production-сборки (если нужен сервер Next.js без export):

```bash
npm run start
```

## Деплой на Beget (статический хостинг)

1. Соберите проект:

```bash
npm run build
```

2. В панели Beget откройте файловый менеджер или подключитесь по FTP/SFTP.
3. Загрузите **содержимое** папки `out` в каталог сайта (`public_html` или папку домена).
4. Откройте домен в браузере.

Сайт должен открываться с корня домена (без `basePath`).

## Скрипты

| Команда        | Описание                          |
|----------------|-----------------------------------|
| `npm run dev`  | Локальный сервер разработки       |
| `npm run build`| Production-сборка в `out`         |
| `npm run start`| Запуск production-сервера Next.js |
| `npm run lint` | Проверка ESLint                   |

## Структура проекта

```text
src/
  app/                 # маршруты App Router
    page.tsx           # лендинг (/)
    dashboard/page.tsx # дашборд (/dashboard)
  components/          # UI-компоненты по папкам
    landingPage/
    authGate/
    loginForm/
    registerForm/
    dashboardShell/
    ordersPanel/
    customersPanel/
    analyticsPanel/
    settingsPanel/
    themeProvider/
  lib/                 # auth, theme, демо-данные
```

## Авторизация и тема

- пользователи и сессия: `localStorage` (`nexus-dashboard-users`, `nexus-dashboard-session`)
- тема: `localStorage` (`nexus-dashboard-theme`)

Это демо-проект без серверной БД и бэкенда.

## Стек

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
