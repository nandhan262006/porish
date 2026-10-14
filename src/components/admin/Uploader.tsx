"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createUploadTicket } from "@/app/admin/upload-actions";
import { isControlFlow } from "./AdminForm";
import type { UploadedMeta } from "@/lib/upload";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime";

type FileState = {
  id: string;
  name: string;
  size: number;
  pct: number;
  status: "queued" | "uploading" | "processing" | "done" | "error";
  error?: string;
};

async function imageDims(file: File): Promise<{ width: number; height: number }> {
  try {
    const bmp = await createImageBitmap(file);
    const dims = { width: bmp.width, height: bmp.height };
    bmp.close();
    return dims;
  } catch {
    return { width: 1200, height: 800 };
  }
}

async function videoDims(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      resolve({ width: v.videoWidth || 1920, height: v.videoHeight || 1080 });
      URL.revokeObjectURL(url);
    };
    v.onerror = () => {
      resolve({ width: 1920, height: 1080 });
      URL.revokeObjectURL(url);
    };
    v.src = url;
  });
}

/** PUT with real progress events — fetch() can't report upload bytes. */
function putWithProgress(url: string, contentType: string, file: File, onPct: (pct: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("content-type", contentType);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onPct(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Upload failed (${xhr.status})`));
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(file);
  });
}

function fmtSize(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export default function Uploader({
  folder,
  kind,
  label = "Drop files or click to upload",
  hint,
  multiple = false,
  onUploaded,
}: {
  folder: string;
  kind: "image" | "video";
  label?: string;
  hint?: string;
  multiple?: boolean;
  onUploaded: (meta: UploadedMeta) => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [files, setFiles] = useState<FileState[]>([]);
  const busy = files.some((f) => f.status !== "done" && f.status !== "error");

  const patch = (id: string, next: Partial<FileState>) =>
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...next } : f)));

  async function uploadOne(file: File, id: string) {
    const contentType = file.type || (kind === "video" ? "video/mp4" : "image/jpeg");
    try {
      patch(id, { status: "uploading", pct: 0 });
      const ticket = await createUploadTicket({ folder, filename: file.name, contentType, size: file.size });
      await putWithProgress(ticket.uploadUrl, contentType, file, (pct) => patch(id, { pct }));
      patch(id, { status: "processing", pct: 100 });
      const dims = kind === "image" ? await imageDims(file) : await videoDims(file);
      await onUploaded({
        key: ticket.key,
        publicUrl: ticket.publicUrl,
        contentType,
        filename: file.name,
        width: dims.width,
        height: dims.height,
      });
      patch(id, { status: "done" });
      // The page is force-dynamic data on the server; pull a fresh copy so
      // the new frame and live count appear without a manual reload.
      router.refresh();
    } catch (e) {
      // Session expiry surfaces as a redirect, not an upload failure —
      // send the admin back to login instead of showing "Failed".
      if (isControlFlow(e)) {
        router.push("/admin/login");
        router.refresh();
        return;
      }
      patch(id, { status: "error", error: e instanceof Error ? e.message : "Upload failed." });
    }
  }

  async function handleFiles(list: FileList | null) {
    if (!list?.length || busy) return;
    const incoming = multiple ? Array.from(list) : [list[0]];
    const states: FileState[] = incoming.map((file, i) => ({
      id: `${Date.now()}-${i}-${file.name}`,
      name: file.name,
      size: file.size,
      pct: 0,
      status: "queued",
    }));
    setFiles(states);
    // Parallel uploads — each file streams to R2 independently.
    await Promise.all(states.map((s, i) => uploadOne(incoming[i], s.id)));
    if (inputRef.current) inputRef.current.value = "";
  }

  const heading = !busy && files.length
    ? files.every((f) => f.status === "done")
      ? "All uploads complete ✓"
      : null
    : busy
      ? "Uploading…"
      : label;

  return (
    <div>
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-colors ${
          busy ? "border-terracotta/60 opacity-70" : "border-black/20 hover:border-terracotta"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={kind === "image" ? IMAGE_ACCEPT : VIDEO_ACCEPT}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => void handleFiles(e.target.files)}
          disabled={busy}
        />
        <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-terracotta">
          {heading ?? label}
        </span>
        {hint ? <span className="text-xs text-muted">{hint}</span> : null}
      </label>

      {files.length ? (
        <ul className="mt-3 space-y-2" aria-live="polite">
          {files.map((f) => (
            <li key={f.id} className="rounded-xl border border-black/10 bg-white/60 px-3 py-2">
              <div className="flex items-baseline justify-between gap-3 text-xs">
                <span className="truncate font-medium text-foreground" title={f.name}>
                  {f.name}
                </span>
                <span className="shrink-0 tabular-nums text-muted">
                  {f.status === "error"
                    ? "Failed"
                    : f.status === "done"
                      ? "Done ✓"
                      : f.status === "processing"
                        ? "Registering…"
                        : `${f.pct}% · ${fmtSize(f.size)}`}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/10">
                <div
                  className={`h-full rounded-full transition-[width] duration-200 ease-out ${
                    f.status === "error"
                      ? "bg-terracotta"
                      : f.status === "done"
                        ? "bg-emerald-600"
                        : "bg-terracotta"
                  }`}
                  style={{
                    width:
                      f.status === "done" ? "100%" : f.status === "error" ? "100%" : `${f.pct}%`,
                  }}
                />
              </div>
              {f.error ? <p className="mt-1 text-[11px] text-terracotta">{f.error}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
