type Props = {
  title: string;
  subtitle?: string;
  centered?: boolean;
};

export function PageHero({ title, subtitle, centered = true }: Props) {
  return (
    <section className="border-b border-black/[0.04] bg-gradient-to-b from-white/80 to-transparent px-6 py-16 sm:px-8 sm:py-20">
      <div className={`mx-auto max-w-3xl ${centered ? "text-center" : ""}`}>
        <h1 className="font-[family-name:var(--font-brand)] text-3xl font-bold tracking-tight text-[#1A1C23] sm:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 text-lg leading-relaxed text-neutral-500">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}
