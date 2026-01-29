import type { Metadata } from "next";
import { Playfair_Display, Lato, Roboto_Mono } from "next/font/google";
import "./globals.css";

// Headers: Playfair Display - Elegant serif for headers
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Body: Lato - Warm, friendly, pairs beautifully with Playfair Display
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Numbers/Stats: Roboto Mono - Clean monospace for data
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ShiftCrew – The Professional Network for Restaurant Workers",
  description:
    "See what restaurant workers REALLY make. Verified pay, culture reviews, and W-2 career jobs. Built by crew, for crew.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} ${lato.variable} ${robotoMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
