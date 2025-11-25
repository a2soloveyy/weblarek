## Назначение
Короткие инструкции для AI-агента, которые помогут быстро включиться в разработку проекта `weblarek` — как читать структуру, какие файлы править и какие паттерны соблюдать.

**Коротко:** это SPA на Vite + TypeScript с архитектурой MVP, событийным брокером и набором утилит для работы с DOM.

## Архитектура (big picture)
- **Парадигма:** MVP (Model-View-Presenter). См. `README.md` — презентер содержит логику, модели хранят состояние, view (компоненты) отвечают за DOM.
- **События:** связь между слоями реализована через `EventEmitter` в `src/components/base/Events.ts` (поддерживает строки, RegExp и `onAll`).
- **Компоненты:** все UI-компоненты наследуются от `Component<T>` (`src/components/base/Component.ts`). `render(data?: Partial<T>)` делает `Object.assign(this, data)` — код в конструкторе дочернего класса выполняется до инициализации полей дочернего класса.
- **API:** сетевые вызовы через `Api` (`src/components/base/Api.ts`). Базовый адрес формируется из `API_URL` (`src/utils/constants.ts`).

## Ключевые файлы для справки
- `README.md` — содержит архитектурное описание и команды сборки.
- `package.json` — используемые скрипты: `dev`, `build`, `preview`.
- `src/components/base/Api.ts` — fetch-обёртка; `get`, `post`, `handleResponse`.
- `src/components/base/Component.ts` — поведение `render` и `setImage`.
- `src/components/base/Events.ts` — реализация брокера событий.
- `src/utils/*.ts` — DOM-утилиты: `ensureElement`, `ensureAllElements`, `cloneTemplate`, `bem`, `setElementData`, `getElementData`.

## Важные проектные соглашения и нюансы
- Проект ожидает наличие переменной окружения `VITE_API_ORIGIN`. Константы:
  - `API_URL = ${import.meta.env.VITE_API_ORIGIN}/api/weblarek`
  - `CDN_URL = ${import.meta.env.VITE_API_ORIGIN}/content/weblarek`
- `render` у `Component` назначает переданные свойства в экземпляр через `Object.assign` — не полагайтесь на инициализацию полей в конструкторе дочернего класса до вызова `render`.
- `ensureElement` и `ensureAllElements` бросают ошибки при отсутствии элемента — признайте это при рефакторинге и используйте try/catch там, где селектор может отсутствовать.
- `EventEmitter.emit` поддерживает подстановку по `RegExp` и специальный ключ `'*'` (слушать все события) — используйте это при глобальных логах/отладке.
- `Api.handleResponse` отклоняет промис с `data.error` или `response.statusText` — обработчики вызывающих кода ожидают reject с читаемым сообщением.
- Стилевое именование BEM реализуется утилитой `bem(block, element, modifier)` в `src/utils/utils.ts`.

## Команды разработки / сборки
- Установка: `npm install` (или `yarn`).
- Локальная разработка: `npm run dev` (запускает Vite).
- Сборка: `npm run build` (выполняется `tsc && vite build`). Обратите внимание: сначала запускается `tsc`.
- Предпросмотр сборки: `npm run preview`.

## Примеры использования (copy-paste)
- Создать API клиента:
  - `import { API_URL } from 'src/utils/constants';
    const api = new Api(API_URL);
    await api.get('/products');`
- Подписка на событие корзины:
  - `emitter.on('cart:add', (item) => presenter.handleAddToCart(item));`
- Рендер компонента (данные назначаются в экземпляр):
  - `const root = document.querySelector('.card'); const card = new CardComponent(root); card.render({ product });`

## Рекомендации при изменениях кода
- При изменении публичных API утилит (`ensureElement`, `createElement`, `bem`) проверьте все компоненты — они широко используются.
- Не меняйте порядок выполнения конструктора/инициализации в `Component` без полного прогона ручного тестирования, т.к. дочерние классы полагаются на текущую семантику `render`.
- Избегайте глобальных рефакторингов `EventEmitter` без тестовой проверки: события подписываются строками и RegExp.

## Где смотреть дальше (быстрая карта)
- Внешние точки интеграции: `import.meta.env.VITE_API_ORIGIN` (env), серверные endpoints — в `API_URL`.
- UI: `src/components/` — большинство реализаций компонентов и страниц.
- Стили: `src/scss/` и `src/common.blocks/` — BEM-подход к классам.

Если нужно, внесу уточнения (пример: добавить список часто используемых событий или типы в `src/types/index.ts`). Пожалуйста, укажите, какие разделы следует расширить.
