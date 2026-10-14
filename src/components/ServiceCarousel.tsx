"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  key: string;
  href: string;
  title: string;
  subtitle: string;
  image: string;
  frames: number;
  style: string;
};

// The reel runs twice so a 7-wide window never shows the same frame twice.
function buildSlides(services: Omit<Slide, "key">[]): Slide[] {
  const doubled = [...services, ...services];
  return doubled.map((service, i) => ({
    ...service,
    key: `${service.href}-${i}`,
  }));
}

type Dims = {
  cardW: number;
  spacing: number;
  maxD: number;
  angle: number;
};

function measure(): Dims {
  const vw = window.innerWidth;
  if (vw < 768) {
    const cardW = Math.min(Math.round(vw * 0.82), 420);
    return { cardW, spacing: Math.round(cardW * 0.94), maxD: 1, angle: 14 };
  }
  if (vw < 1100) {
    const cardW = Math.min(Math.max(Math.round(vw * 0.26), 200), 300);
    return { cardW, spacing: Math.round(cardW * 0.72), maxD: 2, angle: 16 };
  }
  const cardW = Math.min(Math.max(Math.round(vw * 0.22), 220), 340);
  return { cardW, spacing: Math.round(cardW * 0.66), maxD: 3, angle: 18 };
}

function wrapIndexWith(count: number, i: number) {
  return ((i % count) + count) % count;
}

