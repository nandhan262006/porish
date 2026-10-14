import Image from "next/image";
import Link from "next/link";

const facts = [
  { value: "2020", label: "Studio opened" },
  { value: "100+", label: "Weddings covered" },
  { value: "India", label: "Stories on the road" },
];

export default function HomeAbout({
  names,
  paragraph1,
  paragraph2,
  image,
}: {
  names: string;
  paragraph1: string;
  paragraph2: string;
  image: string;
}) {
  const [nameA, nameB] = names.split(/ & /);
  return (
    <section id="about" aria-labelledby="home-about-heading" className="px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-[1360px] items-center gap-12 md:grid-cols-12">
        <figure className="photo relative aspect-[4/5] md:col-span-5">
          <Image
            src={image}
            alt="Harish Pipari and Dhanyasri Pipari — documentary wedding photographers in Nizamabad"
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
          <figcaption className="sr-only">
            Harish Pipari and Dhanyasri Pipari of Phorish Shoots
          </figcaption>
        </figure>

        <div className="md:col-span-6 md:col-start-7">
          <p className="eyebrow">About the studio</p>
          <h2 id="home-about-heading" className="serif-display mt-4 text-5xl leading-[1.02] md:text-6xl">
            {nameA ?? names}
            {nameB ? (
              <>
                <span className="italic"> & </span>
                {nameB}
              </>
            ) : null}
          </h2>
          <div className="thin-rule mt-7 mb-7 w-16" />
          <div className="max-w-lg space-y-5 text-[1rem] leading-8 text-muted">
            <p>{paragraph1}</p>
            <p>{paragraph2}</p>
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

          <Link href="/about-us" aria-label="Read the full story of Phorish Shoots studio" className="nav-link mt-8 inline-block">
            Read the full story
          </Link>
        </div>
      </div>
    </section>
  );
}
