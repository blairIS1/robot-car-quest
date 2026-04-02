import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🛻 Build a Robot Car!",
  description: "Learn how a Tesla works by building your own robot car",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
