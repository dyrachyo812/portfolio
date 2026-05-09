# 📁 Portfolio App — REST API + Node.js + Docker

Учебный проект: контактная форма с серверной валидацией, REST API и Docker-контейнером.

---

## 🗂 Структура проекта

```
portfolio-app/
├── public/
│   ├── index.html     ← фронтенд (форма + стили)
│   └── form.js        ← клиентский JS (валидация + fetch)
├── server.js          ← Node.js сервер (Express, REST API)
├── package.json
├── Dockerfile
├── docker-compose.yml
└── .dockerignore
```

---

## 🚀 Способ 1 — Запуск через Docker Compose (рекомендуется)

```bash
# 1. Собрать образ и запустить контейнер
docker-compose up --build

# 2. Открыть в браузере
http://localhost:3000

# 3. Остановить
docker-compose down
```

---

## 🚀 Способ 2 — Запуск локально (без Docker)

```bash
# Нужен Node.js 18+

# 1. Установить зависимости
npm install

# 2. Запустить сервер
node server.js

# 3. Открыть в браузере
http://localhost:3000
```

---

## 📡 REST API эндпоинты

| Метод    | URL                    | Описание                    |
|----------|------------------------|-----------------------------|
| `GET`    | `/api/messages`        | Получить все сообщения      |
| `GET`    | `/api/messages/:id`    | Получить одно сообщение     |
| `POST`   | `/api/messages`        | Создать сообщение (форма)   |
| `DELETE` | `/api/messages/:id`    | Удалить сообщение           |
| `GET`    | `/api/health`          | Проверка работоспособности  |

### Пример POST-запроса

```json
POST /api/messages
Content-Type: application/json

{
  "name": "Богдан",
  "email": "bogdan@example.com",
  "subject": "По поводу стажировки",
  "message": "Здравствуйте! Хотел бы узнать подробности."
}
```

### Успешный ответ (201)

```json
{
  "status": "success",
  "message": "Сообщение успешно отправлено!",
  "data": {
    "id": 1,
    "name": "Богдан",
    "email": "bogdan@example.com",
    "subject": "По поводу стажировки",
    "message": "Здравствуйте! Хотел бы узнать подробности.",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### Ошибка валидации (422)

```json
{
  "status": "error",
  "message": "Ошибка валидации",
  "errors": {
    "email": "Введите корректный email",
    "message": "Сообщение должно содержать минимум 10 символов"
  }
}
```

---

## 🐙 Загрузка на GitHub

```bash
git init
git add .
git commit -m "feat: portfolio app with REST API and Docker"
git remote add origin https://github.com/dyrachyo812/portfolio-app.git
git push -u origin main
```
