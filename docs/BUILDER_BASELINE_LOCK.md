# Operation Baseline Lock

**Русское название:** Операция **«Baseline Lock»** (фиксация базовой линии конструктора)

**Дата фиксации:** 29 июня 2026  
**Git tag:** `builder-baseline-lock`  
**Коммит:** `a474e85` — *Restore polished builder UI baseline from b5e0fcd*  
**Исходный polish:** `b5e0fcd` (19 июня 2026) · `5986d53` (page-structure sidebar)

---

## Что это

Зафиксированная версия Page Builder, которую мы оба признали **готовой**.  
Не редизайн — **возврат** к проверенной трёхколоночной модели после случайного дрейфа UI.

## Как выглядит (правила, которые нельзя ломать без явной просьбы)

| Зона | Роль |
|------|------|
| **Слева** | Единственная навигация: структура страницы + **% Ready** + **Next step** + зелёные **✓** |
| **Центр** | Один редактор: Header → Sections (карточки блоков) → Design → Payments |
| **Справа** | Live preview |

**Поведение:** клик по пункту слева → раскрывается **одна** карточка в Sections по центру.  
**Запрещено:** второй список секций, дублирующее меню, 20+ пунктов «More sections», отдельный `FocusedSectionPanel`.

## Что пошло не так (дрейф, который откатили)

1. `b1a98e8` — спрятали Sections в build-режиме, урезали меню  
2. `862a4b7` … `a1936fc` — переписали навигацию, дубли, два «Results»

## Ключевые файлы (не трогать архитектуру)

- `components/builder/team-page-builder.tsx`
- `components/builder/builder-page-structure-nav.tsx`
- `lib/builder/page-structure.ts`
- `components/builder/page-blocks-panel.tsx`

## Визуальная схема

`showcase/builder-ux-timeline.html` — открыть в браузере для напоминания «было / сломали / вернули».

## Как вернуть baseline, если снова поплывёт

```bash
git checkout builder-baseline-lock -- \
  components/builder/team-page-builder.tsx \
  components/builder/builder-page-structure-nav.tsx \
  lib/builder/page-structure.ts \
  components/builder/page-blocks-panel.tsx
```

Или целиком: `git checkout builder-baseline-lock`

## Дальше

Точечные правки по запросу — **поверх** этой базы.  
Без запроса — не менять каркас, не «улучшать» и не «модернизировать» конструктор.
