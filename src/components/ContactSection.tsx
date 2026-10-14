import Botanical from "@/components/Botanical";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { getSettings } from "@/lib/content";

export default async function ContactSection() {
  const s = await getSettings();
  const MAPS_URL = s.maps_url ?? "";
  const ADDRESS =
    s.address ??
    "No. 04, Laxmi Priya Nagar, Janapriya Nagar Road, Mubaraknagar, Nizamabad, Telangana 503003";
  const phoneDisplay = s.phone_display ?? "+91 85003 62643";
  const phoneLocal = phoneDisplay.replace(/^\+91 ?/, "0");
  const phoneTel = s.phone_tel ?? "+918500362643";
  const email = s.email ?? "phorishshoots@gmail.com";
  const instagram = s.instagram ?? "https://www.instagram.com/phorish_shoots/";
  const handle = instagram.replace(/\/$/, "").split("/").pop() ?? "phorish_shoots";
  const hours = s.hours ?? "Open daily · Closes 8:30 PM";
  return (
    <>
      <section id="contact" aria-labelledby="book-heading" className="grid scroll-mt-20 gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Reveal>
            <p className="eyebrow">Bookings — Nizamabad · Hyderabad · India</p>
            <h2 id="book-heading" className="serif-display mt-3 text-3xl md:text-4xl">Book your wedding date</h2>
            <p className="mt-3 max-w-md text-[1rem] leading-8 text-muted">
              Tell us about your wedding, pre-wedding, newborn or family
              celebration — it lands straight on our WhatsApp and we reply
              with availability and packages.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <Reveal delay={120}>
            <h3 className="serif-display text-3xl md:text-4xl">Visit the studio</h3>
            <address className="mt-4 max-w-md text-[1rem] leading-8 text-muted not-italic">
              {ADDRESS} —{" "}
              <a href={MAPS_URL} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                open in Google Maps
              </a>
            </address>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Get directions to Phorish Shoots studio on Google Maps"
                className="group inline-flex items-center gap-2 text-[0.6875rem] tracking-[0.22em] uppercase"
              >
                <span className="border-b border-foreground/30 pb-1 transition-colors group-hover:border-foreground">
                  Get directions
                </span>
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </a>
              <a href={`tel:${phoneTel}`} aria-label={`Call Phorish Shoots on ${phoneDisplay}`} className="nav-link">
                {phoneLocal}
              </a>
            </div>

            <dl className="mt-8 grid max-w-md grid-cols-1 gap-0 border-t border-black/10">
              {[
                ["Hours", hours],
                ["Phone", phoneLocal],
                ["Email", email],
                ["Instagram", `@${handle}`],
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
              href={instagram}
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
