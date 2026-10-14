"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HomeVM } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Fanned trio: the middle frame sits front and centre, the sides tuck
// behind it. GSAP owns the wing-open (sides unfold from the centre like
// wings); Tailwind only handles width/overlap so there is no transform fight.
// Layout per slot is fixed; images/labels/hrefs come from the CMS.
const FAN_LAYOUT = [
  {
    card: "z-10 w-[36%] -mr-8 md:-mr-12",
    hook: "fan-left",
    sizes: "(min-width: 1024px) 24vw, 36vw",
    priority: false,
  },
  {
    card: "z-20 w-[40%]",
    hook: "fan-center",
    sizes: "(min-width: 1024px) 26vw, 40vw",
    priority: true,
  },
  {
    card: "z-10 w-[36%] -ml-8 md:-ml-12",
    hook: "fan-right",
    sizes: "(min-width: 1024px) 24vw, 36vw",
    priority: false,
  },
];

export default function HomeHero({ home }: { home: HomeVM }) {
  const scope = useRef<HTMLElement>(null);
  const FAN = home.tiles.slice(0, 3);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          full: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { reduce } = ctx.conditions as {
            reduce: boolean;
          };

          // Fold origin: wings hinge on their inner edge.
          gsap.set(".fan-left", { transformOrigin: "100% 50%" });
          gsap.set(".fan-right", { transformOrigin: "0% 50%" });
          gsap.set(".fan-center", { transformOrigin: "50% 50%" });

          if (reduce) {
            gsap.set(".fan-left", {
              xPercent: 0,
              y: 24,
              rotation: -6,
              rotationY: 0,
              autoAlpha: 1,
            });
            gsap.set(".fan-right", {
              xPercent: 0,
              y: 24,
              rotation: 6,
              rotationY: 0,
              autoAlpha: 1,
            });
            gsap.set(".fan-center", {
              y: 0,
              scale: 1,
              autoAlpha: 1,
            });
            return;
          }

          const tl = gsap.timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: {
              trigger: scope.current,
              start: "top 75%",
              // Every visit replays the wings: restart on enter,
              // fold back when scrolled fully past above.
              toggleActions: "restart none none reverse",
            },
          });

          tl.fromTo(
            ".fan-center",
            { y: 30, scale: 0.94, autoAlpha: 0 },
            { y: 0, scale: 1, autoAlpha: 1, duration: 1.6 },
            0,
          )
            .fromTo(
              ".fan-left",
              {
                xPercent: 55,
                y: 24,
                rotation: 0,
                rotationY: 60,
                autoAlpha: 0,
              },
              {
                xPercent: 0,
                y: 24,
                rotation: -6,
                rotationY: 0,
                autoAlpha: 1,
                duration: 2.2,
              },
              0.15,
            )
            .fromTo(
              ".fan-right",
              {
                xPercent: -55,
                y: 24,
                rotation: 0,
                rotationY: -60,
                autoAlpha: 0,
              },
              {
                xPercent: 0,
                y: 24,
                rotation: 6,
                rotationY: 0,
                autoAlpha: 1,
                duration: 2.2,
              },
              0.15,
            );
        },
      );
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      aria-labelledby="home-hero-heading"
      className="overflow-hidden border-b border-black/10 px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto flex max-w-[1360px] flex-col items-center text-center">
        <div
          className="hero-rise flex w-full max-w-2xl flex-col items-center"
          style={{ animationDelay: "0ms" }}
        >
          <p className="eyebrow">{home.heroEyebrow}</p>
          <h1 id="home-hero-heading" className="serif-display mt-5 text-[11vw] sm:text-5xl md:text-6xl">
            {home.heroH1A}
            <span className="block italic">{home.heroH1B}</span>
          </h1>
        </div>

        <p
          className="hero-rise mt-6 max-w-xl text-[1rem] leading-8 text-muted"
          style={{ animationDelay: "120ms" }}
        >
          {home.heroSub}
        </p>

        {/* Full-bleed on phones so the frames stay large enough to read;
            back to a centred column from sm up. */}
        <div className="-mx-5 mt-12 w-[calc(100%+2.5rem)] sm:mx-auto sm:mt-16 sm:w-full sm:max-w-md md:max-w-3xl">
          <div
            className="relative flex w-full items-center justify-center"
            style={{ perspective: "1200px" }}
          >
            {FAN.map((tile, i) => {
              const layout = FAN_LAYOUT[i] ?? FAN_LAYOUT[1];
              return (
              <div
                key={`${tile.href}-${i}`}
                className={`relative shrink-0 ${layout.card} ${layout.hook}`}
              >
                <Link
                  href={tile.href}
                  className="photo group relative block aspect-[4/5] overflow-hidden shadow-[0_24px_45px_rgba(26,20,16,0.25)] transition-transform duration-500 ease-out hover:-translate-y-2"
                >
                  <Image
                    src={tile.file}
                    alt={tile.alt}
                    fill
                    priority={layout.priority}
                    sizes={layout.sizes}
                    className={`object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] ${tile.position}`}
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a1410]/85 to-transparent px-3 pt-10 pb-3">
                    <span className="block text-[10px] tracking-[0.24em] uppercase text-[#f3c7b6]">
                      {tile.label}
                    </span>
                  </span>
                </Link>
              </div>
              );
            })}
          </div>
        </div>

        <div
          className="hero-rise mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:mt-16"
          style={{ animationDelay: "620ms" }}
        >
          <a
            href="#services"
            aria-label="See wedding photography services and galleries"
            className="inline-flex h-12 w-full items-center justify-center bg-foreground px-7 text-[11px] tracking-[0.22em] uppercase text-background transition-colors hover:bg-terracotta sm:w-auto"
          >
            See the work
          </a>
          <Link
            href="/about"
            aria-label="About Phorish Shoots wedding photography studio"
            className="inline-flex h-12 items-center bg-foreground px-7 text-[11px] tracking-[0.22em] uppercase text-background transition-colors hover:bg-terracotta"
          >
            About the studio
          </Link>
        </div>

        <p
          className="hero-rise mt-6 text-[13px] font-medium tracking-[0.08em] text-muted"
          style={{ animationDelay: "680ms" }}
        >
          {home.heroProof}
        </p>
      </div>
    </section>
  );
}
