import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel, Roboto_Condensed, Edu_VIC_WA_NT_Hand } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
});
const eduvicHand = Edu_VIC_WA_NT_Hand({
  variable: "--font-eduvic-hand",
  subsets: ["latin"],
  adjustFontFallback: false,
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "The Shutter Black",
    template: "%s | The Shutter Black",
  },
  description: "Professional photography portfolio, albums and photography services based on Dambulla, Sri Lanka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${robotoCondensed.variable} ${eduvicHand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
