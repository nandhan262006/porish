import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

const required = [
  "R2_ACCOUNT_ID",
  "R2_BUCKET_NAME",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
] as const;

function env(name: (typeof required)[number]): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const globalForR2 = globalThis as unknown as {
  __r2Client?: S3Client;
};

export function getR2Client(): S3Client {
  if (!globalForR2.__r2Client) {
    for (const name of required) env(name);
    globalForR2.__r2Client = new S3Client({
      region: "auto",
      endpoint:
        process.env.R2_ENDPOINT ??
        `https://${env("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env("R2_ACCESS_KEY_ID"),
        secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
      },
    });
  }
  return globalForR2.__r2Client;
}

/** True when `src` is a bucket-relative R2 key (uploads/…) rather than a
 *  legacy local path (/phorish-extract/…, /videos/…) or absolute URL. */
export function isR2Key(src: string): boolean {
  return !!src && !src.startsWith("/") && !src.startsWith("http");
}

/** Best-effort R2 cleanup for admin deletes. Never throws — the DB row
 *  must go even if the object is already gone (or R2 isn't configured,
 *  e.g. local dev). Callers must only pass keys the row owns outright
 *  (never shared covers/tiles). */
export async function deleteR2Objects(keys: string[]): Promise<void> {
  try {
    const targets = [...new Set(keys)].filter(isR2Key);
    if (!targets.length) return;
    const bucket = process.env.R2_BUCKET_NAME;
    if (!bucket) return;
    const client = getR2Client();
    await Promise.all(
      targets.map((key) =>
        client
          .send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
          .catch((e: unknown) =>
            console.warn(`[storage] R2 delete skipped for ${key}:`, e),
          ),
      ),
    );
  } catch (e) {
    console.warn("[storage] R2 cleanup skipped:", e);
  }
}
