"use client";

import { useEffect, useRef, useState } from "react";

export default function CinemaPlayer({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  // Autoplay muted in view, pause offscreen so four films stay light.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function toggleSound() {
    const el = ref.current;
    if (!el) return;
    const nextMuted = !muted;
    setMuted(nextMuted);
    el.muted = nextMuted;
    // Unmuted playback is allowed after a user gesture (this tap).
    if (!nextMuted) el.play().catch(() => {});
  }

  return (
    <div className="group relative block w-full bg-black">
      <video
        ref={ref}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onClick={toggleSound}
        aria-label={`${title} wedding film by Phorish Shoots — tap for sound`}
        className="h-auto w-full cursor-pointer"
      />
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={!muted}
        aria-label={muted ? `Play ${title} with sound` : `Mute ${title}`}
        className="absolute top-3 right-3 inline-flex items-center gap-2 bg-black/55 px-3 py-2 text-[10px] tracking-[0.2em] uppercase text-white backdrop-blur-sm transition-colors hover:bg-black/80"
      >
        <span aria-hidden>{muted ? "🔇" : "🔊"}</span>
        {muted ? "Tap for sound" : "Sound on"}
      </button>
    </div>
  );
}
