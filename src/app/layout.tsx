import type { Metadata } from "next";
import { Geist, Cormorant_Garamond, Italianno } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const editorial = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const script = Italianno({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Phorish Shoots — Wedding & Editorial Photography, India",
  description:
    "Documentary, candid and editorial wedding photography based in India. Real people, real emotions, timeless memories.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${editorial.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
