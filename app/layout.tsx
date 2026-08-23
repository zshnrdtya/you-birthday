import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// Optimize Google Font with next/font to prevent layout shifts and render blocking
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#3b0764",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Happy Birthday, Zalfa Ramadani 💜",
  description: "A surprise birthday website crafted with love.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-purple-50 font-sans antialiased text-purple-950">
        {children}
      </body>
    </html>
  );
}
