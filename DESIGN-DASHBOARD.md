# DESIGN-DASHBOARD.md — Phorish Shoots Studio CMS (`/admin`)

Single source of truth for the dashboard design. Public site is warm editorial documentary; the dashboard is the same brand, tuned for fast editing work.

> Scope: everything under `src/app/admin/**` + `src/components/admin/**`.
> Stack: Next.js 16 App Router, Tailwind v4, Server Components + Server Actions, Drizzle/Turso, R2 media via `Uploader`.
> Do not invent new brand colors, fonts, or radii — use tokens below.

---

## 1. Product definition

**What it is:** Studio CMS for Harish + Dhanyasri (non-technical owners). Edit live site without code.
**Promise:** "A save says Saved when it worked. Hide takes something off the site without deleting it."
**Core verbs (consistent everywhere):**

| Verb | Meaning | UI |
|---|---|---|
| Save / Save & publish | Persist + `publish(tag)` so next visit is fresh | `Submit` button |
| Hide / Show | `visible 1↔0`. Keeps row, removes from live site | `TinyAction` accent |
| ★ Star / Unstar | `featured 1↔0`. Adds to homepage Gallery strip (unlimited count) | `FeatureToggle` |
| Cover | `galleries.cover_image = src`. Leads gallery order | `CoverButton` |
| ↑ ↓ | Swap `sort_order` with neighbour. Live order follows | `TinyAction` neutral |
| Delete | Hard delete (cascade for gallery → photos). Confirm first | `TinyAction` danger |
| View live ↗ | Opens public page in new tab | Link |

**IA (matches `AdminNav` exactly, in order):**

1. `/admin` — Overview
2. `/admin/home` — Homepage hero (Hero fan trio)
3. `/admin/galleries` — Galleries list
4. `/admin/galleries/[slug]` — Gallery photos grid
5. `/admin/films` — Wedding films
6. `/admin/services` — What we shoot (carousel)
7. `/admin/testimonials` — Client love notes
8. `/admin/faqs` — Questions, answered
9. `/admin/settings` — Site settings + About portrait
10. `/admin/login` — Bare login (no shell)

---

## 2. Design tokens

### 2.1 Color (from `src/app/globals.css`)

```css
--background: #f6f1ea;   /* page */
--foreground: #1a1410;   /* ink text + dark surfaces */
--muted: #5d544b;        /* secondary copy */
--terracotta: #9c4a2e;   /* brand accent, focus, links-hover */
--cream: #fffaf4;        /* card surface */
--line: rgba(26,20,16,0.12);
--ink: #1a1410;
```

Derived (use as Tailwind arbitrary values, do not add to theme):
- Dark panel: `bg-[#1a1410] text-[#f6f1ea]`, sub-copy `text-white/60`, eyebrow-on-dark `#f3c7b6`
- Thumb placeholder: `bg-[#efe7de]`
- Borders: `border-black/10` (cards), `border-black/15` (inputs), `border-terracotta/40` (alerts)
- Inputs: `bg-white/70`
- Overlay badges: `bg-[#1a1410]/85 text-[#f3c7b6]`, `bg-terracotta text-background`

### 2.2 Type

- Serif display: Cormorant Garamond (`--font-serif`), class `.serif-display` — page H1 `text-4xl md:text-5xl`, card numbers `text-5xl/6xl`, item titles `text-2xl`.
- Sans: Inter (`--font-sans`) — everything else. Body copy `text-[0.9375rem] leading-7`, helper `text-sm leading-6`, micro-label `text-[11px] tracking-[0.24em] uppercase`, tiny `text-[10px] tracking-[0.2em] uppercase`.
- Eyebrow pattern (every page top): `<p class="eyebrow">Studio CMS · {Section}</p>` — 12px/600/0.22em/uppercase/terracotta. On dark panels use `text-[#f3c7b6]` instead.
- Links in copy: `underline underline-offset-4`, hover terracotta.

