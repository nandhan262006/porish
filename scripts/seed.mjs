// CMS seed — plain Node, no build step. Creates tables + imports current
// hardcoded/file content so Phase 2+ can edit it from /admin.
// Usage: npm run db:seed   (honors TURSO_DATABASE_URL / TURSO_AUTH_TOKEN,
// defaults to local file:./data/cms.db)
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL ?? "file:./data/cms.db";
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;
const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");

const db = createClient({ url, authToken });
const now = () => new Date().toISOString();

function imageSize(file) {
  try {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(ROOT, "data", "gallery-sizes.json"), "utf8"),
    );
    if (manifest[file]) return manifest[file];
  } catch { /* no manifest → parse local file */ }
  try {
    const buf = fs.readFileSync(path.join(PUBLIC_DIR, file));
    if (buf[0] === 0x89 && buf[1] === 0x50) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i += 1; continue; }
      const marker = buf[i + 1];
      if (marker === 0xff || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) { i += 2; continue; }
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  } catch { /* missing file → fallback */ }
  return { width: 1200, height: 800 };
}

const GALLERIES = [
  { slug: "weddings", title: "Weddings", category: "weddings", blurb: "Rituals, tears and laughter from the big day — held exactly as they happened.",
    seoTitle: "Wedding Photography in Nizamabad & Telangana",
    seoDescription: "Documentary wedding photography in Nizamabad, Hyderabad & Telangana — rituals, tears and laughter held exactly as they happened. 100+ weddings since 2020. View 26 frames & book your date.",
    seoCopy: "Documentary wedding coverage across Nizamabad, Hyderabad, Karimnagar and Warangal — full-day rituals, candid family moments and editorial portraits, delivered in a private gallery." },
  { slug: "pre-wedding", title: "Pre-Wedding", category: "pre-wedding", blurb: "Quiet hours before the vows — two people, soft light and a story worth slowing down for.",
    seoTitle: "Pre-Wedding Shoot in Hyderabad & Telangana",
    seoDescription: "Candid & editorial pre-wedding photography in Hyderabad, Nizamabad & Bidar — quiet hours before the vows in soft light. View 26 frames & plan your shoot.",
    seoCopy: "Golden-hour forts, empty streets and soft light — pre-wedding sessions around Hyderabad, Bidar and Nizamabad, shot candid and editorial, never forced." },
  { slug: "toddlers", title: "Toddlers", category: "babybump-toddlers", blurb: "First steps, favourite toys and unfiltered joy — childhood exactly as it is.",
    seoTitle: "Toddler & Kids Photography in Hyderabad",
    seoDescription: "Unfiltered toddler photography in Hyderabad & Nizamabad — first steps, favourite toys and unstaged joy. View 27 frames & book a session.",
    seoCopy: "Childhood exactly as it is — fast, funny and unfiltered. Outdoor and at-home toddler sessions across Hyderabad and Nizamabad." },
  { slug: "new-born", title: "New Born", category: "newborn", blurb: "The earliest days, gently documented — tiny hands, sleepy stretches, new beginnings.",
    seoTitle: "Newborn Photography in Nizamabad",
    seoDescription: "Gentle, unposed newborn photography in Nizamabad & Hyderabad — tiny hands, sleepy stretches, new beginnings. View 28 frames & book a session.",
    seoCopy: "Slow, patient newborn sessions at home or in studio — safe, warm and unposed, with parents and siblings woven in gently." },
  { slug: "modeling", title: "Modeling", category: "modeling", blurb: "Portraits with intent for portfolios, brands and editorials — studio and on location.",
    seoTitle: "Modeling Portfolio Photographer in Hyderabad",
    seoDescription: "Editorial modeling portfolios in Hyderabad — studio & on-location portraits with intent for models, brands and editorials. View 25 frames.",
    seoCopy: "Portfolio portraits with intent — studio and on-location editorials for models, actors and brands across Hyderabad and Telangana." },
];

