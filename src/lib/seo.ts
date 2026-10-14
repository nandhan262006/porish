/** Central SEO config — single source of truth for URLs, NAP + socials. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://phorish.com";

export const SITE_NAME = "Phorish Shoots";
export const SITE_LOCALE = "en_IN";
export const PHONE_DISPLAY = "+91 85003 62643";
export const PHONE_TEL = "+918500362643";
export const EMAIL = "phorishshoots@gmail.com";
export const INSTAGRAM = "https://www.instagram.com/phorish_shoots/";
export const YOUTUBE = "https://www.youtube.com/@phorishshoots";
export const MAPS_URL = "https://maps.app.goo.gl/BLWq2ZWdHid7ptkXA";
export const ADDRESS_LINES = [
  "No. 04, Laxmi Priya Nagar, Janapriya Nagar Road, Mubaraknagar",
  "Nizamabad, Telangana 503003",
];

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-cover.jpg`;
export const LOGO_URL = `${SITE_URL}/logo.png`;

export const abs = (path = "/") =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const CORE_KEYWORDS = [
  "wedding photographer Nizamabad",
  "wedding photography Telangana",
  "pre-wedding shoot Hyderabad",
  "newborn photographer Nizamabad",
  "toddler photography Hyderabad",
  "modeling portfolio photographer",
  "candid wedding photographer India",
  "documentary wedding photography",
  "Phorish Shoots",
  "Harish Pippari",
  "Dhanyasri Pippari",
];
