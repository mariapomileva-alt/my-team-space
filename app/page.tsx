import Link from "next/link";

export default function MarketingHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-orange-50 text-zinc-900">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
        <span className="text-lg font-extrabold tracking-tight">MyTeamSpace</span>
        <nav className="flex flex-wrap gap-2 text-sm font-semibold">
          <Link href="/sharky" className="rounded-full bg-zinc-900 px-4 py-2 text-white">
            Пример страницы команды
          </Link>
          <Link
            href="/admin/sharky"
            className="rounded-full border border-zinc-200 px-4 py-2 text-zinc-700"
          >
            Редактор (демо)
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
          Не приложение — обычный сайт
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
          Конструктор{" "}
          <span className="bg-gradient-to-r from-sky-600 to-orange-500 bg-clip-text text-transparent">
            одной веб-страницы
          </span>{" "}
          для команды: как микро-Тильда, но под спорт и детские клубы.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
          Тренер сам включает блоки, меняет цвета и текст — родители и ученики открывают{" "}
          <strong>одну ссылку в браузере</strong>. Ничего не ставят из магазинов приложений: это
          привычная веб-страница с расписанием, новостями, автобусом, результатами и контактами.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            {
              t: "Свой адрес",
              d: "Например: ваш-сайт.ru/sharky — логотип, цвета и блоки только вашей команды.",
            },
            {
              t: "Конструктор блоков",
              d: "Включить / выключить / перетащить блоки — без кода, за несколько минут.",
            },
            {
              t: "Для родителей и детей",
              d: "Крупные кнопки, понятные карточки, всё читается с телефона в Safari или Chrome.",
            },
          ].map((x) => (
            <div
              key={x.t}
              className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-xl shadow-sky-100/50"
            >
              <h2 className="font-bold text-zinc-900">{x.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{x.d}</p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-center text-sm text-zinc-500">
          Технически: Next.js + Tailwind + позже Supabase для сохранения страниц команд в облаке.
        </p>
      </main>
    </div>
  );
}
