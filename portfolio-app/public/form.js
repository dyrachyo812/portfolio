/* ============================================================
   form.js — клиентская валидация + REST API запросы
   ============================================================ */

const API = '/api/messages';   // базовый URL REST API

/* ── Ссылки на DOM-элементы ─────────────────────────────── */
const fields = {
  name:    document.getElementById('name'),
  email:   document.getElementById('email'),
  subject: document.getElementById('subject'),
  message: document.getElementById('message'),
};
const errors = {
  name:    document.getElementById('err-name'),
  email:   document.getElementById('err-email'),
  subject: document.getElementById('err-subject'),
  message: document.getElementById('err-message'),
};
const btnSubmit  = document.getElementById('btn-submit');
const alertBox   = document.getElementById('alert');
const msgList    = document.getElementById('msg-list');
const emptyState = document.getElementById('empty-state');

/* ── Прогресс-бар прокрутки ─────────────────────────────── */
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  scrollBar.style.width = pct.toFixed(1) + '%';
});

/* ════════════════════════════════════════════════════════════
   Клиентская валидация
   ════════════════════════════════════════════════════════════ */
const rules = {
  name:    v => v.trim().length >= 2    ? '' : 'Минимум 2 символа',
  email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Введите корректный email',
  subject: v => v.trim().length >= 3    ? '' : 'Минимум 3 символа',
  message: v => v.trim().length >= 10   ? '' : 'Минимум 10 символов',
};

function validateField(name) {
  const val = fields[name].value;
  const msg = rules[name](val);
  errors[name].textContent = msg;
  fields[name].classList.toggle('error', !!msg);
  fields[name].classList.toggle('valid', !msg && val.trim().length > 0);
  return !msg;
}

function validateAll() {
  return Object.keys(rules).map(k => validateField(k)).every(Boolean);
}

/* Валидация в реальном времени при вводе */
Object.keys(fields).forEach(name => {
  fields[name].addEventListener('input',  () => validateField(name));
  fields[name].addEventListener('blur',   () => validateField(name));
});

/* ════════════════════════════════════════════════════════════
   Показ уведомления
   ════════════════════════════════════════════════════════════ */
function showAlert(type, title, text) {
  alertBox.className = 'alert ' + (type === 'success' ? 'success' : 'error-alert');
  alertBox.innerHTML = `<strong>${title}</strong>${text}`;
  alertBox.style.display = 'block';
  setTimeout(() => { alertBox.style.display = 'none'; }, 5000);
}

/* ════════════════════════════════════════════════════════════
   Отрисовка карточки сообщения
   ════════════════════════════════════════════════════════════ */
function renderMessage(msg) {
  emptyState.style.display = 'none';

  const date = new Date(msg.createdAt).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });

  const card = document.createElement('div');
  card.className = 'msg-item';
  card.dataset.id = msg.id;
  card.innerHTML = `
    <div class="msg-header">
      <span class="msg-name">${escapeHtml(msg.name)}</span>
      <span class="msg-time">${date}</span>
    </div>
    <div class="msg-subject">${escapeHtml(msg.subject)}</div>
    <div class="msg-text">${escapeHtml(msg.message)}</div>
    <div class="msg-email">${escapeHtml(msg.email)}</div>
    <button class="btn-delete" data-id="${msg.id}">✕ удалить</button>
  `;

  /* Кнопка удаления — DELETE /api/messages/:id */
  card.querySelector('.btn-delete').addEventListener('click', () => deleteMessage(msg.id, card));
  msgList.prepend(card);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}

/* ════════════════════════════════════════════════════════════
   REST API вызовы
   ════════════════════════════════════════════════════════════ */

/* POST /api/messages — отправка формы */
async function sendMessage(payload) {
  const res  = await fetch(API, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload)
  });
  return { ok: res.ok, status: res.status, data: await res.json() };
}

/* GET /api/messages — загрузить все сообщения */
async function loadMessages() {
  try {
    const res  = await fetch(API);
    const json = await res.json();
    if (json.data && json.data.length > 0) {
      json.data.forEach(renderMessage);
    }
  } catch {
    console.warn('Не удалось загрузить сообщения');
  }
}

/* DELETE /api/messages/:id — удалить сообщение */
async function deleteMessage(id, card) {
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      card.style.transition = 'opacity 0.3s, transform 0.3s';
      card.style.opacity    = '0';
      card.style.transform  = 'translateX(20px)';
      setTimeout(() => {
        card.remove();
        if (!document.querySelector('.msg-item')) emptyState.style.display = '';
      }, 300);
    }
  } catch {
    console.warn('Ошибка удаления');
  }
}

/* ════════════════════════════════════════════════════════════
   Обработчик кнопки «Отправить»
   ════════════════════════════════════════════════════════════ */
btnSubmit.addEventListener('click', async () => {
  /* 1. Клиентская валидация */
  if (!validateAll()) {
    showAlert('error', 'Проверьте форму', ' — заполните все поля корректно.');
    return;
  }

  /* 2. Блокируем кнопку */
  btnSubmit.disabled     = true;
  btnSubmit.textContent  = 'Отправка...';

  const payload = {
    name:    fields.name.value.trim(),
    email:   fields.email.value.trim(),
    subject: fields.subject.value.trim(),
    message: fields.message.value.trim(),
  };

  try {
    /* 3. POST на сервер */
    const { ok, status, data } = await sendMessage(payload);

    if (ok) {
      /* 4a. Успех */
      showAlert('success', '✓ Отправлено!', ` Сообщение #${data.data.id} получено сервером.`);
      renderMessage(data.data);

      /* Сброс формы */
      Object.values(fields).forEach(f => {
        f.value = '';
        f.classList.remove('valid', 'error');
      });
      Object.values(errors).forEach(e => e.textContent = '');

    } else if (status === 422) {
      /* 4b. Ошибки валидации с сервера */
      const serverErrors = data.errors || {};
      Object.keys(serverErrors).forEach(k => {
        if (errors[k]) {
          errors[k].textContent = serverErrors[k];
          fields[k].classList.add('error');
        }
      });
      showAlert('error', 'Ошибка сервера', ' — проверьте данные.');

    } else {
      showAlert('error', 'Ошибка', ` — статус ${status}.`);
    }

  } catch (err) {
    showAlert('error', 'Нет связи с сервером', ' — попробуйте позже.');
    console.error(err);
  } finally {
    btnSubmit.disabled    = false;
    btnSubmit.textContent = 'Отправить сообщение';
  }
});

/* ── Загружаем существующие сообщения при старте ── */
loadMessages();
