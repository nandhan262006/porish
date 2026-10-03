"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const INSTAGRAM = "https://www.instagram.com/phorish_shoots/";

const LEFT_LINKS = [
  { href: "/weddings", label: "Weddings" },
  { href: "/pre-wedding", label: "Pre-Wedding" },
  { href: "/new-born", label: "New Born" },
];

const RIGHT_LINKS = [
  { href: "/toddlers", label: "Toddlers" },
  { href: "/modeling", label: "Modeling" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/client-area", label: "Client Area" },
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
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled || open
          ? "border-black/10 bg-[#f6f1ea]/95 backdrop-blur-md"
          : "border-transparent bg-[#f6f1ea]"
      }`}
    >
      {/* 1fr auto 1fr keeps the wordmark dead centre no matter how the two
          link clusters are sized — auto-placement alone would not */}
      <div className="mx-auto grid h-[72px] max-w-[1360px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 md:px-10">
        <nav className="hidden items-center gap-6 whitespace-nowrap lg:flex">
          {LEFT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="col-start-2 justify-self-center"
        >
          <Image
            src="/logo.png"
            alt="Phorish Shoots"
            width={120}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <div className="col-start-3 flex items-center justify-end gap-6">
          <nav className="hidden items-center gap-6 whitespace-nowrap lg:flex">
            {RIGHT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
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
            <span className={`h-px w-6 bg-[#1a1410] transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`h-px w-6 bg-[#1a1410] transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-px w-6 bg-[#1a1410] transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto bg-[#f6f1ea] px-7 py-8 lg:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav className="flex flex-col">
          {ALL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`border-b border-black/10 py-4 text-[13px] tracking-[0.28em] uppercase ${
                pathname === link.href ? "text-terracotta" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block text-[13px] tracking-[0.28em] uppercase"
        >
          Book on Instagram ↗
        </a>
      </div>
    </header>
  );
}