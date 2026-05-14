import { requireAuth } from "@/lib/auth/require-auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  return <>{children}</>;
}
