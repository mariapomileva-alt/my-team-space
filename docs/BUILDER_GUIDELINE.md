# Гайдлайн конструктора Team Page Builder

**Для кого:** продукт, дизайн, разработка — единый источник правды о том, что умеет конструктор, какие данные собираются и как это связано с WhatsApp и внешними сервисами.

**Связанные документы:**
- [BUILDER_BASELINE_LOCK.md](./BUILDER_BASELINE_LOCK.md) — зафиксированная трёхколоночная архитектура UI (не ломать без явной просьбы)
- `.cursor/rules/team-data-sync.mdc` — синхронизация данных команды между облаком и браузером
- `.cursor/rules/team-hero-layout.mdc` — четыре варианта hero-карточки

---

## 1. Философия

Конструктор — **не CMS и не конструктор сайтов**. Это инструмент коуча, чтобы за ~5 минут собрать **одну спокойную ссылку для родителей**: расписание, контакты, фото, результаты, опросы — без приложения и без IT.

| Принцип | Как это выглядит |
|--------|------------------|
| **Один link** | `myteamspace.cc/{slug}` — родители сохраняют в закладки |
| **Блоки как Lego** | Включил нужное — остальное скрыто |
| **Мгновенное обновление** | Сохранил в конструкторе → родители видят сразу |
| **WhatsApp — родной канал** | Не «интеграция ради интеграции», а готовые кнопки и тексты для чата |
| **Сбор данных без CRM** | Опросы, ростер, трекер оплат — простые формы, без сложной админки |

---

## 2. Архитектура конструктора

```
┌─────────────────┬──────────────────────────┬─────────────────┐
│  Структура      │  Редактор (одна карточка) │  Live preview   │
│  страницы       │  Header → Sections →      │  как у родителей│
│  % Ready        │  Design → Payments        │                 │
│  Next step ✓    │                           │                 │
└─────────────────┴──────────────────────────┴─────────────────┘
```

**Ключевые файлы:** `team-page-builder.tsx`, `builder-page-structure-nav.tsx`, `page-blocks-panel.tsx`, `lib/builder/page-structure.ts`, `lib/blocks/meta.ts`.

**Поведение:** клик по пункту слева → раскрывается **одна** карточка блока в центре. Нет второго списка секций и дублирующих меню.

**Single Team:** `/admin` → сразу в build. **Academy:** хаб с карточками команд, Edit → build.

---

## 2.1 Academy Plan — несколько команд

Отдельный тариф для клубов и академий с **до 20 командами** на одном аккаунте коуча (`ACADEMY_TEAM_LIMIT` в `lib/billing/config.ts`).

### Маршрутизация и UX

| Контекст | Single Team | Academy |
|----------|-------------|---------|
| `/admin` | Редирект в build единственной команды | **Хаб** — карточки всех команд |
| Редактирование страницы | Сразу build | Build выбранной команды |
| Назад к списку | — | «← All teams» в сайдбаре конструктора |
| Первая команда | Onboarding `FirstTeamSetup` | То же, затем хаб при добавлении команд |

### Хаб академии (`/admin`)

- Карточки команд с **Edit** → `teamBuildPath(id)`
- Сводка по команде (`loadAcademyTeamSummaries`): участники, ближайшие события, достижения, **% Ready** страницы
- Лимит: `N / 20 teams used`
- Апгрейд с Team Plan: checkout `academy`, баннеры в `builder-billing-status` / `builder-edit-access-banner`

### Что общее, что отдельное

| Общее на аккаунт | Отдельно на каждую команду |
|------------------|----------------------------|
| Подписка Lemon Squeezy | Публичная страница и slug |
| Лимит числа команд | Блоки, тема, контент |
| Роль coach / assistant | Members, Results, Schedule tools |
| Биллинг portal | `poll_votes`, roster, payments tracker |

### Ассистенты

- Coach приглашает assistant через Members
- Assistant видит команду в `/admin`, но не владеет биллингом
- Build-first UX одинаковый — assistant редактирует страницу в build

### Конструктор для Academy

- `showAcademyHub={true}` → ссылка «All teams» + блок **Academy** в панели «How it works» (`lib/builder/coach-help-content.ts`)
- Архитектура конструктора **та же** (3 колонки) — меняется только навигация «вверх» к хабу

### Файлы

