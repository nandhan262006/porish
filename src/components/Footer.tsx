import Image from "next/image";
import Link from "next/link";

const WORK = [
  { href: "/weddings", label: "Weddings" },
  { href: "/pre-wedding", label: "Pre-Wedding" },
  { href: "/new-born", label: "New Born" },
  { href: "/toddlers", label: "Toddlers" },
  { href: "/modeling", label: "Modeling" },
];

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#1a1410] px-6 py-16 text-[#f6f1ea] md:px-10">
      <div className="mx-auto grid max-w-[1360px] gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link href="/" aria-label="Phorish Shoots — home">
            <Image
              src="/logo.png"
              alt="Phorish Shoots"
              width={2172}
              height={724}
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/60">
            Documentary wedding photography from Nizamabad. Real moments,
            held for the people who were there.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow text-[#d7a08c]">Work</p>
          <div className="mt-5 flex flex-col gap-3 text-sm text-white/75">
            {WORK.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:col-span-4">
          <p className="eyebrow text-[#d7a08c]">Studio</p>
          <div className="mt-5 space-y-2 text-sm leading-7 text-white/75">
            <p>
              Laxmi Priya Nagar, Mubaraknagar,
              <br />
              Nizamabad, Telangana 503003
            </p>
            <p className="text-white/50">Open daily · Closes 8:30 PM</p>
            <p className="text-white/60">★ 4.9 · 85 Google reviews</p>
            <a href="mailto:phorishshoots@gmail.com" className="block hover:text-white">
              phorishshoots@gmail.com
            </a>
            <a href="tel:+918500362643" className="block hover:text-white">
              +91 85003 62643
            </a>
            <a
              href="https://www.instagram.com/phorish_shoots/"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block tracking-[0.18em] uppercase text-[11px] text-white"
            >
              Instagram ↗
            </a>
            <span className="mt-1 flex gap-5 text-[11px] tracking-[0.18em] uppercase">
              <Link href="/contact" className="text-white hover:text-white">
                Contact
              </Link>
              <a
                href="https://maps.app.goo.gl/BLWq2ZWdHid7ptkXA"
                target="_blank"
                rel="noreferrer"
                className="text-white/70 hover:text-white"
              >
                Directions ↗
              </a>
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1360px] flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Phorish Shoots</p>
        <p>Since 2020 · 100+ weddings</p>
      </div>
    </footer>
  );
}
