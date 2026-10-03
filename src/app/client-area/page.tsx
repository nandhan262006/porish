import Link from "next/link";
import type { Metadata } from "next";
import Botanical from "@/components/Botanical";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Client Area — Phorish Shoots",
  description:
    "Private galleries for Phorish Shoots clients — shared only with you and the people you choose.",
};

export default function ClientAreaPage() {
  return (
    <main className="mx-auto w-full max-w-[1360px] px-5 md:px-10">
      <section className="pt-16 text-center md:pt-24">
        <Reveal>
          <p className="eyebrow">Client Area</p>
          <h1 className="serif-display mt-4 text-5xl tracking-[0.02em] uppercase md:text-7xl">
            Your private galleries
          </h1>
          <p className="script-note mt-4 text-xl md:text-2xl">
            for our couples &amp; families
          </p>
        </Reveal>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-xl text-center">
          <Reveal>
            <div className="thin-rule mx-auto mb-10 w-16" />
            <div className="space-y-5 text-[0.9375rem] leading-7 text-muted">
              <p>
                Every shoot is delivered through a private gallery — shared
                only with you, so your moments stay yours until you&rsquo;re
                ready to share them.
              </p>
              <p>
                Your personal link arrives by message once editing is
                complete. Open it on any device and revisit every frame
                whenever you like.
              </p>
              <p>
                Haven&rsquo;t received it, or need a link re-sent? Reach out on
                Instagram with your name and shoot date and we&rsquo;ll get it
                back to you.
              </p>
            </div>
          </Reveal>

          <Reveal delay={140} className="mt-10">
            <a
              href="https://www.instagram.com/phorish_shoots/"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-[0.6875rem] tracking-[0.22em] uppercase"
            >
              <span className="border-b border-foreground/30 pb-1 transition-colors group-hover:border-foreground">
                Request your gallery
              </span>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                ↗
              </span>
            </a>
          </Reveal>

          <Reveal delay={200} className="mt-8">
            <Link href="/about" className="nav-link">
              About the studio
            </Link>
          </Reveal>
        </div>

        <Botanical className="mt-16 ml-auto hidden h-36 lg:block" flip />
      </section>
    </main>
  );
}
