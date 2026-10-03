import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Botanical from "@/components/Botanical";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About — Phorish Shoots",
  description:
    "Harish Pipari & Dhanyasri Pipari — documentary wedding photographers based in India. 100+ weddings covered since 2020.",
};

const COVERS = ["Weddings", "Pre-Weddings", "New Born", "Modeling", "Editorials"];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-[1360px] px-5 md:px-10">
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
                src="/ABOUT.png"
                alt="Harish Pipari and Dhanyasri Pipari"
                fill
                priority
                sizes="(min-width: 768px) 440px, 90vw"
                className="object-cover"
              />
            </figure>
          </Reveal>

          <div className="relative md:col-span-6 md:col-start-7">
            <Botanical className="absolute -top-10 right-0 hidden h-32 lg:block" />
            <Reveal delay={120}>
              <p className="script-note text-xl md:text-2xl">
                meet the photographers
              </p>
              <h2 className="serif-display mt-4 text-4xl leading-[1.08] md:text-5xl">
                Harish Pipari
                <br />
                <span className="italic">&</span> Dhanyasri Pipari
              </h2>
              <div className="thin-rule mt-7 mb-7 w-16" />
              <div className="max-w-md space-y-5 text-[0.9375rem] leading-7 text-muted">
                <p>
                  There are many important things at a wedding, and we believe
                  photography is among them. Whatever is captured on the
                  wedding day becomes something to cherish for a lifetime.
                </p>
                <p>
                  Since 2020, we have been creating distinct and unique stories
                  and have covered 100+ weddings across India.
                </p>
                <p>
                  Rather than forced poses, we let moments unfold naturally and
                  focus on emotion, relationships, light and genuine
                  connection.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
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
            let&rsquo;s tell your story
          </p>
          <h2 className="serif-display mt-3 text-3xl md:text-4xl">
            Planning a celebration?
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
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
            <Link href="/client-area" className="nav-link">
              Client area
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
