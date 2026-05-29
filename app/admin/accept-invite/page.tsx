import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AcceptInviteButton } from "./accept-invite-button";

type Props = { searchParams: Promise<{ token?: string }> };

export const dynamic = "force-dynamic";

export default async function AcceptAdminInvitePage({ searchParams }: Props) {
  const { token } = await searchParams;
  const trimmed = token?.trim();
  if (!trimmed) {
    redirect("/admin");
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const loginNext = `/admin/accept-invite?token=${encodeURIComponent(trimmed)}`;

  if (!user) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <h1 className="text-2xl font-bold text-zinc-900">Join as page admin</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          Sign in with the email address the coach invited. After login you&apos;ll get full access to edit the team
          page.
        </p>
        <Link
          href={`/admin/login?next=${encodeURIComponent(loginNext)}`}
          className="mt-6 block w-full rounded-full bg-zinc-900 py-2.5 text-center text-sm font-semibold text-white"
        >
          Sign in to accept
        </Link>
        <p className="mt-4 text-center text-xs text-zinc-500">
          New?{" "}
          <Link href={`/admin/signup?next=${encodeURIComponent(loginNext)}`} className="font-semibold text-indigo-700 underline">
            Create account
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold text-zinc-900">You&apos;re invited</h1>
      <p className="mt-3 text-sm text-zinc-600">
        Signed in as <strong>{user.email}</strong>. Accept to open the team editor.
      </p>
      <AcceptInviteButton token={trimmed} />
      <p className="mt-6 text-center text-xs text-zinc-500">
        <Link href="/admin" className="underline">
          Back to your teams
        </Link>
      </p>
    </div>
  );
}
