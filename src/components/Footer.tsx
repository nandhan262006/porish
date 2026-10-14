import Image from "next/image";
import Link from "next/link";

const WORK = [
  { href: "/wedding", label: "Weddings" },
  { href: "/pre-wedding", label: "Pre-Wedding" },
  { href: "/newborn", label: "New Born" },
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
              alt="Phorish Shoots — wedding photographer in Nizamabad"
              width={2172}
              height={724}
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>
          <p className="mt-4 max-w-sm text-[0.9375rem] leading-7 text-white/80">
            Documentary wedding photographer in Nizamabad, Telangana. Real
            moments, held for the people who were there — weddings,
            pre-wedding, newborn & family stories across India.
          </p>
        </div>

        <nav aria-label="Footer — galleries" className="md:col-span-3">
          <h2 className="eyebrow text-[#d7a08c]">Work</h2>
          <div className="mt-5 flex flex-col gap-3 text-[0.9375rem] text-white/85">
            {WORK.map((item) => (
              <Link key={item.href} href={item.href} className="w-fit transition-colors hover:text-white">
                {item.label} photography
              </Link>
            ))}
          </div>
        </nav>

        <div className="md:col-span-4">
          <h2 className="eyebrow text-[#d7a08c]">Studio</h2>
          <address className="mt-5 space-y-2 text-[0.9375rem] leading-7 text-white/85 not-italic">
            <p>
              Laxmi Priya Nagar, Mubaraknagar,
              <br />
              Nizamabad, Telangana 503003
            </p>
            <p className="text-white/70">Open daily · Closes 8:30 PM</p>
            <p className="text-white/80">★ 4.9 · 85 Google reviews</p>
            <a href="mailto:phorishshoots@gmail.com" className="block hover:text-white">
              phorishshoots@gmail.com
            </a>
            <a href="tel:+918500362643" className="block hover:text-white">
              +91 85003 62643
            </a>
            <span className="mt-3 flex gap-5 tracking-[0.18em] uppercase text-[12px] text-white">
              <a
                href="https://www.instagram.com/phorish_shoots/"
                target="_blank"
                rel="noreferrer"
                aria-label="Phorish Shoots on Instagram"
                className="hover:text-white"
              >
                Instagram ↗
              </a>
              <a
                href="https://www.youtube.com/@phorishshoots"
                target="_blank"
                rel="noreferrer"
                aria-label="Phorish Shoots on YouTube"
                className="hover:text-white"
              >
                YouTube ↗
              </a>
            </span>
            <span className="mt-1 flex gap-5 text-[12px] tracking-[0.18em] uppercase">
              <Link href="/contact-us" className="text-white hover:text-white">
                Contact
              </Link>
              <a
                href="https://maps.app.goo.gl/BLWq2ZWdHid7ptkXA"
                target="_blank"
                rel="noreferrer"
                aria-label="Get directions to Phorish Shoots on Google Maps"
                className="text-white/80 hover:text-white"
              >
                Directions ↗
              </a>
            </span>
          </address>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1360px] flex-col gap-2 border-t border-white/10 pt-6 text-[13px] text-white/60 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Phorish Shoots — wedding photographer in Nizamabad</p>
        <p>Since 2020 · 100+ weddings across India</p>
      </div>
    </footer>
  );
}
