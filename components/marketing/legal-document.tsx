import { PageHero } from "@/components/marketing/page-hero";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  list?: string[];
};

export function LegalDocument({
  title,
  intro,
  sections,
}: {
  title: string;
  intro?: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero title={title} />
      <article className="mx-auto max-w-3xl px-6 py-14 sm:px-8 sm:py-16">
        {intro ? <p className="mb-10 text-lg leading-relaxed text-neutral-600">{intro}</p> : null}
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-[family-name:var(--font-brand)] text-xl font-semibold text-[#1A1C23]">
                {section.title}
              </h2>
              {section.paragraphs?.map((p) => (
                <p key={p.slice(0, 40)} className="mt-3 text-[15px] leading-relaxed text-neutral-600">
                  {p}
                </p>
              ))}
              {section.list ? (
                <ul className="mt-3 list-inside list-disc space-y-1.5 text-[15px] leading-relaxed text-neutral-600">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
