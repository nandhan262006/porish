import Image from "next/image";
import Link from "next/link";

const facts = [
  { value: "2020", label: "Studio opened" },
  { value: "100+", label: "Weddings covered" },
  { value: "India", label: "Stories on the road" },
];

export default function HomeAbout() {
  return (
    <section id="about" className="px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-[1360px] items-center gap-12 md:grid-cols-12">
        <figure className="photo relative aspect-[4/5] md:col-span-5">
          <Image
            src="/ABOUT.png"
            alt="Harish Pipari and Dhanyasri Pipari"
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </figure>

        <div className="md:col-span-6 md:col-start-7">
          <p className="eyebrow">About</p>
          <h2 className="serif-display mt-4 text-5xl leading-[0.95] md:text-6xl">
            Harish Pipari
            <span className="italic"> & </span>
            Dhanyasri Pipari
          </h2>
          <div className="thin-rule mt-7 mb-7 w-16" />
          <div className="max-w-lg space-y-5 text-[0.97rem] leading-7 text-muted">
            <p>
              Photography is the part of a wedding that stays. Since 2020 we
              have followed 100+ celebrations across India, keeping the day as
              it actually unfolded.
            </p>
            <p>
              Light, texture, and the people in the room matter more than a
              forced pose. We stay close, then get out of the way.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-black/10 pt-6">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="serif-display text-3xl md:text-4xl">{fact.value}</dt>
                <dd className="mt-2 text-[11px] tracking-[0.14em] uppercase text-muted">
                  {fact.label}
                </dd>
              </div>
            ))}
          </dl>

          <Link href="/about" className="nav-link mt-8 inline-block">
            Read the full story
          </Link>
        </div>
      </div>
    </section>
  );
}
