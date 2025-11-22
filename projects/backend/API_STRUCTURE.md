# Структура API

## 📊 Визуальная схема

```
/api
├── /admin (Админская часть - требует авторизации)
│   │
│   ├── /auth
│   │   └── /login              POST    Авторизация работодателя
│   │
│   ├── /vacancies
│   │   ├── /                   GET     Список вакансий работодателя
│   │   ├── /                   POST    Создать вакансию
│   │   └── /[id]
│   │       ├── /               GET     Детали вакансии
│   │       ├── /               PATCH   Обновить вакансию
│   │       └── /               DELETE  Удалить вакансию
│   │
│   ├── /applicants
│   │   ├── /                   GET     Все отклики работодателя
│   │   └── /[id]
│   │       ├── /               GET     Детали отклика
│   │       └── /               PATCH   Изменить статус (→ уведомления)
│   │
│   └── /tags
│       ├── /                   GET     Все теги
│       └── /                   POST    Создать тег
│
│
└── /site (Публичная часть - без авторизации)
    │
    ├── /vacancies
    │   ├── /                   GET     Открытые вакансии (с фильтрами)
    │   └── /[id]
    │       └── /               GET     Детали вакансии
    │
    ├── /applicants
    │   └── /                   POST    Подать заявку (→ уведомления)
    │
    └── /tags
        └── /                   GET     Все теги для фильтрации
```

---

## 🔄 Потоки данных

### 1️⃣ Работодатель создает вакансию

```
[Работодатель]
    ↓ POST /api/admin/vacancies
[Backend + Prisma]
    ↓ Создание в БД
[Vacancy + Tags]
    ↓ Доступна в
[GET /api/site/vacancies] ← [Соискатели]
```

### 2️⃣ Соискатель откликается на вакансию

```
[Соискатель]
    ↓ POST /api/site/applicants
[Backend + Prisma]
    ↓ Сохранение в БД
[Applicant (status: PENDING)]
    ↓ Триггер уведомления
    ├─→ [Telegram Bot] → [Работодатель получает уведомление]
    └─→ [Email] → [Соискатель получает подтверждение]
```

### 3️⃣ Работодатель меняет статус заявки

```
[Работодатель]
    ↓ PATCH /api/admin/applicants/[id]
    ↓ { status: "ACCEPTED" }
[Backend + Prisma]
    ↓ Обновление статуса
[Applicant (status: ACCEPTED)]
    ↓ Триггер уведомления
    ├─→ [Telegram Bot] → [Соискатель: "Ваша заявка принята! ✅"]
    └─→ [Email] → [Соискатель: "Ваша заявка принята!"]
```

---

## 🎯 Модели и связи

```
Employer (Работодатель)
    ├─ 1:N → Vacancy (Вакансия)
    │           ├─ 1:N → Applicant (Отклик)
    │           │           └─ status: ApplicationStatus
    │           └─ M:N → Tag (через VacancyTag)
    ├─ telegramChatId (для уведомлений)
    └─ password (хешированный)

Tag (Тег/Скил)
    ├─ name: "React"
    ├─ slug: "react"
    └─ M:N → Vacancy (через VacancyTag)

Applicant (Отклик)
    ├─ email (для уведомлений)
    ├─ telegramChatId (опционально, для уведомлений)
    ├─ status: PENDING | REVIEWED | ACCEPTED | REJECTED
    └─ N:1 → Vacancy
```

---

## 🔐 Авторизация

### Админские роуты (`/api/admin/*`)

- Требуют JWT токен в заголовке `Authorization: Bearer <token>`
- Токен получается через `POST /api/admin/auth/login`
- Токен содержит `employerId` для определения владельца

### Публичные роуты (`/api/site/*`)

- Доступны без авторизации
- Rate limiting для предотвращения спама

---

## 📨 Уведомления

### Telegram Bot

**Работодателю (при новом отклике):**

```
🔔 Новый отклик!

Вакансия: Frontend разработчик
Кандидат: Иван Иванов
Email: ivan@example.com
Телефон: +7 900 123-45-67

[Просмотреть отклик]
```

**Соискателю (при смене статуса):**

```
✅ Статус заявки изменен!

Вакансия: Frontend разработчик
Компания: Название компании
Новый статус: ACCEPTED

Ожидайте звонка от работодателя!
```

---

## 📂 Файловая структура

```
/app/api/
├── admin/                    # Админские роуты
│   ├── auth/
│   │   └── login/route.ts
│   ├── vacancies/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── applicants/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── tags/route.ts
│
└── site/                     # Публичные роуты
    ├── vacancies/
    │   ├── route.ts
    │   └── [id]/route.ts
    ├── applicants/route.ts
    └── tags/route.ts

/projects/backend/
├── lib/
│   ├── prisma.ts            # Prisma Client
│   ├── telegram.ts          # Telegram интеграция
│   ├── mailer.ts            # Email интеграция
│   └── types.ts             # Типы и Zod схемы
└── prisma/
    └── schema.prisma        # Схема БД
```
