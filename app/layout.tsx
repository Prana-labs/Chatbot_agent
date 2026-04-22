import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouTube ChatBot",
  description: "Ask anything about a YouTube video",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