- `app/admin/(protected)/page.tsx` — хаб
- `lib/admin/load-academy-team-summaries.ts` — статистика карточек
- `components/admin/academy-team-stats.tsx`
- `lib/admin/load-team-admin-context.ts` → `showAcademyHub`
- `lib/billing/coach-subscription.ts` — entitlements, `planType`

---

## 3. Путь коуча (Setup in minutes)

Рекомендуемый порядок — совпадает с прогрессом в сайдбаре (`lib/builder/page-completion.ts`):

| Шаг | Что делает коуч | Блок / поле |
|-----|-----------------|-------------|
| 1 | Название команды | `team.name` |
| 2 | Логотип | `team.logoUrl` / hero |
| 3 | Обложка | hero `coverImageUrl` |
| 4 | Описание / девиз | `tagline`, hero `description` / `quote` |
| 5 | Контакты | `contacts` |
| 6 | Первое событие | `schedule` или `calendar` |
| 7 | Галерея | `gallery` |
| 8 | Соцсети + WhatsApp | hero `social` |
| 9 | Результаты (опц.) | `results` |

**Публикация:** обязательны только **название + логотип**. Остальное — рекомендации, не блокеры.

**Биллинг:** редактировать и превью — бесплатно; публикация может требовать подписку (`lib/billing/publish-access.ts`).

---

## 4. Блоки страницы

Источник метаданных: `lib/blocks/meta.ts`. Три секции в конструкторе:

### 4.1 Essential — «что нужно каждой семье»

| Блок | Назначение | Данные / синхронизация |
|------|------------|------------------------|
| **Announcement bar** | Срочные объявления (тренировка, автобус) | Текст в настройках блока |
| **Team identity (hero)** | Логотип, обложка, название, город, девиз, соцсети, WhatsApp для родителей | `hero` settings + `team.logoUrl`; 4 layout-варианта — см. team-hero-layout rule |
| **Schedule** | Расписание тренировок | Ручной ввод **или** внешняя ссылка Google Calendar / iCal URL |
| **Calendar embed** | Встроенный внешний календарь | `externalUrl` — embed, не двусторонняя синхронизация |
| **Contacts** | Тренеры, клуб | Список `items[]` (имя, роль, телефон, email) |
| **Quick links** | WhatsApp, Telegram, Instagram — один тап | Поля `whatsapp`, `telegram`, `instagram`, … |
| **Quick Actions** | Кнопки-ссылки: регистрация, карта, видео | Массив кнопок с URL |
| **Smart integrations** | Дашборд ссылок на Strava, Garmin, YouTube… | URL → авто-детект провайдера (`lib/integrations/providers.ts`) |
| **Team Shop** | Мерч с ценой и ссылкой на заказ | Товары → Shopify / форма / WhatsApp / любой URL |

### 4.2 Engagement — «держать сообщество в курсе»

| Блок | Назначение | Данные / синхронизация |
|------|------------|------------------------|
| **Photo gallery** | Фото сетка | URL картинок или ссылка на альбом |
| **Polls** | Быстрые голосования родителей | Голоса в `poll_votes` (Supabase); см. §5 |
| **Achievements** | Трофеи и хайлайты | Привязка к ростеру (`attendance.roster`) |
| **Results board** | Медали, очки, соревнования | Ручной ввод; share в WhatsApp |
| **Team feed** | Лента новостей и фото | Посты в настройках блока |

### 4.3 Advanced — «опциональные power tools»

| Блок | Назначение | Данные / синхронизация |
|------|------------|------------------------|
| **Payments** | Ссылка на оплату взносов | Один payment URL на публичной странице |
| **Payments tracker** | Трекер «кто оплатил» (только коуч) | `page_settings.payments[]` — не публичный блок, панель в конструкторе |
| **Attendance** | Кто пришёл | Ростер `roster[]` — **хаб данных** для других блоков |
| **Camp & logistics** | Поездки, автобусы, чеклисты | Структурированные поля поездки |
| **Documents** | PDF, согласия | Ссылки на файлы |
| **Team resources** | Планы, музыка, travel notes | Файлы / ссылки |
| **Birthdays** | Дни рождения из ростера | Читает `attendance.roster[].birthday` |
| **Partners** | Спонсоры | Логотипы и ссылки |
| **Weather** | Погода на поле | Город / координаты |
| **Countdown** | Обратный отсчёт до события | Дата события |

**По умолчанию включены:** `hero`, `schedule`, `gallery`, `contacts` (`lib/default-blocks.ts`).

