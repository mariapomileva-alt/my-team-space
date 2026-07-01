import Link from "next/link";

export default function TeamNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 px-6 text-center">
      <h1 className="text-2xl font-bold text-zinc-900">Team page not found</h1>
      <p className="max-w-md text-zinc-600">
        There is no team at this URL yet. Ask your coach for the correct link or start from the
        MyTeamSpace home page.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link href="/examples" className="rounded-full bg-zinc-900 px-6 py-3 font-semibold text-white">
          View demo examples
        </Link>
        <Link
          href="/"
          className="rounded-full border border-zinc-200 bg-white px-6 py-3 font-semibold text-zinc-800"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
