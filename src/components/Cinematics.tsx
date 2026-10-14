import CinemaPlayer from "@/components/CinemaPlayer";
import { getFilms } from "@/lib/content";

export default async function Cinematics() {
  const films = await getFilms();

  return (
    <section id="cinematics" aria-labelledby="films-heading" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Wedding films & teasers</p>
            <h2 id="films-heading" className="serif-display mt-3 text-5xl md:text-7xl">
              Films
            </h2>
          </div>
          <p className="max-w-xs text-[0.9375rem] leading-7 text-muted">
            Four wedding stories in motion — teasers, trailers and full films
            from Nizamabad, Hyderabad and Telangana celebrations.
          </p>
        </div>
      </div>

      <div className="mt-10 grid w-full grid-cols-1 gap-0 border-y border-black/10 sm:grid-cols-2">
        {films.length === 0 ? (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 border border-dashed border-white/20 text-center">
            <p className="text-[11px] tracking-[0.28em] uppercase text-white/60">
              No films yet
            </p>
            <p className="max-w-[240px] text-xs leading-5 text-white/40">
              Add wedding films from the studio dashboard — they land here.
            </p>
          </div>
        ) : null}
        {films.map((film) => (
          <figure
            key={film.id}
            className="relative block w-full bg-black"
          >
            <CinemaPlayer src={film.src} title={film.title} />
            <figcaption className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-8 pb-3 text-[10px] tracking-[0.24em] uppercase text-[#f3c7b6]">
              {film.title}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mx-auto mt-8 flex max-w-[1360px] flex-col items-center justify-between gap-4 px-5 sm:flex-row md:px-10">
        <p className="text-[12px] font-medium tracking-[0.18em] uppercase text-muted">
          4 wedding films — Nizamabad · Hyderabad · Telangana
        </p>
        <span className="flex items-center gap-6">
          <a
            href="https://www.youtube.com/@phorishshoots"
            target="_blank"
            rel="noreferrer"
            aria-label="Watch more wedding films by Phorish Shoots on YouTube"
            className="nav-link"
          >
            More films on YouTube
          </a>
          <a
            href="https://www.instagram.com/phorish_shoots/"
            target="_blank"
            rel="noreferrer"
            aria-label="Watch more wedding films by Phorish Shoots on Instagram"
            className="nav-link"
          >
            Instagram
          </a>
        </span>
      </div>
    </section>
  );
}
