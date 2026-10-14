/** Resolve a public/-style asset path against the R2 public bucket URL.
 *  Without NEXT_PUBLIC_R2_PUBLIC_URL the site still serves from /public. */
const BASE = (
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL ??
  process.env.R2_PUBLIC_URL ??
  ""
).replace(/\/+$/, "");

/** Origin of the R2 public bucket, for `<link rel="preconnect">`. Empty
 *  when the site serves from /public, in which case no preconnect is needed. */
export const MEDIA_ORIGIN = BASE;

export function mediaUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return BASE ? `${BASE}${p}` : p;
}
