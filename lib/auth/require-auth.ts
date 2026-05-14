import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAuth() {
  let supabase: Awaited<ReturnType<typeof createServerSupabase>>;
  try {
    supabase = await createServerSupabase();
  } catch {
    redirect("/admin/login?error=config");
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return { supabase, user };
}
