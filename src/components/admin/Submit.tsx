"use client";

import { useFormStatus } from "react-dom";

export default function Submit({ children = "Save" }: { children?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center bg-foreground px-6 text-[11px] font-semibold tracking-[0.22em] uppercase text-background transition-colors hover:bg-terracotta disabled:opacity-60"
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

export { TinyAction } from "./TinyAction";
