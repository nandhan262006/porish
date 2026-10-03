import Link from "next/link";

export default function GalleryCTA() {
  return (
    <section className="px-5 pb-20 md:px-10 md:pb-28">
      <div className="mx-auto grid max-w-[1360px] items-end gap-8 border-t border-black/10 pt-12 md:grid-cols-12">
        <h2 className="serif-display text-4xl leading-[0.95] md:col-span-7 md:text-6xl">
          We keep the moments
          <br />
          that were never staged.
        </h2>
        <div className="md:col-span-4 md:col-start-9">
          <p className="text-sm leading-7 text-muted">
            From the ceremony to the quiet edges of the day. Based in
            Kanteshwar, Nizamabad — available across India.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            <a
              href="https://www.instagram.com/phorish_shoots/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 border-b border-[#1a1410] pb-1 text-[11px] tracking-[0.24em] uppercase"
            >
              Write to us
              <span aria-hidden>↗</span>
            </a>
            <Link href="/contact" className="nav-link">
              Contact & directions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
