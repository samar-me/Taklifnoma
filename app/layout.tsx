import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Great_Vibes, Outfit } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://samar-maxliyo.uz"),
  title: "Samar & Maxliyo — Wedding Invitation",
  description: "Samar va Maxliyoning to‘y marosimiga elektron taklifnoma.",
  openGraph: {
    title: "Samar & Maxliyo — Wedding Invitation",
    description: "Samar va Maxliyoning to‘y marosimiga elektron taklifnoma.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" className={`${cormorant.variable} ${script.variable} ${cinzel.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
