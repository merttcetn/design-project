import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hastane Rotam · Hacettepe Hastanesi Kapalı Alan Navigasyonu",
  description:
    "Hacettepe Hastanesi için LLM destekli, çizge tabanlı bir kapalı alan navigasyon sistemi. BBM479 · Grup 53",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
