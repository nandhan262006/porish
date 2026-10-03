"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Fanned trio: the middle frame sits front and centre, the sides tuck
// behind it. GSAP owns the wing-open (sides unfold from the centre like
// wings); Tailwind only handles width/overlap so there is no transform fight.
const FAN = [
  {
    href: "/pre-wedding",
    label: "Pre-Wedding",
    file: "/phorish-extract/pre-wedding/01_691eb2_37440b721b684ffda83177d7584d78b6_mv2.jpg",
    alt: "Pre-wedding portrait photographed by Phorish Shoots",
    position: "object-[center_30%]",
    card: "z-10 w-[36%] -mr-8 md:-mr-12",
    hook: "fan-left",
    sizes: "(min-width: 1024px) 24vw, 36vw",
    priority: false,
  },
  {
    href: "/weddings",
    label: "Weddings",
    file: "/phorish-extract/wedding/01_691eb2_e4a1b776ccc84dca9a796d28544e30fc_mv2.jpg",
    alt: "Wedding ceremony photographed by Phorish Shoots",
    position: "object-[center_35%]",
    card: "z-20 w-[40%]",
    hook: "fan-center",
    sizes: "(min-width: 1024px) 26vw, 40vw",
    priority: true,
  },
  {
    href: "/new-born",
    label: "New Born",
    file: "/phorish-extract/newborn/01_691eb2_99b46f051bc54ddf8a8a5510dcd96356_mv2.jpg",
    alt: "Newborn photograph by Phorish Shoots",
    position: "object-[center_40%]",
    card: "z-10 w-[36%] -ml-8 md:-ml-12",
    hook: "fan-right",
    sizes: "(min-width: 1024px) 24vw, 36vw",
    priority: false,
  },
];

export default function HomeHero() {
  const scope = useRef<HTMLElement>(null);

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
      className="overflow-hidden border-b border-black/10 px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto flex max-w-[1360px] flex-col items-center text-center">
        <div
          className="hero-rise flex w-full max-w-2xl flex-col items-center"
          style={{ animationDelay: "0ms" }}
        >
          <p className="eyebrow">Nizamabad · since 2020</p>
          <h1 className="serif-display mt-5 text-[11vw] sm:text-5xl md:text-6xl">
            Real people, real emotions,
            <span className="block italic">timeless memories.</span>
          </h1>
        </div>

        <p
          className="hero-rise mt-6 max-w-xl text-[0.95rem] leading-7 text-muted"
          style={{ animationDelay: "120ms" }}
        >
          Harish &amp; Dhanyasri Pipari have covered 100+ celebrations across
          India — documentary frames from the rituals, the tears and the quiet
          edges of the day.
        </p>

        {/* Full-bleed on phones so the frames stay large enough to read;
            back to a centred column from sm up. */}
        <div className="-mx-5 mt-12 w-[calc(100%+2.5rem)] sm:mx-auto sm:mt-16 sm:w-full sm:max-w-md md:max-w-3xl">
          <div
            className="relative flex w-full items-center justify-center"
            style={{ perspective: "1200px" }}
          >
            {FAN.map((tile) => (
              <div
                key={tile.href}
                className={`relative shrink-0 ${tile.card} ${tile.hook}`}
              >
                <Link
                  href={tile.href}
                  className="photo group relative block aspect-[4/5] overflow-hidden shadow-[0_24px_45px_rgba(26,20,16,0.25)] transition-transform duration-500 ease-out hover:-translate-y-2"
                >
                  <Image
                    src={tile.file}
                    alt={tile.alt}
                    fill
                    priority={tile.priority}
                    sizes={tile.sizes}
                    className={`object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] ${tile.position}`}
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a1410]/85 to-transparent px-3 pt-10 pb-3">
                    <span className="block text-[10px] tracking-[0.24em] uppercase text-[#f3c7b6]">
                      {tile.label}
                    </span>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div
          className="hero-rise mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:mt-16"
          style={{ animationDelay: "620ms" }}
        >
          <a
            href="#services"
            className="inline-flex h-12 w-full items-center justify-center bg-foreground px-7 text-[11px] tracking-[0.22em] uppercase text-background transition-colors hover:bg-terracotta sm:w-auto"
          >
            See the work
          </a>
          <Link
            href="/about"
            className="inline-flex h-12 items-center bg-foreground px-7 text-[11px] tracking-[0.22em] uppercase text-background transition-colors hover:bg-terracotta"
          >
            About the studio
          </Link>
        </div>

        <p
          className="hero-rise mt-6 text-xs font-medium tracking-[0.08em] text-muted"
          style={{ animationDelay: "680ms" }}
        >
          100+ weddings covered · Documentary, candid &amp; editorial
        </p>
      </div>
    </section>
  );
}
