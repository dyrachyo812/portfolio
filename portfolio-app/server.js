// ============================================================
//  server.js  — REST API сервер для портфолио-формы
//  Запуск:  node server.js
//  Порт:    3000
// ============================================================

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors());                          // разрешаем кросс-доменные запросы
app.use(express.json());                  // парсим JSON-тело запроса
app.use(express.static(path.join(__dirname, 'public'))); // отдаём фронтенд

// ── Хранилище сообщений (в памяти, без БД) ──────────────────
const messages = [];
let   idCounter = 1;

// ── Валидация данных формы ───────────────────────────────────
function validate(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Имя должно содержать минимум 2 символа';
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRe.test(data.email.trim())) {
    errors.email = 'Введите корректный email';
  }

  if (!data.subject || data.subject.trim().length < 3) {
    errors.subject = 'Тема должна содержать минимум 3 символа';
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Сообщение должно содержать минимум 10 символов';
  }

  return errors;
}

// ════════════════════════════════════════════════════════════
//  REST API роуты
// ════════════════════════════════════════════════════════════

// GET /api/messages — получить все сообщения
app.get('/api/messages', (req, res) => {
  res.status(200).json({
    status:  'success',
    count:   messages.length,
    data:    messages
  });
});

// GET /api/messages/:id — получить одно сообщение по id
app.get('/api/messages/:id', (req, res) => {
  const msg = messages.find(m => m.id === Number(req.params.id));
  if (!msg) {
    return res.status(404).json({ status: 'error', message: 'Сообщение не найдено' });
  }
  res.status(200).json({ status: 'success', data: msg });
});

// POST /api/messages — создать новое сообщение (отправка формы)
app.post('/api/messages', (req, res) => {
  const errors = validate(req.body);

  // Если есть ошибки — возвращаем 422 с деталями
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      status:  'error',
      message: 'Ошибка валидации',
      errors
    });
  }

  const newMsg = {
    id:        idCounter++,
    name:      req.body.name.trim(),
    email:     req.body.email.trim(),
    subject:   req.body.subject.trim(),
    message:   req.body.message.trim(),
    createdAt: new Date().toISOString()
  };

  messages.push(newMsg);

  console.log(`[${newMsg.createdAt}] Новое сообщение от ${newMsg.name} <${newMsg.email}>`);

  res.status(201).json({
    status:  'success',
    message: 'Сообщение успешно отправлено!',
    data:    newMsg
  });
});

// DELETE /api/messages/:id — удалить сообщение
app.delete('/api/messages/:id', (req, res) => {
  const idx = messages.findIndex(m => m.id === Number(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ status: 'error', message: 'Сообщение не найдено' });
  }
  messages.splice(idx, 1);
  res.status(200).json({ status: 'success', message: 'Сообщение удалено' });
});

// GET /api/health — проверка работоспособности сервера
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status:  'ok',
    uptime:  process.uptime().toFixed(1) + 's',
    time:    new Date().toISOString()
  });
});

// ── Все остальные маршруты → index.html (SPA fallback) ───────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Запуск сервера ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Сервер запущен: http://localhost:${PORT}`);
  console.log(`📋  API:           http://localhost:${PORT}/api/messages`);
  console.log(`❤️   Health:        http://localhost:${PORT}/api/health`);
});
