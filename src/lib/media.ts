/** Resolve a public/-style asset path against the R2 public bucket URL.
 *  Without NEXT_PUBLIC_R2_PUBLIC_URL the site still serves from /public. */
const BASE = (
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL ??
  process.env.R2_PUBLIC_URL ??
  ""
).replace(/\/+$/, "");

export function mediaUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return BASE ? `${BASE}${p}` : p;
}