export default function ServiceCarousel({
  services,
}: {
  services: Omit<Slide, "key">[];
}) {
  const slides = useMemo(() => buildSlides(services), [services]);
  const COUNT = slides.length;
  const wrapIndex = useCallback((i: number) => wrapIndexWith(COUNT, i), [COUNT]);
  const [dims, setDims] = useState<Dims>({ cardW: 300, spacing: 200, maxD: 3, angle: 18 });
  const [active, setActive] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const current = useRef(0);
  const target = useRef(0);
  const activeRef = useRef(0);
  const dimsRef = useRef(dims);

  // Mirror render state for the frame loop without reading refs in render.
  useEffect(() => {
    dimsRef.current = dims;
  });

  const cardH = Math.round(dims.cardW * 1.25);

  const publishActive = useCallback(() => {
    const a = wrapIndex(Math.round(target.current));
    if (a !== activeRef.current) {
      activeRef.current = a;
      setActive(a);
    }
  }, [wrapIndex]);

  // Shortest-path seek on the infinite loop.
  const goTo = useCallback(
    (index: number) => {
      const delta = ((((index - target.current) % COUNT) + COUNT * 1.5) % COUNT) - COUNT / 2;
      target.current += delta;
      publishActive();
    },
    [COUNT, publishActive],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      goTo(Math.round(target.current) + dir);
    },
    [goTo],
  );

  // Frame loop: exponential ease toward the target reads as inertia,
  // and every card is re-projected from the same float each frame.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();

    const layout = (c: number) => {
      const { spacing, maxD, angle } = dimsRef.current;
      for (let i = 0; i < COUNT; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        let d = (i - c) % COUNT;
        if (d > COUNT / 2) d -= COUNT;
        if (d < -COUNT / 2) d += COUNT;
        const ad = Math.abs(d);
        const gone = ad > maxD + 0.6;
        const x = d * spacing;
        const s = Math.pow(0.84, Math.min(ad, 4));
        const rY = Math.max(-42, Math.min(42, -d * angle));
        el.style.transform = `translate3d(${x.toFixed(1)}px,0,0) rotateY(${rY.toFixed(2)}deg) scale(${s.toFixed(3)})`;
        el.style.opacity = gone ? "0" : Math.max(0.25, 1 - ad * 0.22).toFixed(2);
        el.style.zIndex = String(100 - Math.round(ad * 10));
        el.style.visibility = gone ? "hidden" : "visible";
        el.style.pointerEvents = gone || ad > maxD ? "none" : "auto";
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = target.current;
      let c = current.current;
      if (reduced) {
        c = t;
      } else {
        c += (t - c) * (1 - Math.exp(-dt * 10));
        if (Math.abs(t - c) < 0.0005) c = t;
      }
      current.current = c;
      publishActive();
      layout(c);
      raf = requestAnimationFrame(tick);
    };

    const update = () => setDims(measure());
    update();
    window.addEventListener("resize", update);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, [COUNT, publishActive]);

  // Horizontal-wheel only: vertical scroll always belongs to the page.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let acc = 0;
    let cool = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      if (now - cool < 600) return;
      acc += e.deltaX;
      if (Math.abs(acc) > 40) {
        step(acc > 0 ? 1 : -1);
        acc = 0;
        cool = now;
      }
    };
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, [step]);

  const drag = useRef({ on: false, x: 0, base: 0, moved: 0 });

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = { on: true, x: e.clientX, base: target.current, moved: 0 };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const g = drag.current;
    if (!g.on) return;
    const dx = e.clientX - g.x;
    g.moved = Math.max(g.moved, Math.abs(dx));
    // 1:1 while held; the loop eases it home on release.
    target.current = g.base - dx / dimsRef.current.spacing;
    current.current = target.current;
    publishActive();
  }

  function endDrag() {
    const g = drag.current;
    if (!g.on) return;
    g.on = false;
    target.current = Math.round(target.current);
    publishActive();
  }

  function onCardClick(e: React.MouseEvent, index: number) {
    // A real drag ending on a card must not also navigate it.
    if (drag.current.moved > 8) {
      e.preventDefault();
      return;
    }
    goTo(index);
  }

  const meta = services[active % services.length];

  return (
    <section id="services" aria-labelledby="services-heading" className="scroll-mt-20 overflow-hidden bg-[#050505] py-20 text-[#f6f1ea] md:py-28">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-[#f3c7b6]">
              Wedding & family photography services
            </p>
            <h2 id="services-heading" className="serif-display mt-3 text-5xl text-white md:text-7xl">
              What we shoot
            </h2>
          </div>
          <p className="hidden max-w-[220px] text-right text-[0.9375rem] leading-7 text-white/70 md:block">
            Drag, scroll sideways, or tap a frame to bring it centre.
          </p>
        </div>
      </div>

      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Services"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative mx-auto mt-12 w-full cursor-grab touch-pan-y select-none active:cursor-grabbing md:mt-14"
        style={{ height: cardH + 24, perspective: "1400px" }}
      >
        {slides.map((slide, i) => {
          const duplicate = i >= services.length;
          const isActive = wrapIndex(i) === active;
          return (
          <Link
            key={slide.key}
            href={slide.href}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            onClick={(e) => onCardClick(e, i)}
            aria-label={`${slide.title} photography gallery in Nizamabad — open gallery`}
            aria-current={isActive && !duplicate ? "true" : undefined}
            aria-hidden={duplicate || undefined}
            tabIndex={duplicate ? -1 : undefined}
            className="absolute top-0 left-1/2 overflow-hidden rounded-2xl bg-[#141414] shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
            style={{ width: dims.cardW, height: cardH, marginLeft: -dims.cardW / 2 }}
          >
            <Image
              src={slide.image}
              alt={duplicate ? "" : `${slide.title} ${slide.style.toLowerCase()} photography by Phorish Shoots in Nizamabad`}
              fill
              priority={i === 0}
              draggable={false}
              sizes="(max-width: 768px) 82vw, 30vw"
              className="object-cover"
            />
          </Link>
          );
        })}
      </div>

      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div key={active} className="caption-fade mx-auto mt-10 max-w-2xl text-center md:mt-12">
          <h3 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {meta.title} photography
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-7 text-white/75">{meta.subtitle} Nizamabad · Hyderabad · across India.</p>
          <dl className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-0 text-left sm:grid-cols-2 sm:gap-x-12">
            {[
              ["Frames", `${meta.frames} in the gallery`],
              ["Style", meta.style],
              ["Studio", "Nizamabad · travels"],
            ].map(([term, value]) => (
              <div
                key={term}
                className="flex items-baseline justify-between gap-6 border-t border-white/10 py-3"
              >
                <dt className="text-[11px] tracking-[0.22em] uppercase text-white/60">
                  {term}
                </dt>
                <dd className="text-sm text-white">{value}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={meta.href}
            aria-label={`Open the ${meta.title} photography gallery`}
            className="mt-8 inline-block border-b border-white/40 pb-1 text-[11px] tracking-[0.24em] uppercase text-white"
          >
            Open {meta.title} gallery
          </Link>
        </div>
      </div>
    </section>
  );
}