import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🧠 AI Quests for Kids!",
  description: "Learn how AI works through fun interactive quests",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