**Пустые блоки скрыты** на публичной странице (`lib/blocks/public-block-visibility.ts`).

---

## 5. Сбор данных

### 5.1 Опросы (Polls)

| Что | Где |
|-----|-----|
| Вопрос, варианты Yes/No | `block.settings` (PollSettings) |
| Имя голосующего + выбор | Таблица `poll_votes` (team_id, block_id, voter_name, choice) |
| Телефон коуча для уведомлений | `page_settings.coachWhatsapp` |

**Поток голосования:**
1. Родитель голосует на публичной странице → POST `/api/teams/{slug}/poll-vote`
2. Голос сохраняется в БД
3. Коучу: либо **WhatsApp click-to-chat** с готовым текстом (бесплатно), либо **Twilio SMS/WhatsApp** (если настроен)

**Коуч в конструкторе:** список ответов + кнопка «Share poll in WhatsApp» с агрегированным summary.

### 5.2 Ростер (Attendance block)

Единый список спортсменов: `id`, `name`, `birthday`, фото.

**Используется блоками:**
- Attendance — отметки присутствия
- Birthdays — ближайшие ДР
- Achievements — выбор игрока
- Results board — фото атлета по id/имени (`lib/blocks/roster.ts`)

Ростер **не синхронизируется** с внешними системами — ручной ввод коуча.

### 5.3 Трекер оплат (Payments tracker)

| Что | Где |
|-----|-----|
| Строки: месяц, label, статус (paid/pending/unpaid) | `page_settings.payments[]` |
| Публичная ссылка на оплату | блок `payments` |

Только для коуча в конструкторе. Share summary в WhatsApp — `buildPaymentsShareMessage()`.

### 5.4 Аудитория блоков

При `pageVisibility === "mixed"` у каждого блока: **Everyone** или **Members only** (`block.settings.audience`).

---

## 6. WhatsApp и коммуникации

MyTeamSpace **не заменяет WhatsApp** — он **встраивается** в привычный поток коуча и родителей.

### 6.1 Три режима работы с WhatsApp

| Режим | Как работает | Стоимость | Где в продукте |
|-------|--------------|-----------|----------------|
| **Click-to-chat (родитель → коуч)** | `wa.me/{phone}?text=…` — родитель нажимает Send | Бесплатно | Hero «WhatsApp for parents», Quick links, голос в опросе |
| **Share summary (коуч → группа)** | `wa.me/?text=…` — коуч выбирает чат, текст уже готов | Бесплатно | Results, Payments tracker, Poll summary |
| **Auto-notify (Twilio)** | Сервер шлёт SMS или WhatsApp коучу после голоса | Twilio (опц.) | `lib/notify/twilio.ts`, env `TWILIO_*` |

### 6.2 Готовые тексты для WhatsApp

`lib/whatsapp-summaries.ts`:
- **Results** — соревнования, медали, ссылка на страницу
- **Payments** — статусы по месяцам (✅ ⏳ ❌)
- **Poll** — кто за / против с именами

`lib/whatsapp-link.ts`:
- `whatsappClickToChatUrl(phone, message)` — к конкретному номеру
- `whatsappShareUrl(message)` — коуч выбирает чат
- `buildPollNotifyMessage()` — уведомление о одном голосе

### 6.3 Где коуч указывает WhatsApp

| Место | Назначение |
|-------|------------|
| Hero → «WhatsApp for parents» | Кнопка на публичной странице для связи с коучем |
| Quick links → WhatsApp | Отдельная плитка быстрых ссылок |
| Polls → «Your WhatsApp / phone» | Куда прилетает уведомление о голосе |
| Team Shop / Quick Actions | Ссылка на заказ через WhatsApp (любой URL) |

### 6.4 Чего **нет** (честные границы)

- Нет двусторонней синхронизации чата WhatsApp с блоками страницы
- Нет автопостинга обновлений страницы в WhatsApp-группу (только ручной Share)
- Нет WhatsApp Business API для массовых рассылок
- Twilio — опциональный fallback; по умолчанию — click-to-chat

---

## 7. Внешние сервисы и «синхронизация»

Важно: почти все интеграции — **ссылки и embed**, не API-sync.

### 7.1 Расписание

| Режим | Описание |
|-------|----------|
| **Manual** | Дни недели, время, локация — ввод в конструкторе |
| **External URL** | Google Calendar public URL / iCal feed — отображение, не редактирование из MTS |

