import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAuth() {
  if (!getSupabaseUrl() || !getSupabaseAnonKey()) {
    redirect("/admin/login?error=config");
  }

  let supabase: Awaited<ReturnType<typeof createServerSupabase>>;
  try {
    supabase = await createServerSupabase();
  } catch {
    redirect("/admin/login");
  }

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    redirect("/admin/login");
  }
  const user = data?.user ?? null;
  if (!user) redirect("/admin/login");
  return { supabase, user };
}