### 2.3 Shape + elevation

- Page cards / panels: `rounded-3xl`. Photo cells: `rounded-2xl`. Thumbs: `rounded-xl` / `rounded-lg`. Inputs: `rounded-lg`. Badges/pills: `rounded-full`.
- Card: `border border-black/10 bg-cream p-5 md:p-6` (sections `md:p-8`).
- Dark CTA panel ("Add new …"): `rounded-3xl bg-[#1a1410] p-6 md:p-8 text-[#f6f1ea]`.
- Hover lift only on Overview nav-cards: `hover:shadow-[0_18px_40px_rgba(26,20,16,0.10)]`. No shadows on edit rows (keeps scan speed high).
- Hidden rows: `opacity-50` (lists) / `opacity-45` (photo grid). Never `display:none` — owner must see hidden items.

### 2.4 Spacing / layout shell

- Shell: `mx-auto w-full max-w-[1360px] px-5 py-8 md:px-10 md:py-12`, inner `grid gap-8 lg:grid-cols-[240px_1fr]`.
- Sidebar: `rounded-3xl bg-[#1a1410] p-5 text-[#f6f1ea] lg:sticky lg:top-24 lg:h-fit`. Content: `min-w-0` (prevents form overflow).
- Page head rhythm: eyebrow → `h1 mt-3` → sub-copy `mt-3 max-w-xl` → content `mt-8` → add-panel `mt-10`.
- List rhythm: `space-y-5` (rows), `space-y-6` (hero tiles), photo grid `grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4`.

---

## 3. Global shell + navigation

**`src/app/admin/layout.tsx`:**
- `export const dynamic = "force-dynamic"`, `robots: { index: false, follow: false }`.
- Unauthed → render `{children}` bare (login has no nav).
- Authed → sidebar + content grid (above).
- Sidebar contents: label `Studio CMS` (`text-[#f3c7b6]` eyebrow style) → `AdminNav` → divider `border-white/10` → `View live site ↗` (`text-white/70 hover:bg-white/10 hover:text-white`) → `LogoutButton`.

**`AdminNav`:** vertical `flex flex-col gap-1 mt-4`. Item `rounded-lg px-3 py-2 text-[13px] font-medium tracking-wide`. Active: `bg-white/15 text-white` + `aria-current="page"`. Inactive: `text-white/75 hover:bg-white/10 hover:text-white`. Active matching: exact for `/admin`, `startsWith` for rest.

**Login (`/admin/login`):** bare centered card, no sidebar, same tokens. On success → `/admin`.

---

## 4. Page-by-page spec

### 4.1 Overview (`/admin/page.tsx`)

Purpose: orient + jump. Never edit here.
Structure:
1. Head: `Studio CMS` / `Overview` / helper: "Edit the live site from here. A save says Saved when it worked. Hide takes something off the site without deleting it. Star a photo to put it on the homepage Gallery strip."
2. DB error alert (only on failure): `rounded-2xl border border-terracotta/40 bg-cream p-5`, text names `npm run db:seed` + `TURSO_DATABASE_URL`.
3. Stat grid `grid gap-4 sm:grid-cols-2 xl:grid-cols-3`:
   - Lead tile (dark): `Photos in library` (peach eyebrow) → serif `text-6xl` count → `across {n} galleries` (`text-white/60`).
   - 5 count cards (`CARDS`): Galleries / Films / Services / Testimonials / FAQs. Each: terracotta eyebrow label → serif `text-5xl` count → 1-line hint (`text-muted`) → `Open →` underline link that turns terracotta on `group-hover`.
   - 2 link cards (`LINKS`): Homepage hero / Settings (no big number, same card chrome).
4. Quick guide panel (`bg-cream`): 4 bullets covering Star-vs-gallery, Hide-vs-Delete, ↑↓ ordering, DB retry. Copy must stay in sync with actual behavior.

Counts query: `count()` on galleries, galleryImages, films, testimonials, faqs, services.

