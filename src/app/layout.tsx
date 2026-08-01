import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/* Each face ships one Regular cut only, so weight/style are pinned and
   font-synthesis is disabled in globals.css to stop faux bold. */

const typographica = localFont({
  src: "./fonts/Typographica.ttf",
  variable: "--font-typographica",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const gelline = localFont({
  src: "./fonts/Gelline.otf",
  variable: "--font-gelline",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const mantira = localFont({
  src: "./fonts/CombineMantiraSans.otf",
  variable: "--font-mantira",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  /**
   * Without this, og:image resolves against localhost and every link preview
   * in production points at a machine nobody else can reach. Set
   * NEXT_PUBLIC_SITE_URL to the real origin before deploying.
   */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "FounderFlow - AI inbox intelligence for founders",
  description:
    "FounderFlow reads your inbox before you do. Six specialist models classify every message, surface revenue signals, and hand you one briefing each morning.",
  openGraph: {
    title: "FounderFlow - AI inbox intelligence for founders",
    description:
      "Six specialist models classify every message, surface revenue signals, and hand you one briefing each morning.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${typographica.variable} ${gelline.variable} ${mantira.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-moss text-bone">
        {children}
      </body>
    </html>
  );
}
