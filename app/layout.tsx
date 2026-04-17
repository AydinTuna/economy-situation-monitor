import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Situation Monitor",
  description: "Live news feed and stream dashboard — Bloomberg, CNN, CNBC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="h-full bg-gray-950 text-gray-100 antialiased overflow-hidden md:overflow-hidden">
        {children}
      </body>
    </html>
  );
}
