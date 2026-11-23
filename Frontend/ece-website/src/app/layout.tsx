import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TextReveals from "@/components/TextReveals";
import { SiteStructuredData } from "@/components/SeoStructuredData";
import { getSiteConfig, pageMetadata } from "@/lib/seo";
const sans = localFont({
  src: "../../public/fonts/google-sans.ttf",
  variable: "--font-google-sans",
  weight: "400 700",
  display: "swap",
});
const flex = localFont({
  src: "../../public/fonts/google-sans-flex.ttf",
  variable: "--font-google-flex",
  weight: "100 1000",
  display: "swap",
});
export const metadata: Metadata = {
  ...pageMetadata("home"),
  metadataBase: getSiteConfig().base,
  icons: { icon: "/assets/eke-logo-symbol.svg" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      {/* Extensions such as Grammarly add body attributes before hydration.
          Suppression is limited to this element; child mismatches still warn. */}
      <body className={sans.variable + " " + flex.variable} suppressHydrationWarning>
        {children}
        <SiteStructuredData />
        <TextReveals />
      </body>
    </html>
  );
}