### 4.2 Homepage hero (`/admin/home`)

Title: `Hero fan trio`. Sub: "The three fanned photos under the headline. The first three that are Live fill the wings, left to right…" + link to Settings.
Slot labels: `Slot {i+1} · Left wing | Centre (front) | Right wing | Spare`.
Row anatomy (per tile):
- Left: `h-56 w-44 rounded-2xl` photo (`object-cover`), provenance line below: `From galleries · {title}` (link) or `Custom upload · not in galleries`, plus truncated filename.
- Right: header `Slot n` (terracotta eyebrow) → `AdminForm(saveTile)` grid `md:grid-cols-2`: Label / Links to (`/weddings` style) / Alt text / Crop focus (`object-[center_30%]` hint) → `Submit`.
- `Change image`: `PhotoPicker` (Choose from galleries) + `Uploader folder={hero-{id}} kind=image` (One JPG/PNG → R2 replaces tile).
- Action bar `border-t border-black/10 pt-4`: Hide/Show (accent toggle) · Delete (danger, confirm) · ↑ ↓ (neutral) · right-aligned status `Live|Hidden` (`data-visibility-status`).
Add panel (dark): `Add a spare tile` — Label + Links to → Add. Helper: "Only the first three live tiles fill the fan — a new one waits as a spare until you move it up."

### 4.3 Galleries list (`/admin/galleries`)

Title `Galleries`. Sub: "Open a gallery to upload photos, hide frames, star photos for the homepage, and write alt text."
Row anatomy:
- Top flex: `w-20` cover thumb (`h-14 w-20 rounded-lg bg-[#efe7de]`, filename/“No cover” micro below) → title (`serif-display text-2xl hover:text-terracotta`, links to `[slug]`) + meta `/{slug} · {n} photos · updated {date}` → right: Delete (danger, confirm includes title) + `Edit photos →` outline button (`h-8 border border-foreground/40 text-[10px] tracking-[0.18em] uppercase hover:bg-foreground hover:text-background`).
- Collapsible `details > summary` (`Text & SEO`, uppercase micro): `AdminForm(saveGallery)` grid `md:grid-cols-2`: Title / Blurb / SEO title / SEO description / Hero copy full-width (`md:col-span-2`, hint "Shown under the gallery name banner.").
Add panel (dark): `Start a new gallery` — Title + Blurb → Create.

### 4.4 Gallery detail (`/admin/galleries/[slug]`)

Title = gallery title. Sub bar: `← All galleries · view live ↗ · {live} of {total} frames live · ★ {featured} on the homepage strip…` with `data-live / data-total / data-featured` spans for optimistic updates.
Uploader first (`max-w-lg`, `folder={slug}`, `multiple`, hint "JPG / PNG / WebP / AVIF — goes straight to R2, appended at the end").
Photo grid (above): cell `rounded-2xl border bg-cream p-3`:
- Thumb `aspect-[4/5] rounded-xl`: plain `<img loading=lazy decoding=async draggable=false object-cover>`, badges: `Cover` (terracotta pill, `data-cover-badge`, hidden unless active) + `★ Home` (dark pill, `data-feature-badge`).
- Filename micro (`truncate uppercase text-muted`).
- Alt form: text input (`rounded-lg border-black/15 bg-white/70 px-2 py-1.5 text-xs focus:border-terracotta`) + `Save alt` (terracotta micro uppercase).
- Actions row `gap-1.5`: `FeatureToggle` (★) · Hide/Show · `CoverButton` (Make cover) · ↑ ↓ · ✕ delete (danger, `optimistic`, deltas for live/total/featured).

### 4.5 Films (`/admin/films`)

