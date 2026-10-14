"use server";

import crypto from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client } from "@/lib/storage";
import { requireAdmin } from "@/lib/admin";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export type UploadTicket = {
  uploadUrl: string;
  key: string;
  publicUrl: string;
  contentType: string;
};

/** Presigned PUT so the browser uploads straight to R2 — the server never
 *  proxies bytes. Returns the public URL + object key to register later. */
export async function createUploadTicket(input: {
  folder: string;
  filename: string;
  contentType: string;
  size: number;
}): Promise<UploadTicket> {
  await requireAdmin();
  const { folder, contentType, size } = input;
  const kind = IMAGE_TYPES.includes(contentType)
    ? "image"
    : VIDEO_TYPES.includes(contentType)
      ? "video"
      : null;
  if (!kind) throw new Error(`Unsupported file type: ${contentType}`);
  const max = kind === "video" ? 200 * 1024 * 1024 : 25 * 1024 * 1024;
  if (size > max) throw new Error(`File too large (max ${Math.round(max / 1048576)} MB).`);

  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "").slice(0, 40) || "misc";
  const ext = EXT[contentType] ?? "bin";
  const key = `uploads/${safeFolder}/${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;

  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is not set.");

  const uploadUrl = await getSignedUrl(
    getR2Client(),
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
    { expiresIn: 600 },
  );

  const base = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? process.env.R2_PUBLIC_URL ?? "").replace(/\/+$/, "");
  if (!base) throw new Error("R2_PUBLIC_URL is not set — the upload would have nowhere public to land.");
  return { uploadUrl, key, publicUrl: `${base}/${key}`, contentType };
}
