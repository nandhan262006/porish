import Link from "next/link";

export default function GalleryCTA() {
  return (
    <section aria-labelledby="cta-heading" className="px-5 pb-20 md:px-10 md:pb-28">
      <div className="mx-auto grid max-w-[1360px] items-end gap-8 border-t border-black/10 pt-12 md:grid-cols-12">
        <h2 id="cta-heading" className="serif-display text-4xl leading-[1.02] md:col-span-7 md:text-6xl">
          We keep the wedding moments
          <br />
          that were never staged.
        </h2>
        <div className="md:col-span-4 md:col-start-9">
          <p className="text-[1rem] leading-8 text-muted">
            Documentary weddings, pre-weddings, newborn & family stories.
            Based in Kanteshwar, Nizamabad — shooting across Hyderabad,
            Telangana and India.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            <a
              href="https://www.instagram.com/phorish_shoots/"
              target="_blank"
              rel="noreferrer"
              aria-label="Write to Phorish Shoots on Instagram"
              className="inline-flex items-center gap-3 border-b border-[#1a1410] pb-1 text-[11px] tracking-[0.24em] uppercase"
            >
              Write to us
              <span aria-hidden>↗</span>
            </a>
            <Link href="/contact-us" aria-label="Contact Phorish Shoots and get directions" className="nav-link">
              Contact & directions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
