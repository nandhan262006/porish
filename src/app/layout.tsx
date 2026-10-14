import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import {
  SITE_URL,
  SITE_NAME,
  SITE_LOCALE,
  CORE_KEYWORDS,
  INSTAGRAM,
  YOUTUBE,
  MAPS_URL,
  PHONE_TEL,
  EMAIL,
  DEFAULT_OG_IMAGE,
} from "@/lib/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1a1410",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Phorish Shoots | Wedding Photographer in Nizamabad, Telangana",
    template: "%s | Phorish Shoots",
  },
  description:
    "Phorish Shoots — documentary wedding photographer in Nizamabad, Telangana. Weddings, pre-wedding shoots, newborn, toddler & modeling portraits across Hyderabad & India. 100+ weddings since 2020. Rated 4.9 from 85 Google reviews.",
  keywords: CORE_KEYWORDS,
  authors: [{ name: "Harish Pipari" }, { name: "Dhanyasri Pipari" }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Photography",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Phorish Shoots | Wedding Photographer in Nizamabad, Telangana",
    description:
      "Real people, real emotions, timeless memories. Documentary weddings, pre-wedding, newborn, toddler & modeling — 100+ celebrations across India since 2020.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Harish Pipari and Dhanyasri Pipari — Phorish Shoots wedding photographers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phorish Shoots | Wedding Photographer in Nizamabad",
    description:
      "Documentary weddings, pre-wedding, newborn, toddler & modeling photography across Telangana & India. 100+ weddings since 2020.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

const STUDIO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#studio`,
  name: SITE_NAME,
  image: DEFAULT_OG_IMAGE,
  url: SITE_URL,
  telephone: PHONE_TEL,
  email: EMAIL,
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "No. 04, Laxmi Priya Nagar, Janapriya Nagar Road, Mubaraknagar",
    addressLocality: "Nizamabad",
    addressRegion: "Telangana",
    postalCode: "503003",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 18.702, longitude: 78.1218 },
  hasMap: MAPS_URL,
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "20:30",
  },
  sameAs: [INSTAGRAM, YOUTUBE, MAPS_URL],
  founder: [
    { "@type": "Person", name: "Harish Pipari" },
    { "@type": "Person", name: "Dhanyasri Pipari" },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "85",
  },
  makesOffer: [
    "Wedding Photography",
    "Pre-Wedding Photography",
    "Newborn Photography",
    "Toddler Photography",
    "Modeling Portfolio Photography",
    "Wedding Films",
  ],
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "en-IN",
  publisher: { "@id": `${SITE_URL}/#studio` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body
        className={`${cormorant.variable} ${inter.variable} bg-background text-foreground antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-[#1a1410] focus:px-4 focus:py-2 focus:text-sm focus:text-[#f6f1ea]"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STUDIO_SCHEMA) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
        />
        <Header />
        <div id="main-content">{children}</div>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