Title `Wedding films`. Sub: "The Films section on the homepage. Hide takes a film off the live site. Upload replaces the file. Use ↑ ↓ to reorder."
Row: `AdminForm(saveFilm)` grid `md:grid-cols-12`: col-4 Title (`Film {n}`) + Poster (hint "Path or https:// URL") · col-6 Video source (hint "Path like /videos/… or a full https:// URL") · col-2 Submit (bottom-aligned).
Action bar + `Uploader folder={films-{id}} kind=video` ("MP4 / WebM / MOV — uploads straight to R2 and swaps this row's source.").
Add panel (dark): `Add new film` — same 3 fields → Add + second `Uploader folder=films` ("…or upload a video file — Goes to R2 and creates the film row automatically.") in `max-w-lg`.

### 4.6 Services (`/admin/services`)

Title `What we shoot`. Sub: "The spinning carousel on the homepage. Cover images pulled from a gallery are labeled under the photo. Use ↑ ↓ to reorder the cards."
Row: `flex gap-5`: left thumb `hidden sm:block w-24` (`h-28 w-24 rounded-xl`), provenance (`From galleries · {title}` / `Custom · not in galleries` / `No cover set` + filename) → right form `md:grid-cols-12`: col-4 Title + Frames (number) · col-4 Tagline (textarea 2) + Style · col-4 Cover image (hint "Path like /phorish-extract/… or a full https:// URL") + Submit.
Action bar: ↑ ↓ · Delete (danger, confirm names service) · right meta `/{slug}`.
Add panel (dark): `Add new service` + helper "Name it exactly like its gallery so the card links to a live page (e.g. "Weddings" → /weddings)…" — Title + Tagline → Add.

### 4.7 Testimonials (`/admin/testimonials`)

Title `Client love notes`. Sub: `{n} quotes. The homepage wall shows the first nine that are Live, in this order…`
Row: form grid `md:grid-cols-12`: col-7 Quote (`Quote {n}`, textarea 3) · col-3 Name + Role/city · col-2 Submit. Action bar: Hide/Show · Delete · ↑ ↓ · `Live|Hidden`.
Add panel (dark): `Add new` — Quote (placeholder "What the couple said…") + Name ("Sruthi & Kiran") + Role ("Wedding · Nizamabad") → Add.

### 4.8 FAQs (`/admin/faqs`)

Title `Questions, answered`. Sub: `{n} questions on the homepage…`
Row: form stacked: Question (`Question {n}`) + Answer (textarea 4) + Submit. Same action bar.
Add panel: Question ("What do couples ask most?") + Answer → Add.

### 4.9 Settings (`/admin/settings`)

Title `Site settings`. Sub: "Phone, address, homepage headline, and the about text. One save updates all of them on the live site."
One `AdminForm(saveSettings)` wrapping 3 fieldsets (`space-y-10`), each `bg-cream` card: terracotta group title + helper + `grid gap-5 md:grid-cols-2` fields:
- Contact & studio: phone_display (tel) · phone_tel (tel) · email · instagram (url) · youtube (url) · maps_url (url) · address (textarea 2) · hours · rating_value (number) · review_count (number).
- Homepage hero: hero_eyebrow · hero_h1_a · hero_h1_b (italic line 2) · hero_sub (textarea 3) · hero_proof (hint).
- About teaser: about_names ("Use " & " … italic ampersand") · about_p1 (4) · about_p2 (4).
Footer: `Save & publish` + "One click saves all groups."
About portrait section (separate card): current `h-56 w-44 rounded-2xl` + filename → `PhotoPicker` (Choose from galleries) + `Uploader folder=about kind=image` ("One JPG/PNG — goes to R2 and becomes the about photo.").

---

## 5. Components

### 5.1 `AdminForm` — save + feedback
Client wrapper around Server Action. States: idle → saving (native) → `Saved. It shows on the live site on the next visit.` (`role=status`) or error (`role=alert text-terracotta`: "Couldn't save — the database didn't answer. Nothing was changed. Try again." for timeout/fetch/digest, else raw message). Prop `refresh` only on add-forms (router.refresh so new row appears). Never use for Hide/Delete/reorder (those are `TinyAction`).

