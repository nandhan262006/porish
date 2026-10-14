import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Botanical from "@/components/Botanical";
import Reveal from "@/components/Reveal";

import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { getSettings } from "@/lib/content";
import { mediaUrl } from "@/lib/media";

export const metadata: Metadata = {
  title: "About — Wedding Photographers in Nizamabad",
  description:
    "Meet Harish Pippari & Dhanyasri Pippari of Phorish Shoots — siblings, documentary wedding photographers in Nizamabad since 2020. From a ₹20,000 Canon 200D to 100+ weddings, AVASA Hyderabad & Photo Parivaar awards.",
  keywords: [
    "Harish Pippari photographer",
    "Dhanyasri Pippari",
    "wedding photographer Nizamabad",
    "documentary wedding photographer India",
    "Phorish Shoots story",
  ],
  alternates: { canonical: "/about-us" },
  openGraph: {
    type: "profile",
    url: `${SITE_URL}/about-us`,
    title: "About Phorish Shoots — Wedding Photographers in Nizamabad",
    description:
      "Two engineers turned storytellers. 100+ weddings across India since 2020 — candid, documentary & cinematic.",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Harish Pippari and Dhanyasri Pippari — Phorish Shoots" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Phorish Shoots — Wedding Photographers in Nizamabad",
    description:
      "Documentary wedding photographers. 100+ weddings across India since 2020.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const COVERS = ["Weddings", "Pre-Weddings", "New Born", "Modeling", "Editorials"];

const TIMELINE = [
  {
    year: "2015 — 2018",
    title: "Two engineers. One unexpected journey.",
    copy: "Harish (EEE, 2015) and Dhanyasri (EEE, 2018) spent years preparing for government engineer recruitments. Close calls, no offer. What felt like disappointment became the push toward a purpose we hadn't planned: photography and filmmaking.",
  },
  {
    year: "2018",
    title: "A dream that started with ₹20,000",
    copy: "A Canon 200D on EMI with ₹20,000 down, rented at ~₹500/day for side income. Within three months it paid for a second camera. That first camera became the foundation of our future.",
  },
  {
    year: "2020",
    title: "When a pause created passion",
    copy: "COVID stalled everything except our rental cameras. So we asked: why only rent — why not learn to shoot? Nature frames, outdoor portraits, shoots with friends. Settings, light, composition, editing — every frame taught us something.",
  },
  {
    year: "2020 — 2022",
    title: "From experiments to cinema",
    copy: "On the Canon 90D we shot short films, rap songs and indie projects — Harish drawn to cinematography and movement, Dhanyasri to candid moments and post-production. Work with YouTube team Dhoom Jabardasth, then birthdays, pre-weddings, and a five-star wedding at AVASA, Hyderabad that proved we could do this professionally.",
  },
  {
    year: "The turning point",
    title: "A father's belief",
    copy: "Our father, P. Satyanarayana, saw the dedication and backed it with ~₹5 lakh for a professional Sony A7R III setup. More than gear, he gave us confidence. That belief turned passion into profession — PHORISH SHOOTS, established 2020.",
  },
];

export default async function AboutPage() {
  const settings = await getSettings();
  const aboutImage = mediaUrl(settings.about_image ?? "/ABOUT.png");
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    mainEntity: {
      "@type": "Photographer",
      name: "Phorish Shoots — Harish Pippari & Dhanyasri Pippari",
      url: `${SITE_URL}/about-us`,
      image: DEFAULT_OG_IMAGE,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nizamabad",
        addressRegion: "Telangana",
        addressCountry: "IN",
      },
    },
  };
  return (
    <main className="mx-auto w-full max-w-[1360px] px-5 md:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <nav aria-label="Breadcrumb" className="pt-6">
        <ol className="flex items-center justify-center gap-2 text-[11px] tracking-[0.18em] uppercase text-muted">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li aria-hidden className="text-foreground/30">
            /
          </li>
          <li aria-current="page" className="text-foreground">
            About
          </li>
        </ol>
      </nav>
      <section className="pt-16 text-center md:pt-24">
        <Reveal>
          <p className="eyebrow">About</p>
          <h1 className="serif-display mt-4 text-5xl tracking-[0.02em] uppercase md:text-7xl">
            Phorish Shoots
          </h1>
          <p className="script-note mt-4 text-xl md:text-2xl">
            Real people, real emotions, timeless memories.
          </p>
        </Reveal>
      </section>

      <section className="relative py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-5">
            <figure className="photo relative mx-auto aspect-[4/5] max-w-[520px]">
              <Image
                src={aboutImage}
                alt="Harish Pippari and Dhanyasri Pippari — documentary wedding photographers in Nizamabad, Telangana"
                fill
                priority
                sizes="(min-width: 768px) 440px, 90vw"
                className="object-cover"
              />
              <figcaption className="sr-only">
                Harish Pippari and Dhanyasri Pippari, founders of Phorish Shoots
              </figcaption>
            </figure>
          </Reveal>

          <div className="relative md:col-span-6 md:col-start-7">
            <Botanical className="absolute -top-10 right-0 hidden h-32 lg:block" />
            <Reveal delay={120}>
              <p className="script-note text-xl md:text-2xl">
                meet the photographers
              </p>
              <h2 className="serif-display mt-4 text-4xl leading-[1.08] md:text-5xl">
                Harish Pippari
                <br />
                <span className="italic">&</span> Dhanyasri Pippari
              </h2>
              <div className="thin-rule mt-7 mb-7 w-16" />
              <div className="max-w-md space-y-5 text-[0.9375rem] leading-7 text-muted">
                <p>
                  Siblings, not just partners. Harish films — cinematography,
                  movement, visual storytelling. Dhanyasri photographs —
                  candid moments, composition, editing and post-production.
                </p>
                <p>
                  What began in 2018 with a single Canon 200D is now PHORISH
                  SHOOTS, established 2020. Since then: 100+ weddings across
                  India, from birthdays and pre-weddings to a five-star
                  wedding at AVASA, Hyderabad.
                </p>
                <p>
                  Capturing your moments, creating your memories — that is
                  the whole job.
                </p>
              </div>
              <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-black/10 pt-6">
                {[
                  ["2020", "Studio opened"],
                  ["100+", "Weddings covered"],
                  ["4.9★", "85 Google reviews"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="serif-display text-3xl">{value}</dt>
                    <dd className="mt-2 text-[11px] tracking-[0.14em] uppercase text-muted">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- OUR STORY ---------------- */}
      <section aria-labelledby="story-heading" className="py-12 md:py-16">
        <Reveal className="text-center">
          <p className="eyebrow">Our story</p>
          <h2 id="story-heading" className="serif-display mx-auto mt-4 max-w-2xl text-4xl leading-[1.08] md:text-5xl">
            From a small beginning to a bigger dream
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-7 text-muted">
            Every great journey begins with a dream, a little courage, and the
            determination to turn possibilities into reality.
          </p>
          <div className="thin-rule mx-auto mt-8 w-16" />
        </Reveal>

        <ol className="mx-auto mt-12 grid max-w-3xl gap-0 md:mt-16">
          {TIMELINE.map((step, i) => (
            <li
              key={step.title}
              className="border-t border-black/10 py-10 text-center last:border-b"
            >
              <Reveal delay={Math.min(i, 4) * 60}>
                <p className="eyebrow text-terracotta">{step.year}</p>
                <h3 className="serif-display mx-auto mt-3 max-w-xl text-2xl leading-snug md:text-3xl">
                  {step.title}
                </h3>
                <p className="mx-auto mt-3 max-w-2xl text-[0.9375rem] leading-7 text-muted">
                  {step.copy}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- RECOGNITION ---------------- */}
      <section aria-labelledby="awards-heading" className="py-12 md:py-16">
        <Reveal className="mx-auto max-w-3xl rounded-3xl bg-[#1a1410] px-6 py-10 text-center text-[#f6f1ea] md:px-12 md:py-14">
          <p className="text-[11px] font-medium tracking-[0.28em] uppercase text-[#f3c7b6]">
            Recognition
          </p>
          <h2 id="awards-heading" className="serif-display mt-4 text-3xl md:text-4xl">
            Photo Parivaar India honours
          </h2>
          <div className="mx-auto mt-8 grid gap-6 text-left sm:grid-cols-2">
            <div className="rounded-2xl border border-white/15 p-6">
              <p aria-hidden className="text-2xl">🏆</p>
              <p className="mt-3 text-lg font-medium">P. Harish</p>
              <p className="mt-1 text-sm leading-6 text-white/70">
                Best Cinematography Filmmaker
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 p-6">
              <p aria-hidden className="text-2xl">🏆</p>
              <p className="mt-3 text-lg font-medium">P. Dhanyasri</p>
              <p className="mt-1 text-sm leading-6 text-white/70">
                Best Woman Photographer of the Year
              </p>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-white/60">
            More than trophies — years of learning, experimenting, and the
            trust of every couple and family who let us in. Recognition
            inspires us. Your trust motivates us.
          </p>
        </Reveal>
      </section>

      {/* ---------------- PHILOSOPHY ---------------- */}
      <section aria-labelledby="philosophy-heading" className="py-12 text-center md:py-16">
        <Reveal>
          <p className="eyebrow">Our philosophy</p>
          <h2 id="philosophy-heading" className="serif-display mx-auto mt-4 max-w-2xl text-4xl leading-[1.08] md:text-5xl">
            Real emotions. Authentic stories. Timeless memories.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[0.9375rem] leading-7 text-muted">
            A parent&apos;s smile. A bride&apos;s joyful tears. A
            groom&apos;s excitement. A child&apos;s innocent laughter. The most
            meaningful memories live in spontaneous moments, genuine
            connections, and little details — not forced poses.
          </p>
          <p className="serif-display mx-auto mt-8 max-w-2xl text-2xl leading-snug italic md:text-3xl">
            “The best photographs don&apos;t just show how a moment looked.
            They remind you how it felt.”
          </p>
          <div className="thin-rule mx-auto mt-8 w-16" />
        </Reveal>
      </section>

      {/* ---------------- HOW WE WORK ---------------- */}
      <section className="py-12 md:py-16">
        <Reveal className="text-center">
          <p className="eyebrow">How we work</p>
          <p className="serif-display mx-auto mt-5 max-w-2xl text-2xl leading-snug md:text-3xl">
            Documentary when it matters most, candid between the moments,
            editorial when the light asks for it, and filmy when the story
            wants cinema.
          </p>
          <div className="thin-rule mx-auto mt-8 w-16" />
        </Reveal>

        <Reveal
          delay={120}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-3"
        >
          {COVERS.map((f, i) => (
            <span key={f} className="flex items-center gap-3">
              {i > 0 && <span className="text-line select-none">|</span>}
              <span className="eyebrow text-foreground/80">{f}</span>
            </span>
          ))}
        </Reveal>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="py-14 text-center md:py-20">
        <Reveal>
          <Botanical className="mx-auto mb-6 h-24" />
          <p className="script-note text-xl md:text-2xl">
            let us freeze your memories
          </p>
          <h2 className="serif-display mt-3 text-3xl md:text-4xl">
            Your moments. Our passion. Memories forever.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-7 text-muted">
            Dream wedding, family milestone, once-in-a-lifetime occasion —
            we&apos;d love to be part of your story. Let&apos;s create
            something unforgettable together.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/contact-us"
              className="inline-flex h-12 items-center bg-foreground px-7 text-[11px] tracking-[0.22em] uppercase text-background transition-colors hover:bg-terracotta"
            >
              Let us tell your story
            </Link>
            <a
              href="https://www.instagram.com/phorish_shoots/"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-[0.6875rem] tracking-[0.22em] uppercase"
            >
              <span className="border-b border-foreground/30 pb-1 transition-colors group-hover:border-foreground">
                Message us on Instagram
              </span>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                ↗
              </span>
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
