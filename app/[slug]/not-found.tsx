import Link from "next/link";

export default function TeamNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 px-6 text-center">
      <h1 className="text-2xl font-bold text-zinc-900">Такой страницы команды нет</h1>
      <p className="max-w-md text-zinc-600">
        Проверьте ссылку или попросите тренера прислать актуальный адрес страницы.
      </p>
      <Link href="/" className="rounded-full bg-zinc-900 px-6 py-3 font-semibold text-white">
        На главную MyTeamSpace
      </Link>
    </div>
  );
}
