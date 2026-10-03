import fs from "node:fs";
import path from "node:path";
import CinemaPlayer from "@/components/CinemaPlayer";

const PUBLIC_DIR = path.join(process.cwd(), "public");

// Drop the four films here (exact names) and they appear automatically:
//   public/videos/cinematic-1.mp4
//   public/videos/cinematic-2.mp4
//   public/videos/cinematic-3.mp4
//   public/videos/cinematic-4.mp4
const FILMS = [
  { file: "videos/cinematic-1.mp4", title: "Cinematic 01" },
  { file: "videos/cinematic-2.mp4", title: "Cinematic 02" },
  { file: "videos/cinematic-3.mp4", title: "Cinematic 03" },
  { file: "videos/cinematic-4.mp4", title: "Cinematic 04" },
];

export default function Cinematics() {
  const films = FILMS.map((film) => ({
    ...film,
    ready: fs.existsSync(path.join(PUBLIC_DIR, film.file)),
  }));

  return (
    <section id="cinematics" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Cinematics</p>
            <h2 className="serif-display mt-3 text-5xl md:text-7xl">
              Films
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-muted">
            Four stories in motion — teasers, trailers and wedding films.
          </p>
        </div>
      </div>

      <div className="mt-10 grid w-full grid-cols-1 gap-0 border-y border-black/10 sm:grid-cols-2">
        {films.map((film, i) => (
          <figure
            key={film.file}
            className="relative block w-full bg-black"
          >
            {film.ready ? (
              <CinemaPlayer src={`/${film.file}`} title={film.title} />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 border border-dashed border-white/20 text-center">
                <p className="text-[11px] tracking-[0.28em] uppercase text-white/60">
                  {film.title}
                </p>
                <p className="max-w-[240px] text-xs leading-5 text-white/40">
                  Film {i + 1} lands here — add{" "}
                  <code className="text-white/60">{film.file}</code> to
                  public/videos.
                </p>
              </div>
            )}
            <figcaption className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-8 pb-3 text-[10px] tracking-[0.24em] uppercase text-[#f3c7b6]">
              {film.title}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mx-auto mt-8 flex max-w-[1360px] flex-col items-center justify-between gap-4 px-5 sm:flex-row md:px-10">
        <p className="text-[11px] tracking-[0.22em] uppercase text-muted">
          4 films — weddings & stories
        </p>
        <a
          href="https://www.instagram.com/phorish_shoots/"
          target="_blank"
          rel="noreferrer"
          className="nav-link"
        >
          More films on Instagram
        </a>
      </div>
    </section>
  );
}