### 5.2 `Field` — label + input
Label micro uppercase muted + control. Types text/number/email/url/tel + textarea(rows). Handles `defaultValue`, `placeholder`, `hint` (11px muted below). Inputs: `rounded-lg border-black/15 bg-white/70`, `focus:border-terracotta` + global `:focus-visible` terracotta ring.

### 5.3 `Submit` / `TinyAction`
- `Submit`: primary save. Label defaults Save; variants Create/Add/Save & publish per context. Bottom-align in grid (`flex items-end`).
- `TinyAction`: small bordered action `h-8 px-3 text-[10px] tracking-[0.18em] uppercase`. Tones: `accent` (Hide/Show terracotta behavior), `danger` (Delete/✕ red, always `confirm=`), `neutral` (↑↓). Props: `confirm`, `optimistic` (remove row immediately), `refresh={false}` default for row actions, `toggle` + `initialVisible` for Hide/Show label swap, `liveDelta/totalDelta/featuredDelta` on photo delete.

### 5.4 `Uploader` — R2 upload
Dashed dropzone: label + hint + file input. Props `folder`, `kind: image|video`, `multiple?`, `onUploaded` (bound Server Action e.g. `applyTileImage.bind(null, id)`). Copy always states destination + effect ("goes to R2 and …"). Folders: `hero-{id}`, `about`, `{gallery-slug}`, `films`, `films-{id}`.

### 5.5 `PhotoPicker` — reuse gallery frames
Modal/button `Choose from galleries`. Grid of visible photos (`thumb` via `mediaUrl`, grouped by gallery `title`). `onPick(src)` bound per row (`pickTileImage`, `pickAboutImage`). Only lists `visible` photos.

### 5.6 `FeatureToggle` (★) / `CoverButton`
- Star: pill/toggle showing `★` / `★ Home`. Active = dark pill visible; toggles `featured`. Label copy: "Star as many as you want — every starred photo shows [on homepage strip]."
- Cover: `Make cover` → sets `cover_image`; badge `Cover` moves; cover leads gallery order on public site.

### 5.7 Badges + status
`Cover` terracotta pill `text-[9px] tracking-[0.18em] uppercase`; `★ Home` dark pill; `Live|Hidden` right-aligned `text-[11px] tracking-[0.18em] uppercase text-muted` with `data-visibility-status`. Keep `data-item`, `data-cover-badge`, `data-feature-badge`, `data-live/total/featured` hooks — tests and optimistic UI depend on them.

---

## 6. States

- **Loading:** `src/app/admin/loading.tsx` skeleton (same shell, pulsing cards). **Error:** `error.tsx` with `Try again` (DB retry language).
- **Empty:** gallery with 0 photos → grid empty + uploader prominent; testimonials/faqs show `0 quotes/questions` in sub-copy (not an error).
- **DB unreachable:** Overview alert + per-form inline error. Never blank screen. Retry copy: "If a page says the database did not answer, wait a moment and press Try again."
- **Hidden vs deleted:** hidden = dimmed in place + `Hidden` status; deleted = gone + confirm modal beforehand. Confirm strings name the item ("Delete the whole "{title}" gallery and ALL of its photos?").
- **Saved:** inline `Saved.` under form; no toast system. Add-forms also refresh list.

## 7. Responsive + motion + a11y

- Breakpoints: base (phone) → `sm` (photo meta) → `md` (form grids, `p-6`) → `lg` (sidebar split) → `xl` (overview 3-col, photo 4-col).
- Sidebar stacks above content on mobile; action bars `flex-wrap`; photo grid 2-col on phones; tables never used (cards only).
- Motion: none in dashboard except transitions `transition-colors` / `transition-shadow` + `hover:-translate` on links. Respect `prefers-reduced-motion` (no GSAP in admin; GSAP lives on public hero only).
- A11y: `aria-label="Admin"` nav, `aria-current`, `role=alert/status` on form feedback, labeled alt inputs (`aria-label=Alt text for frame n`), visible `:focus-visible` terracotta outline, `sr-only` fieldset legends, skip-link inherited from root layout. Color contrast: terracotta on cream passes for large/micro-bold; body stays `muted #5d544b` on `#f6f1ea`/`#fffaf4`.

