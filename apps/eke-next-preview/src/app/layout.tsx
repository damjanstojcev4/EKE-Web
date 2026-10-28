import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
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
  title: "EKE — Homepage design preview",
  description: "An isolated preview of EKE's Figma homepage.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={sans.variable + " " + flex.variable}>{children}</body>
    </html>
  );
}