const TESTIMONIALS = [
  ["They didn't just take photos — they gave us our day back. Every ritual, every tear, held exactly as it happened.", "Sruthi & Kiran", "Wedding · Nizamabad"],
  ["We are camera-shy people, but Harish made us forget the lens existed. Our pre-wedding feels like us, not a shoot.", "Madhuri & Sandeep", "Pre-Wedding · Hyderabad"],
  ["Our daughter slept through half the session and they still came home with magic. Gentle, patient, invisible.", "Lakshmi & Arvind", "New Born · Nizamabad"],
  ["The teaser had my mother in tears within a day. The full film felt like reliving the wedding with better light.", "Divya & Rohit", "Wedding · Karimnagar"],
  ["Chasing a two-year-old with a camera is chaos. They turned it into the happiest album on our shelf.", "Priya & Naveen", "Toddler · Hyderabad"],
  ["Editorial eye, documentary heart. My portfolio finally looks like the work I want to be hired for.", "Ananya Rao", "Modeling · Hyderabad"],
  ["Guests are still talking about how unobtrusive they were — and then the photos arrived and nobody missed a thing.", "Kavya & Aditya", "Wedding · Warangal"],
  ["Golden hour, an empty fort, and two people who knew exactly when to step back. Worth every rupee.", "Sneha & Varun", "Pre-Wedding · Bidar"],
  ["Professional from the first call to the final gallery delivery. Private links, quick edits, zero stress.", "Meera & Karthik", "Wedding · Nizamabad"],
];

const FAQS = [
  ["Where is Phorish Shoots based, and do you travel?", "We are based in Mubaraknagar, Nizamabad (Telangana) and photograph weddings across Hyderabad, Karimnagar, Warangal, Bidar and all of India. Travel dates are limited each month, so early booking helps."],
  ["What photography style do you shoot?", "Documentary first: real rituals, tears and laughter as they happen. Between moments we stay candid, go editorial when the light asks for it, and shoot wedding films when the story wants cinema."],
  ["How many weddings have you covered?", "Since 2020 we have covered 100+ weddings and hundreds of pre-wedding, newborn, toddler and modeling sessions. We hold a 4.9-star rating from 85 Google reviews."],
  ["How do we receive our photos?", "Every shoot is delivered through a private online gallery, shared only with you. Your personal link arrives by message once editing is complete and works on any device."],
  ["How do we book a date?", "Send your name, event type and date through the booking form, WhatsApp (+91 85003 62643) or Instagram @phorish_shoots. Dates fill fast in wedding season, so say hello early."],
];

const SERVICES = [
  ["weddings", "Weddings", "The day, held as it happened.", 26, "Documentary", "/phorish-extract/wedding/03_691eb2_126314bb98ff4e67b667d3ac43c65122_mv2.jpg"],
  ["pre-wedding", "Pre-Wedding", "Quiet hours before the vows.", 26, "Candid & editorial", "/phorish-extract/pre-wedding/03_691eb2_de9f6ea47ae0416dbe35866aca7b5e7d_mv2.jpg"],
  ["new-born", "New Born", "The earliest days, gently.", 28, "Gentle & unposed", "/phorish-extract/newborn/03_691eb2_a5bebcde9cca48baab0e77dab5987d5e_mv2.jpg"],
  ["toddlers", "Toddlers", "Childhood, unfiltered.", 27, "Unfiltered", "/phorish-extract/babybump-toddlers/03_691eb2_5e24279512994a59bfaf07d4dd78b137_mv2.jpg"],
  ["modeling", "Modeling", "Portraits with intent.", 25, "Editorial", "/phorish-extract/modeling/03_691eb2_31fe9dfabaa1453fa174e169a467f210_mv2.jpg"],
];

const FILMS = [
  ["Cinematic 01", "/videos/cinematic-1.mp4"],
  ["Cinematic 02", "/videos/cinematic-2.mp4"],
  ["Cinematic 03", "/videos/cinematic-3.mp4"],
  ["Cinematic 04", "/videos/cinematic-4.mp4"],
];

