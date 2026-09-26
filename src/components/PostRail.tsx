"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Post = {
  id: string;
  count: number;
  src: string;
  title: string | null;
  alt: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PostRail({ posts }: { posts: Post[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const [index, setIndex] = useState(0);
  const [canBack, setCanBack] = useState(false);
  const [canFwd, setCanFwd] = useState(true);

  /** One card + gap, in px. */
  const stepSize = useCallback(() => {
    const el = trackRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return first.offsetWidth + gap;
  }, []);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const step = stepSize() || 1;
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
    setIndex(
      atEnd
        ? posts.length - 1 // last cards can't align left; end of rail = last card
        : Math.min(
            posts.length - 1,
            Math.max(0, Math.round(el.scrollLeft / step)),
          ),
    );
    setCanBack(el.scrollLeft > 2);
    setCanFwd(!atEnd);
  }, [posts.length, stepSize]);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        sync();
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sync]);

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * (stepSize() || el.clientWidth * 0.8),
      behavior: reducedMotion() ? "auto" : "smooth",
    });
  };

  /* ---------- mouse drag-to-scroll (touch keeps native scrolling) ---------- */

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    suppressClickRef.current = false;
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    // abort any in-flight smooth scroll or snap correction (e.g. right after
    // an arrow click): a same-value assignment is a no-op, so nudge the
    // position by a pixel first — otherwise the animation overrides the drag
    el.style.scrollBehavior = "auto";
    el.style.scrollSnapType = "none";
    const frozen = el.scrollLeft;
    el.scrollLeft = frozen + 1;
    el.scrollLeft = frozen;
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = trackRef.current;
    if (!drag || !el || e.pointerId !== drag.pointerId) return;
    const dx = e.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) > 4) {
      drag.moved = true;
      try {
        el.setPointerCapture(drag.pointerId);
      } catch {
        // capture is best-effort; dragging still works while over the rail
      }
      el.classList.add("is-dragging");
      el.style.scrollBehavior = "auto"; // no smooth lag while dragging
      el.style.scrollSnapType = "none"; // snap must not fight the drag
      drag.startScroll = el.scrollLeft; // rebase after aborting any animation
    }
    if (drag.moved) el.scrollLeft = drag.startScroll - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = trackRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    if (drag.moved && el) {
      suppressClickRef.current = true; // swallow the click that follows a drag
      if (el.hasPointerCapture(drag.pointerId)) {
        el.releasePointerCapture(drag.pointerId);
      }
      // land cleanly on the nearest card
      const step = stepSize();
      if (step) {
        el.scrollTo({
          left: Math.round(el.scrollLeft / step) * step,
          behavior: reducedMotion() ? "auto" : "smooth",
        });
      }
    }
    if (el) {
      el.classList.remove("is-dragging");
      el.style.scrollBehavior = "";
      el.style.scrollSnapType = "";
    }
    dragRef.current = null;
    if (drag.moved) sync();
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <>
      <div className="mb-6 flex items-end justify-between gap-6 md:mb-8">
        <div>
          <p className="script-note text-xl md:text-2xl">featured stories</p>
          <p className="eyebrow mt-2">Swipe to explore</p>
        </div>
        <div className="flex items-center gap-4 md:gap-5">
          <span className="eyebrow tabular-nums" aria-hidden>
            {pad(index + 1)} / {pad(posts.length)}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={!canBack}
              aria-label="Previous stories"
              className="rail-btn flex h-9 w-9 items-center justify-center border border-line text-[0.875rem] text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-30"
            >
              <span aria-hidden>&larr;</span>
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={!canFwd}
              aria-label="Next stories"
              className="rail-btn flex h-9 w-9 items-center justify-center border border-line text-[0.875rem] text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-30"
            >
              <span aria-hidden>&rarr;</span>
            </button>
          </div>
        </div>
      </div>

      <div className="hero-rail">
        <div
          ref={trackRef}
          className="hero-rail__track"
          tabIndex={0}
          role="group"
          aria-label={`Featured stories, horizontally scrollable. ${posts.length} posts.`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
        >
          {posts.map((p, i) => (
            <a
              key={p.id}
              href={`https://www.instagram.com/p/${p.id}/`}
              target="_blank"
              rel="noreferrer"
              className="group w-[72vw] shrink-0 snap-start sm:w-[340px] lg:w-[380px]"
            >
              <span className="photo relative block aspect-[4/5]">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 340px, 72vw"
                  className="object-cover"
                  draggable={false}
                />
              </span>
              <div className="mt-3">
                <p className="font-serif line-clamp-2 text-[1.0625rem] leading-snug text-foreground/85 transition-colors group-hover:text-foreground">
                  {p.title || "View story"}
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="eyebrow">
                    {pad(i + 1)} &middot; {p.count} frames
                  </span>
                  <span
                    aria-hidden
                    className="text-[0.75rem] leading-none text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    &#8599;
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <span
          aria-hidden
          className={`rail-fade rail-fade--left${canBack ? " is-on" : ""}`}
        />
        <span
          aria-hidden
          className={`rail-fade rail-fade--right${canFwd ? " is-on" : ""}`}
        />
      </div>
    </>
  );
}
