import { cn } from "@/lib/utils/cn";

type Props = {
  emoji?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function PremiumEmptyState({ emoji = "✨", title, description, action, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200/80 bg-zinc-50/50 px-8 py-14 text-center",
        className,
      )}
    >
      <span className="text-4xl" aria-hidden>
        {emoji}
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-zinc-900">{title}</h3>
      <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-zinc-500">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