const SETTINGS = {
  phone_display: "+91 85003 62643",
  phone_tel: "+918500362643",
  email: "phorishshoots@gmail.com",
  instagram: "https://www.instagram.com/phorish_shoots/",
  maps_url: "https://maps.app.goo.gl/BLWq2ZWdHid7ptkXA",
  address: "No. 04, Laxmi Priya Nagar, Janapriya Nagar Road, Mubaraknagar, Nizamabad, Telangana 503003",
  hours: "Open daily · Closes 8:30 PM",
  rating_value: "4.9",
  review_count: "85",
  hero_eyebrow: "Wedding photographer · Nizamabad · since 2020",
  hero_h1_a: "Real people, real emotions,",
  hero_h1_b: "timeless memories.",
  hero_sub:
    "Harish & Dhanyasri Pipari — documentary wedding photographers in Nizamabad, Telangana. 100+ weddings, pre-weddings, newborn & family stories across Hyderabad and India, shot as they unfold.",
  hero_proof:
    "100+ weddings since 2020 · Photo Parivaar award-winners · 4.9 ★ from 85 Google reviews",
  about_names: "Harish Pipari & Dhanyasri Pipari",
  about_p1:
    "What began in 2018 with a single Canon 200D bought for ₹20,000 is now Phorish Shoots — a Nizamabad studio run by siblings Harish & Dhanyasri. Since 2020 we've covered 100+ weddings across India, from intimate birthdays to a five-star wedding at AVASA, Hyderabad.",
  about_p2:
    "Harish films, Dhanyasri photographs — but we both chase the same thing. The best photographs don't just show how a moment looked. They remind you how it felt.",
  about_image: "/ABOUT.png",
};

// Fanned hero trio — card classes / GSAP hooks stay code-driven by index.
const HOME_TILES = [
  ["/pre-wedding", "Pre-Wedding", "/phorish-extract/pre-wedding/01_691eb2_37440b721b684ffda83177d7584d78b6_mv2.jpg", "Pre-wedding portrait photographed by Phorish Shoots", "object-[center_30%]"],
  ["/weddings", "Weddings", "/phorish-extract/wedding/01_691eb2_e4a1b776ccc84dca9a796d28544e30fc_mv2.jpg", "Wedding ceremony photographed by Phorish Shoots", "object-[center_35%]"],
  ["/new-born", "New Born", "/phorish-extract/newborn/01_691eb2_99b46f051bc54ddf8a8a5510dcd96356_mv2.jpg", "Newborn photograph by Phorish Shoots", "object-[center_40%]"],
];

