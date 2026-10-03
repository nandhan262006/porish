import Botanical from "@/components/Botanical";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

const MAPS_URL = "https://maps.app.goo.gl/BLWq2ZWdHid7ptkXA";
const ADDRESS =
  "No. 04, Laxmi Priya Nagar, Janapriya Nagar Road, Mubaraknagar, Nizamabad, Telangana 503003";

export default function ContactSection() {
  return (
    <>
      <section id="contact" className="grid scroll-mt-20 gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Reveal>
            <h2 className="serif-display text-3xl md:text-4xl">Book a date</h2>
            <p className="mt-3 max-w-md text-[0.9375rem] leading-7 text-muted">
              Tell us about your celebration — it lands straight on our
              WhatsApp and we reply with availability and packages.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <Reveal delay={120}>
            <h2 className="serif-display text-3xl md:text-4xl">Find us</h2>
            <address className="mt-4 max-w-md text-[0.9375rem] leading-7 text-muted not-italic">
              {ADDRESS}
            </address>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 text-[0.6875rem] tracking-[0.22em] uppercase"
              >
                <span className="border-b border-foreground/30 pb-1 transition-colors group-hover:border-foreground">
                  Get directions
                </span>
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </a>
              <a href="tel:+918500362643" className="nav-link">
                085003 62643
              </a>
            </div>

            <dl className="mt-8 grid max-w-md grid-cols-1 gap-0 border-t border-black/10">
              {[
                ["Hours", "Open daily · Closes 8:30 PM"],
                ["Phone", "085003 62643"],
                ["Email", "phorishshoots@gmail.com"],
                ["Instagram", "@phorish_shoots"],
              ].map(([term, value]) => (
                <div
                  key={term}
                  className="flex items-baseline justify-between gap-6 border-b border-black/10 py-3"
                >
                  <dt className="text-[11px] tracking-[0.22em] uppercase text-muted">
                    {term}
                  </dt>
                  <dd className="text-right text-sm text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <Reveal>
          <div className="photo relative aspect-[16/10] w-full sm:aspect-[21/9]">
            <iframe
              title="Phorish Shoots on Google Maps — Mubaraknagar, Nizamabad"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1889.5757156701586!2d78.12175655652399!3d18.70203733617567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcdc5b200d05215%3A0x9a725d99b4f6f953!2sPhorish%20Shoots!5e0!3m2!1sen!2sus!4v1791015240306!5m2!1sen!2sus"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <a
              href="https://www.instagram.com/phorish_shoots/"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-[0.6875rem] tracking-[0.22em] uppercase"
            >
              <span className="border-b border-foreground/30 pb-1 transition-colors group-hover:border-foreground">
                Message us on Instagram
              </span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </a>
            <Botanical className="h-16 text-foreground/40" />
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="nav-link"
            >
              Review us on Google
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
