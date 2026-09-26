"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const LEFT = [
  { label: "Home", href: "/" },
  { label: "Weddings", href: "/weddings" },
  { label: "Pre-Wedding", href: "/pre-wedding" },
  { label: "Toddlers", href: "/toddlers" },
];
const RIGHT = [
  { label: "New Born", href: "/new-born" },
  { label: "Modeling", href: "/modeling" },
  { label: "About", href: "/about" },
  { label: "Client Area", href: "/client-area" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-[2px]">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1360px] items-center justify-between gap-6 px-6 pt-5 pb-4 md:px-10"
      >
        {/* left nav */}
        <ul className="hidden md:flex items-center gap-5 lg:gap-7">
          {LEFT.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="nav-link whitespace-nowrap">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* mobile hamburger */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex w-9 h-9 flex-col items-center justify-center gap-[5px]"
          aria-label="Menu"
        >
          <span
            className={`block h-px w-5 bg-foreground transition-transform duration-300 ${open ? "translate-y-[3px] rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-5 bg-foreground transition-transform duration-300 ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
          />
        </button>

        {/* centered logo — untouched proportions */}
        <Link href="/" className="shrink-0" aria-label="Phorish Shoots home">
          <Image
            src="/logo.png"
            alt="Phorish Shoots"
            width={144}
            height={48}
            priority
            className="h-10 w-auto md:h-12"
          />
        </Link>

        {/* right nav */}
        <ul className="hidden md:flex items-center gap-5 lg:gap-7">
          {RIGHT.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="nav-link whitespace-nowrap">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* spacer so logo stays truly centered on mobile */}
        <span className="md:hidden w-9" aria-hidden />
      </nav>

      {/* mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed inset-0 top-[89px] bg-background transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <ul className="flex flex-col items-center gap-8 pt-16">
          {[...LEFT, ...RIGHT].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="nav-link text-[0.8125rem]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="thin-rule mx-6 md:mx-10" />
    </header>
  );
}
