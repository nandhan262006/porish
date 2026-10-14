"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function isControlFlow(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("digest" in error)) return false;
  const digest = String((error as { digest?: unknown }).digest ?? "");
  return digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_HTTP_ERROR_FALLBACK");
}

function explain(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (!message || message.startsWith("Failed query") || /timeout|fetch failed|digest/i.test(message)) {
    return "Couldn't save — the database didn't answer. Nothing was changed. Try again.";
  }
  return message;
}

export default function AdminForm({
  action,
  children,
  className,
  refresh = false,
}: {
  action: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
  className?: string;
  /** Re-fetch the page after save. Only for add-forms where a new row must appear. */
  refresh?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setError(null);
    setSaved(false);
    try {
      await action(formData);
      setSaved(true);
      if (refresh) router.refresh();
    } catch (error) {
      if (isControlFlow(error)) throw error;
      setError(explain(error));
    }
  }

  return (
    <form action={onSubmit} className={className}>
      {children}
      {error ? (
        <p role="alert" className="text-sm leading-6 text-terracotta">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p role="status" className="text-sm leading-6 text-current">
          Saved. It shows on the live site on the next visit.
        </p>
      ) : null}
    </form>
  );
}
