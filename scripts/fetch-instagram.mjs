#!/usr/bin/env node
/**
 * Fetch Instagram photos for site data.
 * Works anonymously via the Googlebot view of the post page (og:image + carousel URLs, 640px).
 *
 *   1. Put post URLs (one per line) in scripts/instagram-urls.txt
 *   2. node scripts/fetch-instagram.mjs
 *
 * Writes media to public/instagram/ and a manifest to data/instagram.json.
 */
import { spawn } from "node:child_process";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const URLS_FILE = path.join(ROOT, "scripts", "instagram-urls.txt");
const OUT_DIR = path.join(ROOT, "public", "instagram");
const MANIFEST = path.join(ROOT, "data", "instagram.json");
const UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

function parseInfo(raw) {
  const m = raw.match(/<meta property="og:image" content="([^"]+)"/);
  const d = raw.match(/<meta property="og:description" content="([^"]*)"/);
  const direct = m ? m[1] : null;
  if (!direct) return null;
  // og:description looks like "841 likes, 1 comments - phorish_shoots on November 1, 2025: caption here"
  let title = null;
  if (d) {
    const text = d[1]
      .replace(/"/g, '"')
      .replace(/&/g, "&")
      .replace(/&#x201c;/g, '\u201c')
      .replace(/&#x201d;/g, '\u201d')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2019;/g, "\u2019")
      .replace(/&#x2018;/g, "\u2018");
    const colon = text.indexOf(": ");
    title = colon >= 0 ? text.slice(colon + 2).trim() : text.trim();
  }
  return { title, direct };
}

function download(url, dest) {
  return new Promise((resolve) => {
    const child = spawn("curl", [
      "-s", "-L", "-A", UA, "--max-time", "60", "-o", dest, url,
    ]);
    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });
}

async function main() {
  let lines;
  try {
    lines = (await readFile(URLS_FILE, "utf8"))
      .split("\n").map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"));
  } catch {
    console.error(`Missing ${path.relative(ROOT, URLS_FILE)}`);
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  let manifest = [];
  try { manifest = JSON.parse(await readFile(MANIFEST, "utf8")); } catch {}

  const seen = new Set(manifest.map((m) => m.id));
  let added = 0;

  for (const url of lines) {
    const id = url.split("?")[0].split("/").filter(Boolean).pop();
    if (!id) continue;
    if (seen.has(id)) { console.log(`Skip existing: ${id}`); continue; }

    process.stdout.write(`Fetching ${id} ... `);
    const page = await download(url.split("?")[0], path.join(OUT_DIR, `.${id}`));
    if (page !== 0) { console.log("FAILED (page fetch)"); continue; }
    const raw = await readFile(path.join(OUT_DIR, `.${id}`), "utf8");

    const info = parseInfo(raw);
    if (!info) { console.log("FAILED (no og:image — login wall)"); continue; }

    const clean = raw
      .replaceAll("\\u0026", "&")
      .replaceAll(/&(amp|#038|#x26);/g, "&")
      .replaceAll(String.fromCharCode(38) + "quot;", String.fromCharCode(34));
    const urls = [...new Set(
      clean.match(/https:\/\/scontent\.cdninstagram\.com\/v\/t51\.82787-15\/[^"'\\ ]+/g) ?? []
    )].filter((u) => !/_s150x|_s320x|_p150|_sh0\.08/.test(u));
    await unlink(path.join(OUT_DIR, `.${id}`), { force: true });

    const items = [];
    for (const [i, u] of urls.entries()) {
      const isSmall = /_s150x|_s320x|_p150|_sh0\.08/.test(u);
      if (isSmall) continue;
      const slug = `${id}-${String(i).padStart(2, "0")}.jpg`;
      const code = await download(u, path.join(OUT_DIR, slug));
      if (code !== 0) continue;
      items.push(slug);
    }

    // fall back to og:image alone
    if (!items.length) {
      const slug = `${id}.jpg`;
      const code = await download(info.direct, path.join(OUT_DIR, slug));
      if (code !== 0) { console.log("FAILED (download)"); continue; }
      items.push(slug);
    }

    manifest.push({
      id,
      type: "image",
      count: items.length,
      src: `/instagram/${items[0]}`,
      srcs: items.map((s) => `/instagram/${s}`),
      title: info.title,
      alt: (info.title ?? id).slice(0, 120),
    });
    seen.add(id);
    added++;
    console.log(`OK (${items.length} images)`);
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Manifest: data/instagram.json (${manifest.length} posts, ${added} new)`);
}

main();
