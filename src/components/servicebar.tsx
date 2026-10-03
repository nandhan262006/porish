import Link from "next/link";

const services = [
  { href: "/weddings", index: "01", title: "Weddings", note: "The day, held as it happened." },
  { href: "/pre-wedding", index: "02", title: "Pre-Wedding", note: "Quiet hours before the vows." },
  { href: "/new-born", index: "03", title: "New Born", note: "The earliest days, gently." },
  { href: "/toddlers", index: "04", title: "Toddlers", note: "Childhood, unfiltered." },
  { href: "/modeling", index: "05", title: "Modeling", note: "Portraits with intent." },
];

export default function ServiceBar() {
  return (
    <section className="px-5 py-6 md:px-10">
      <div className="mx-auto max-w-[1360px] border-y border-black/10">
        <ul className="grid md:grid-cols-5">
          {services.map((service, i) => (
            <li key={service.href} className={i > 0 ? "border-t border-black/10 md:border-t-0 md:border-l" : ""}>
              <Link href={service.href} className="group flex min-h-[132px] flex-col justify-between px-5 py-6">
                <span className="text-[11px] tracking-[0.22em] text-terracotta">{service.index}</span>
                <span>
                  <span className="serif-display block text-3xl">{service.title}</span>
                  <span className="mt-2 block text-sm text-muted">{service.note}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