## 8. Copy voice

Plain-spoken, second-person, no jargon. Every page: eyebrow → serif title → 1–2 sentence helper stating (a) where it appears live, (b) what Hide/Delete do, (c) ordering rule. Keep existing strings verbatim unless behavior changes:
- "Hide keeps … but removes it from the live site. Delete removes it for good."
- "Use ↑ ↓ on any list to reorder — photos, films, services, quotes, questions and hero tiles all follow that order on the live site."
- "Star a photo to put it on the homepage Gallery strip."
- Uploader hints always include format + destination + placement ("appended at the end of the grid", "replaces this tile", "becomes the about photo").

## 9. Technical constraints (do not break)

- Server Components for reads (`force-dynamic`), client only for `AdminForm/Submit/Uploader/PhotoPicker/*Toggle/*Button/AdminNav`.
- Every mutation = Server Action guarded by `requireAdmin()` + ends with `publish(TAG)` (`content:galleries|films|services|testimonials|faqs|settings|home`). Public reads are `unstable_cache` with 300s floor.
- `sortOrder` drives all public order; move actions swap neighbours. New uploads append at max+1. First-three-live rule for hero fan; first-nine-live for testimonials wall; featured-any-count for gallery strip (fallback first 5 if none).
- Media: store R2 key or `/path`; render via `mediaUrl()`. Never hardcode domain. Seeded paths carry leading `/`, R2 keys don't — normalize with `replace(/^\/+/,"")` when matching provenance.
- Auth: `isAdmin()` / iron-session; unauthed redirects to `/admin/login`. No admin indexing.

## 10. Build / QA checklist

- [ ] Tokens only from §2; no new hex, font, or radius.
- [ ] Every list row has Hide/Show + Delete(confirm) + ↑↓ + status; photos add ★ + Cover + alt-save.
- [ ] Every section ends with dark Add panel; add-forms use `refresh`.
- [ ] `data-*` hooks intact; `role=alert/status` present.
- [ ] Mobile: sidebar stacks, grids collapse, action bars wrap, no horizontal scroll.
- [ ] Copy states live location + Hide-vs-Delete + ordering.
- [ ] Mutations publish correct tag; ordering matches public query (`sortOrder, id`).
- [ ] Uploader folder/kind correct; PhotoPicker only visible photos.
- [ ] `robots noindex` on admin; `View live site` + `view live ↗` links work.

---

## File map

```
src/app/admin/layout.tsx          shell + sidebar
src/app/admin/page.tsx            overview + counts + guide
src/app/admin/loading.tsx         skeleton
src/app/admin/error.tsx           retry
src/app/admin/login/page.tsx      bare login
src/app/admin/home/page.tsx       hero fan trio
src/app/admin/galleries/page.tsx  list + SEO details + create
src/app/admin/galleries/[slug]/   photo grid + alt + star/cover
src/app/admin/films/page.tsx      films + video uploader
src/app/admin/services/page.tsx   carousel cards
src/app/admin/testimonials/page.tsx  quotes (first 9 live)
src/app/admin/faqs/page.tsx       accordion source
src/app/admin/settings/page.tsx   settings groups + portrait
src/components/admin/AdminForm.tsx / Field.tsx / Submit.tsx
  Uploader.tsx / PhotoPicker.tsx / FeatureToggle.tsx
  CoverButton.tsx / AdminNav.tsx / LoginForm.tsx / LogoutButton.tsx
src/lib/admin.ts (requireAdmin/publish) · content.ts (TAGS/cache)
  db.ts · media.ts (mediaUrl) · session.ts
drizzle/schema.ts (galleries/gallery_images/films/testimonials/faqs/services/site_settings/home_tiles)
```