### 7.2 Smart integrations (блок)

Авто-распознавание по URL (`INTEGRATION_PROVIDERS`):

**Fitness:** Garmin, TrainingPeaks, Strava  
**Calendar:** Google Calendar  
**Photos:** Google Photos  
**Video:** YouTube, Vimeo  
**Social:** Instagram, TikTok  
**Chat:** Telegram, WhatsApp (групповые ссылки)  
**Docs:** Notion, Google Drive  
**Music:** Spotify  
**Design:** Canva  
**Sports:** Hudl, Veo, UTR, Tournament Software  

Коуч вставляет ссылку → красивая карточка на странице. Данные **не подтягиваются** автоматически с API провайдера.

### 7.3 Галерея и медиа

- Прямые URL изображений
- Ссылки на альбомы (Google Photos и др.)
- Загрузка через storage (builder editors с `teamId`)

### 7.4 Платежи

- Публичный блок: одна ссылка (Revolut, Stripe, банк, форма)
- Трекер: ручной статус по каждому родителю/взносу

### 7.5 Магазин

Товар → фото, цена, **любая** ссылка заказа (Shopify, Printful, Google Form, WhatsApp).

---

## 8. Публикация и шаринг

| Элемент | Поведение |
|---------|-----------|
| **Publish** | Требует имя + логотип; может требовать checkout |
| **Share modal** | Ссылка + QR после публикации |
| **Toolbar** | Parent link и QR всегда доступны (не прятать за nav) |
| **Revalidate** | После save — `revalidatePublicTeamPaths(slug)` |

---

## 9. Данные и синхронизация (техническое)

| Правило | Детали |
|---------|--------|
| Источник правды | Supabase `teams` row (production) |
| Optimistic lock | `updated_at` на каждом save |
| Логотип | `logo_url` > hero > `logo_path` (legacy) |
| Кэш публичной страницы | `unstable_cache` + revalidate по slug |
| Локальный preview | Очищается при открытии build; не мержится поверх cloud |

Полная спецификация: `.cursor/rules/team-data-sync.mdc`.

---

## 10. Копирайт и тон в конструкторе

- **Спокойный, не давящий:** «About 5 minutes to finish», не «You must complete 8 steps»
- **Профессиональный для родителей:** «One calm link», не «dashboard»
- **WhatsApp — привычно:** «Tap Send in WhatsApp — it's free»
- **Опциональное — явно опционально:** Payments, Attendance, Camp — «Optional tools»

Мотивационные строки: `getProgressMotivationLine()`, guidance: `getCompletionGuidance()`.

---

## 11. Чеклист для новых фич в конструкторе

Перед добавлением блока или интеграции:

- [ ] Есть ли место в Essential / Engagement / Advanced?
- [ ] Скрывается ли блок на публичной странице, если пустой?
- [ ] Нужен ли share в WhatsApp? (если да — добавить в `whatsapp-summaries.ts`)
- [ ] Собираются ли данные? Куда пишутся (block settings vs `page_settings` vs отдельная таблица)?
- [ ] Не ломает ли baseline lock (три колонки, одна карточка редактора)?
- [ ] Hero остаётся одним `TeamHeroCard` с CSS-вариантами?

---

## 12. Карта файлов по темам

| Тема | Файлы |
|------|-------|
| Метаданные блоков | `lib/blocks/meta.ts`, `lib/blocks/settings.ts` |
| Редакторы | `components/builder/editors/*`, `block-settings-editor.tsx` |
| Публичный рендер | `components/blocks/all-blocks.tsx`, `registry.tsx` |
| Прогресс / publish | `lib/builder/page-completion.ts`, `page-structure.ts` |
| WhatsApp | `lib/whatsapp-link.ts`, `lib/whatsapp-summaries.ts`, `components/shared/whatsapp-share-button.tsx` |
| Опросы API | `app/api/teams/[teamSlug]/poll-vote/route.ts` |
| Интеграции | `lib/integrations/providers.ts`, `build-preview.ts` |
| Ростер | `lib/blocks/roster.ts`, `roster-editor.tsx` |
| Биллинг | `lib/billing/publish-access.ts`, `coach-subscription.ts` |
| Гайд для коучей в UI | `lib/builder/coach-help-content.ts`, `components/builder/builder-how-it-works.tsx` |

---

*Последнее обновление: июнь 2026. При изменении поведения конструктора — обновлять этот документ в том же PR.*
