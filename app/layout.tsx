import type { Metadata } from "next";
import { Baloo_2, Quicksand } from "next/font/google";
import "./globals.css";

const baloo2 = Baloo_2({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "700"],
  variable: "--font-baloo-2",
});

const quicksand = Quicksand({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "700"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Lớp học của Moon - Quỳnh Như",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon-180.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${baloo2.variable} ${quicksand.variable}`}>
      <body className="min-h-screen font-body text-base text-text">{children}</body>
    </html>
  );
}
