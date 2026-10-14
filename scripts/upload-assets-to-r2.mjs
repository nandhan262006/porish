// Upload static assets from public/ to the Cloudflare R2 bucket.
// Idempotent: skips objects that already exist with the same size.
// Usage: node --env-file=.env scripts/upload-assets-to-r2.mjs [--force]
import fs from "node:fs";
import path from "node:path";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const FORCE = process.argv.includes("--force");
const BUCKET = process.env.R2_BUCKET_NAME;
if (!BUCKET || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
  console.error("Missing R2_* env vars (use: node --env-file=.env ...)");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint:
    process.env.R2_ENDPOINT ??
    `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// What to upload from public/ (top-level entries). logo/ABOUT stay local for
// favicon + OG fallbacks, upload them too so R2 mirrors the site media.
const TARGETS = ["phorish-extract", "videos", "logo.png", "ABOUT.png"];

const TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
};

function* walk(root) {
  const full = path.join("public", root);
  if (!fs.existsSync(full)) return;
  const stat = fs.statSync(full);
  if (stat.isFile()) return void (yield { file: full, key: root });
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const child = path.join(full, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path.relative("public", child));
    } else {
      yield { file: child, key: path.relative("public", child).split(path.sep).join("/") };
    }
  }
}

async function remoteSize(key) {
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return head.ContentLength ?? -1;
  } catch {
    return null;
  }
}

// Existing keys, so we can prune remote files no longer in public/
const remoteKeys = new Set();
{
  let token;
  do {
    const list = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken: token }),
    );
    for (const o of list.Contents ?? []) remoteKeys.add(o.Key);
    token = list.IsTruncated ? list.NextContinuationToken : undefined;
  } while (token);
}

let uploaded = 0,
  skipped = 0,
  failed = 0;
const seen = new Set();

for (const root of TARGETS) {
  for (const { file, key } of walk(root)) {
    seen.add(key);
    const local = fs.statSync(file);
    const remote = await remoteSize(key);
    if (!FORCE && remote === local.size) {
      skipped += 1;
      continue;
    }
    const type = TYPES[path.extname(key).toLowerCase()] ?? "application/octet-stream";
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: fs.createReadStream(file),
          ContentType: type,
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );
      console.log(`✓ ${key} (${(local.size / 1048576).toFixed(1)} MB, ${type})`);
      uploaded += 1;
    } catch (e) {
      console.error(`✗ ${key}: ${e.message}`);
      failed += 1;
    }
  }
}

// Prune remote objects under our targets that no longer exist locally
const stale = [...remoteKeys].filter(
  (k) => TARGETS.some((t) => k === t || k.startsWith(t + "/")) && !seen.has(k),
);
for (const key of stale) {
  const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  console.log(`✂ removed stale ${key}`);
}

console.log(
  `\nDone: ${uploaded} uploaded, ${skipped} skipped (already present), ${failed} failed, ${stale.length} stale removed.`,
);
if (failed) process.exit(1);
