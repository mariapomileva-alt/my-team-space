import Link from "next/link";

export function DashboardEditLink({
  teamId,
  disabled,
  label = "Edit",
  size = "sm",
}: {
  teamId: string;
  disabled: boolean;
  label?: string;
  size?: "sm" | "md";
}) {
  const sizeClass =
    size === "md" ? "rounded-full px-4 py-2 text-xs font-bold" : "rounded-full px-3 py-1.5 text-xs font-semibold";
  const enabledClass = "bg-zinc-900 text-white";
  const disabledClass = "pointer-events-none cursor-not-allowed bg-zinc-200 text-zinc-500";

  if (disabled) {
    return <span className={`${sizeClass} ${disabledClass}`}>{label}</span>;
  }

  return (
    <Link href={`/admin/team/${teamId}/step-2`} className={`${sizeClass} ${enabledClass}`}>
      {label}
    </Link>
  );
}
