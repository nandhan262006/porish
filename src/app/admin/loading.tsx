export default function AdminLoading() {
  return (
    <div
      aria-hidden
      className="mx-auto w-full max-w-[1360px] px-5 py-8 md:px-10 md:py-12"
    >
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <div className="hidden h-fit rounded-3xl bg-[#1a1410] p-5 lg:block">
          <div className="h-3 w-24 rounded bg-white/15 motion-safe:animate-pulse" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="h-8 rounded-lg bg-white/10 motion-safe:animate-pulse" />
            ))}
          </div>
        </div>
        <div>
          <div className="h-3 w-32 rounded bg-black/10 motion-safe:animate-pulse" />
          <div className="mt-3 h-10 w-64 rounded bg-black/10 motion-safe:animate-pulse" />
          <div className="mt-3 h-4 w-full max-w-xl rounded bg-black/10 motion-safe:animate-pulse" />
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-32 rounded-3xl bg-black/5 motion-safe:animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
