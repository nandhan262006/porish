"use client";

function explain(error: Error): string {
  const message = error.message ?? "";
  if (/Failed query|timeout|fetch failed|libsql|TURSO|ECONN/i.test(message)) {
    return "The studio database did not answer in time. Your last click may not have saved. Try again.";
  }
  return "This page hit a problem and stopped. Try again — if it keeps happening, refresh the browser.";
}

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <p className="eyebrow">Studio CMS</p>
      <h1 className="serif-display mt-3 text-4xl md:text-5xl">Couldn&apos;t load this page</h1>
      <p role="alert" className="mt-4 max-w-xl text-[0.9375rem] leading-7 text-muted">
        {explain(error)}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex h-11 items-center bg-foreground px-6 text-[11px] font-semibold tracking-[0.22em] uppercase text-background hover:bg-terracotta"
      >
        Try again
      </button>
    </main>
  );
}
