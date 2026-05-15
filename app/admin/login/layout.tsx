import { SupabaseConfigInjector } from "@/components/auth/supabase-config-injector";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  return (
    <SupabaseConfigInjector url={url} anonKey={anonKey}>
      {children}
    </SupabaseConfigInjector>
  );
}