async function main() {
  fs.mkdirSync(path.join(ROOT, "data"), { recursive: true });

  await db.execute(`CREATE TABLE IF NOT EXISTS galleries (slug TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL, blurb TEXT NOT NULL DEFAULT '', seo_title TEXT DEFAULT '', seo_description TEXT DEFAULT '', seo_copy TEXT DEFAULT '', cover_image TEXT DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL DEFAULT '')`);
  await db.execute(`CREATE TABLE IF NOT EXISTS gallery_images (id INTEGER PRIMARY KEY AUTOINCREMENT, gallery_slug TEXT NOT NULL REFERENCES galleries(slug) ON DELETE CASCADE, src TEXT NOT NULL, alt TEXT NOT NULL DEFAULT '', width INTEGER NOT NULL DEFAULT 1200, height INTEGER NOT NULL DEFAULT 800, sort_order INTEGER NOT NULL DEFAULT 0, visible INTEGER NOT NULL DEFAULT 1)`);
  await db.execute(`CREATE TABLE IF NOT EXISTS films (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, video_src TEXT NOT NULL, poster_src TEXT DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0, visible INTEGER NOT NULL DEFAULT 1)`);
  await db.execute(`CREATE TABLE IF NOT EXISTS testimonials (id INTEGER PRIMARY KEY AUTOINCREMENT, quote TEXT NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL DEFAULT '', rating INTEGER NOT NULL DEFAULT 5, sort_order INTEGER NOT NULL DEFAULT 0, visible INTEGER NOT NULL DEFAULT 1)`);
  await db.execute(`CREATE TABLE IF NOT EXISTS faqs (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT NOT NULL, answer TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0, visible INTEGER NOT NULL DEFAULT 1)`);
  await db.execute(`CREATE TABLE IF NOT EXISTS services (slug TEXT PRIMARY KEY, title TEXT NOT NULL, subtitle TEXT NOT NULL DEFAULT '', note TEXT NOT NULL DEFAULT '', style TEXT NOT NULL DEFAULT '', frames INTEGER NOT NULL DEFAULT 0, cover_image TEXT DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0)`);
  await db.execute(`CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT '')`);
  await db.execute(`CREATE TABLE IF NOT EXISTS home_tiles (id INTEGER PRIMARY KEY AUTOINCREMENT, href TEXT NOT NULL, label TEXT NOT NULL, src TEXT NOT NULL, alt TEXT NOT NULL DEFAULT '', position TEXT NOT NULL DEFAULT 'object-[center_35%]', sort_order INTEGER NOT NULL DEFAULT 0, visible INTEGER NOT NULL DEFAULT 1)`);

  const t = now();

  // Homepage tab order is the source of truth, not array position.
  const GALLERY_SORT = { weddings: 0, "pre-wedding": 1, "new-born": 2, toddlers: 3, modeling: 4 };

  for (const [i, g] of GALLERIES.entries()) {
    await db.execute({
      sql: `INSERT INTO galleries (slug,title,category,blurb,seo_title,seo_description,seo_copy,cover_image,sort_order,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(slug) DO UPDATE SET title=excluded.title, category=excluded.category, blurb=excluded.blurb, seo_title=excluded.seo_title, seo_description=excluded.seo_description, seo_copy=excluded.seo_copy, sort_order=excluded.sort_order, updated_at=excluded.updated_at`,
      args: [g.slug, g.title, g.category, g.blurb, g.seoTitle, g.seoDescription, g.seoCopy, "", GALLERY_SORT[g.slug] ?? i, t],
    });
  }

  // Images from data/categories.json (skip files missing on disk)
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "categories.json"), "utf8"));
  const catToSlug = { weddings: "weddings", "pre-wedding": "pre-wedding", newborn: "new-born", "babybump-toddlers": "toddlers", modeling: "modeling" };
  let imageCount = 0;
  for (const [cat, files] of Object.entries(raw)) {
    const slug = catToSlug[cat];
    if (!slug) continue;
    const existing = await db.execute({ sql: `SELECT COUNT(*) AS n FROM gallery_images WHERE gallery_slug = ?`, args: [slug] });
    if (Number(existing.rows[0]?.n ?? 0) > 0) continue; // idempotent: don't duplicate
    let order = 0;
    for (const file of files) {
      if (!fs.existsSync(path.join(PUBLIC_DIR, file))) continue;
      const { width, height } = imageSize(file);
      const src = `/${file}`;
      await db.execute({
        sql: `INSERT INTO gallery_images (gallery_slug,src,alt,width,height,sort_order,visible) VALUES (?,?,?,?,?,?,1)`,
        args: [slug, src, "", width, height, order++],
      });
      imageCount++;
    }
    // Default cover = first image
    const first = await db.execute({ sql: `SELECT src FROM gallery_images WHERE gallery_slug = ? ORDER BY sort_order LIMIT 1`, args: [slug] });
    if (first.rows[0]?.src) {
      await db.execute({ sql: `UPDATE galleries SET cover_image = ?, updated_at = ? WHERE slug = ? AND (cover_image IS NULL OR cover_image = '')`, args: [first.rows[0].src, t, slug] });
    }
  }

  const filmCount = (await db.execute(`SELECT COUNT(*) AS n FROM films`)).rows[0]?.n;
  if (Number(filmCount ?? 0) === 0) {
    for (const [i, [title, videoSrc]] of FILMS.entries()) {
      await db.execute({ sql: `INSERT INTO films (title,video_src,poster_src,sort_order,visible) VALUES (?,?,?, ?,1)`, args: [title, videoSrc, "", i] });
    }
  }
  const tCount = (await db.execute(`SELECT COUNT(*) AS n FROM testimonials`)).rows[0]?.n;
  if (Number(tCount ?? 0) === 0) {
    for (const [i, [quote, name, role]] of TESTIMONIALS.entries()) {
      await db.execute({ sql: `INSERT INTO testimonials (quote,name,role,rating,sort_order,visible) VALUES (?,?,?,5,?,1)`, args: [quote, name, role, i] });
    }
  }
  const fCount = (await db.execute(`SELECT COUNT(*) AS n FROM faqs`)).rows[0]?.n;
  if (Number(fCount ?? 0) === 0) {
    for (const [i, [q, a]] of FAQS.entries()) {
      await db.execute({ sql: `INSERT INTO faqs (question,answer,sort_order,visible) VALUES (?,?,?,1)`, args: [q, a, i] });
    }
  }
  for (const [i, [slug, title, subtitle, frames, style, cover]] of SERVICES.entries()) {
    await db.execute({
      sql: `INSERT INTO services (slug,title,subtitle,note,style,frames,cover_image,sort_order) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(slug) DO UPDATE SET title=excluded.title, subtitle=excluded.subtitle, style=excluded.style, frames=excluded.frames, cover_image=excluded.cover_image, sort_order=excluded.sort_order`,
      args: [slug, title, subtitle, subtitle, style, frames, cover, i],
    });
  }
  for (const [k, v] of Object.entries(SETTINGS)) {
    await db.execute({
      sql: `INSERT INTO site_settings (key,value,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO NOTHING`,
      args: [k, v, t],
    });
  }
  // Copy refresh: only overwrite rows still holding the old Phase-1 defaults.
  const COPY_FIXES = [
    ["hero_sub", "Harish & Dhanyasri Pipari — documentary wedding photographers in Nizamabad. 100+ weddings across Telangana & India since 2020.", SETTINGS.hero_sub],
    ["hero_proof", "100+ weddings · Documentary · 4.9 ★ from 85 reviews", SETTINGS.hero_proof],
  ];
  for (const [key, oldValue, newValue] of COPY_FIXES) {
    await db.execute({
      sql: `UPDATE site_settings SET value=?, updated_at=? WHERE key=? AND value=?`,
      args: [newValue, t, key, oldValue],
    });
  }
  await db.execute(`DELETE FROM site_settings WHERE key='hero_h1' AND value='Real people, real emotions, timeless memories.'`);

  const tileCount = Number((await db.execute(`SELECT COUNT(*) AS n FROM home_tiles`)).rows[0]?.n ?? 0);
  if (!tileCount) {
    for (const [i, [href, label, src, alt, position]] of HOME_TILES.entries()) {
      await db.execute({
        sql: `INSERT INTO home_tiles (href,label,src,alt,position,sort_order,visible) VALUES (?,?,?,?,?,?,1)`,
        args: [href, label, src, alt, position, i],
      });
    }
  }

  const counts = {};
  for (const table of ["galleries", "gallery_images", "films", "testimonials", "faqs", "services", "site_settings", "home_tiles"]) {
    counts[table] = Number((await db.execute(`SELECT COUNT(*) AS n FROM ${table}`)).rows[0]?.n ?? 0);
  }
  console.log(`Seed OK (${url}):`, JSON.stringify({ ...counts, imagesAddedThisRun: imageCount }));
}

main().catch((e) => { console.error("Seed failed:", e); process.exit(1); });
