"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const INSTAGRAM = "https://www.instagram.com/phorish_shoots/";
const YOUTUBE = "https://www.youtube.com/@phorishshoots";
const WHATSAPP =
  "https://wa.me/918500362643?text=Hi%20Phorish%20Shoots!%20I%20want%20to%20enquire%20about%20a%20shoot.";

const LEFT_LINKS = [
  { href: "/wedding", label: "Weddings" },
  { href: "/pre-wedding", label: "Pre-Wedding" },
  { href: "/newborn", label: "New Born" },
];

const RIGHT_LINKS = [
  { href: "/toddlers", label: "Toddlers" },
  { href: "/modeling", label: "Modeling" },
  { href: "/about-us", label: "About" },
  { href: "/contact-us", label: "Contact" },
];

const ALL_LINKS = [
  { href: "/", label: "Home" },
  ...LEFT_LINKS,
  ...RIGHT_LINKS,
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-colors ${
          open
            ? "border-transparent bg-transparent"
            : scrolled
              ? "border-black/10 bg-[#f6f1ea]/95 backdrop-blur-md"
              : "border-transparent bg-[#f6f1ea]"
        }`}
      >
        {/* 1fr auto 1fr keeps the wordmark dead centre no matter how the two
            link clusters are sized — auto-placement alone would not */}
        <div className="mx-auto grid h-[72px] max-w-[1360px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 md:px-10">
          <nav aria-label="Primary — galleries" className="hidden items-center gap-6 whitespace-nowrap lg:flex">
            {LEFT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`nav-link ${pathname === link.href ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label="Phorish Shoots — home"
            className="col-start-2 justify-self-center"
          >
            <Image
              src="/logo.png"
              alt="Phorish Shoots — wedding photographer in Nizamabad"
              width={216}
              height={72}
              priority
              className={`h-[67px] w-auto transition-[filter] duration-500 ${open ? "brightness-0 invert" : ""}`}
            />
          </Link>

          <div className="col-start-3 flex items-center justify-end gap-6">
            <nav aria-label="Primary — studio" className="hidden items-center gap-6 whitespace-nowrap lg:flex">
              {RIGHT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={`nav-link ${pathname === link.href ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              aria-label="Book Phorish Shoots on Instagram"
              className="hidden text-[11px] tracking-[0.22em] uppercase lg:inline"
            >
              Book
            </a>

            <button
              type="button"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-[6px] lg:hidden"
            >
              <span className={`h-px w-6 transition-all duration-300 ${open ? "translate-y-[7px] rotate-45 bg-[#f6f1ea]" : "bg-[#1a1410]"}`} />
              <span className={`h-px w-6 transition-all duration-300 ${open ? "bg-[#f6f1ea] opacity-0" : "bg-[#1a1410]"}`} />
              <span className={`h-px w-6 transition-all duration-300 ${open ? "-translate-y-[7px] -rotate-45 bg-[#f6f1ea]" : "bg-[#1a1410]"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen overlay OUTSIDE the header: the header's backdrop-blur
          creates a containing block for fixed descendants, which used to
          trap this panel inside the 72px bar and render the menu invisible. */}
      <div
        inert={!open}
        className={`fixed inset-0 z-40 flex flex-col bg-[#1a1410] text-[#f6f1ea] transition-[opacity,visibility] duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav
          aria-label="Mobile"
          className="flex flex-1 flex-col justify-center gap-0.5 overflow-y-auto px-7 pt-20 pb-2"
        >
          {ALL_LINKS.map((link, i) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
                className={`group flex items-baseline gap-4 border-b border-white/10 py-2.5 transition-all duration-500 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              >
                <span className="shrink-0 text-[11px] tracking-[0.2em] text-white/35">
                  0{i + 1}
                </span>
                <span
                  className={`serif-display text-4xl leading-none transition-colors ${
                    active ? "text-[#f3c7b6] italic" : "group-hover:text-[#f3c7b6]"
                  }`}
                >
                  {link.label}
                </span>
                <span
                  aria-hidden
                  className={`ml-auto text-terracotta transition-opacity ${active ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}
                >
                  →
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          style={{ transitionDelay: open ? `${120 + ALL_LINKS.length * 55}ms` : "0ms" }}
          className={`px-7 pt-2 pb-10 transition-all duration-500 ${
            open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="flex h-12 items-center justify-center bg-terracotta text-[11px] tracking-[0.22em] uppercase text-background transition-colors hover:bg-[#f3c7b6] hover:text-foreground"
          >
            Book your date
          </a>
          <div className="mt-5 flex items-center justify-between text-[11px] tracking-[0.22em] uppercase">
            <span className="flex items-center gap-5">
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="text-white/70 transition-colors hover:text-white"
              >
                Instagram ↗
              </a>
              <a
                href={YOUTUBE}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="text-white/70 transition-colors hover:text-white"
              >
                YouTube ↗
              </a>
            </span>
            <a href="tel:+918500362643" className="text-white/70 transition-colors hover:text-white">
              +91 85003 62643
            </a>
          </div>
          <p className="mt-3 text-center text-[11px] tracking-[0.14em] text-white/35 uppercase">
            4.9 ★ · 85 Google reviews
          </p>
        </div>
      </div>
    </>
  );
}
