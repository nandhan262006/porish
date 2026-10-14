import Reveal from "@/components/Reveal";
import { SITE_URL } from "@/lib/seo";
import { getFaqs, type FaqVM } from "@/lib/content";

export type FaqItem = { q: string; a: string };

export default async function Faq({
  items: itemsProp,
  heading = "Questions, answered",
  eyebrow = "FAQ",
}: {
  items?: FaqItem[];
  heading?: string;
  eyebrow?: string;
}) {
  const items: FaqVM[] = itemsProp
    ? itemsProp.map((i, n) => ({ id: n, ...i }))
    : await getFaqs();
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <section aria-labelledby="faq-heading" className="px-5 py-16 md:px-10 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto grid w-full max-w-[1360px] gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id="faq-heading" className="serif-display mt-4 text-4xl leading-[1.02] md:text-5xl">
              {heading}
            </h2>
            <p className="mt-4 max-w-sm text-[0.9375rem] leading-7 text-muted">
              Everything couples and families usually ask before booking. Still
              unsure?{" "}
              <a href={`${SITE_URL}/contact-us`} className="underline underline-offset-4">
                Contact the studio
              </a>{" "}
              — we reply fast.
            </p>
          </Reveal>
        </div>
        <div className="md:col-span-8">
          {items.map((item, i) => (
            <Reveal key={item.q} delay={Math.min(i, 4) * 60}>
              <details
                className="group border-t border-black/10 py-5 last:border-b"
                {...(i === 0 ? { open: true } : {})}
              >
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 text-left text-[1.05rem] leading-7 font-medium tracking-tight">
                  <span>{item.q}</span>
                  <span
                    aria-hidden
                    className="shrink-0 text-terracotta transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[0.9375rem] leading-7 text-muted">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
