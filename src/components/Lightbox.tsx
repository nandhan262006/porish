"use client";

import { useCallback, useEffect, useRef } from "react";

export type LightboxImage = { src: string; alt: string };

const SWIPE_THRESHOLD = 48;

export default function Lightbox({
  images,
  index,
  onNavigate,
  onClose,
}: {
  images: LightboxImage[];
  index: number | null;
  onNavigate: (next: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const nav = useCallback(
    (delta: number) => {
      if (index === null || images.length === 0) return;
      onNavigate((index + delta + images.length) % images.length);
    },
    [index, images.length, onNavigate],
  );

  useEffect(() => {
    if (index === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") nav(1);
      else if (e.key === "ArrowLeft") nav(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, onClose, nav]);

  if (index === null) return null;

  const current = images[index];
  const next = images[(index + 1) % images.length];
  const prev = images[(index - 1 + images.length) % images.length];

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
      nav(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer — frame ${index + 1} of ${images.length}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="lb-in fixed inset-0 z-50 flex items-center justify-center bg-[#1a1410]/95 p-4 md:p-10"
    >
      {/* Preload neighbours so arrow/swipe navigation is instant */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={next.src} alt="" aria-hidden hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={prev.src} alt="" aria-hidden hidden />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close photo viewer"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-[#f6f1ea] transition-colors hover:bg-white/10 md:right-6 md:top-6"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => nav(-1)}
        aria-label="Previous photo"
        className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-[#f6f1ea] transition-colors hover:bg-white/10 md:left-6"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden>
          <path d="M14.5 5.5L8 12l6.5 6.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => nav(1)}
        aria-label="Next photo"
        className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-[#f6f1ea] transition-colors hover:bg-white/10 md:right-6"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden>
          <path d="M9.5 5.5L16 12l-6.5 6.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <figure
        className="flex max-h-full flex-col items-center"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current.src}
          src={current.src}
          alt={current.alt}
          draggable={false}
          className="lb-in max-h-[84svh] max-w-[92vw] select-none object-contain md:max-w-[86vw]"
        />
        <figcaption className="lb-in mt-4 text-[11px] tracking-[0.2em] text-white/70">
          {index + 1} / {images.length}
        </figcaption>
      </figure>
    </div>
  );
}
