import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Angus McGlynn",
    template: "%s — Angus McGlynn",
  },
  description: "Building, reading, writing things down.",
  openGraph: {
    title: "Angus McGlynn",
    description: "Building, reading, writing things down.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetbrainsMono.variable} ${GeistSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
