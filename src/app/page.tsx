import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Botanical from "@/components/Botanical";
import PostRail from "@/components/PostRail";
import manifest from "@/../data/instagram.json";

const FACTS = ["Based in India", "Weddings", "Pre-Weddings", "New Born", "Modeling"];

export default function Home() {
  return (
    <>
      <main className="mx-auto w-full max-w-[1360px] px-6 md:px-10">
        {/* ---------------- HERO ---------------- */}
        <section className="relative pt-16 pb-8 md:pt-24">
          <Link href="/about" className="sr-only">
            About Phorish Shoots
          </Link>

          {/* subtle stationery botanicals */}
          <Botanical className="absolute -left-2 top-40 hidden h-40 lg:block" />
          <Botanical className="absolute -right-2 top-64 hidden h-44 lg:block" flip />

          <Reveal className="text-center">
            <h1 className="serif-display text-5xl md:text-7xl tracking-[0.02em] uppercase">
              Phorish Shoots
            </h1>
            <p className="eyebrow mt-5 md:mt-6">
              Capturing Life&rsquo;s Stories
            </p>
            <p className="script-note text-xl md:text-2xl mt-4">
              &ldquo;Real people, real emotions, timeless memories.&rdquo;
            </p>
          </Reveal>

          {/* horizontal story rail — scroll / swipe / drag through real work */}
          <Reveal delay={120} className="mt-12 md:mt-16">
            <PostRail posts={manifest} />
          </Reveal>

          {/* fact strip */}
          <Reveal delay={120}>
            <div className="mt-16 md:mt-24 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
              {FACTS.map((f, i) => (
                <span key={f} className="flex items-center gap-3">
                  {i > 0 && <span className="text-line select-none">|</span>}
                  <span className="eyebrow text-foreground/80">{f}</span>
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={180}>
            <p className="eyebrow text-center mt-8 tracking-[0.3em]">
              Documentary&nbsp;|&nbsp;Candid&nbsp;|&nbsp;Editorial&nbsp;|&nbsp;Filmy
            </p>
          </Reveal>

          <Reveal delay={220}>
            <p className="mx-auto mt-8 max-w-xl text-center text-[0.9375rem] leading-7 text-muted">
              We capture the real, unscripted moments that truly matter. From the
              big celebrations to the smallest details, our aim is to create
              timeless memories that you can cherish forever.
            </p>
          </Reveal>
        </section>

        {/* ---------------- ABOUT INTRO ---------------- */}
        <section className="relative py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-12 md:gap-8 items-center">
            {/* portrait */}
            <Reveal className="md:col-span-5">
              <figure className="photo relative aspect-[4/5] max-w-[520px] mx-auto">
                <Image
                  src="/about.png"
                  alt="Harish Pipari and Dhanyasri Pipari"
                  fill
                  sizes="(min-width: 768px) 440px, 90vw"
                  className="object-cover"
                />
              </figure>
            </Reveal>

            {/* story */}
            <div className="md:col-span-6 md:col-start-7 relative">
              <Botanical className="absolute -top-10 right-0 h-32 hidden lg:block" />
              <Reveal delay={120}>
                <p className="script-note text-xl md:text-2xl">
                  meet the photographers
                </p>
                <h2 className="serif-display mt-4 text-4xl md:text-5xl leading-[1.08]">
                  Harish Pipari
                  <br />
                  <span className="italic">&</span> Dhanyasri Pipari
                </h2>
                <div className="thin-rule w-16 mt-7 mb-7" />
                <div className="space-y-5 text-[0.9375rem] leading-7 text-muted max-w-md">
                  <p>
                    There are many important things at a wedding, and we believe
                    photography is among them. Whatever is captured on the
                    wedding day becomes something to cherish for a lifetime.
                  </p>
                  <p>
                    Since 2020, we have been creating distinct and unique
                    stories and have covered 100+ weddings across India.
                  </p>
                  <p>
                    Rather than forced poses, we let moments unfold naturally
                    and focus on emotion, relationships, light and genuine
                    connection.
                  </p>
                </div>
                <Link
                  href="/about"
                  className="group mt-9 inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.22em]"
                >
                  <span className="border-b border-foreground/30 pb-1 transition-colors group-hover:border-foreground">
                    About Us
                  </span>
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

    </>
  );
}
