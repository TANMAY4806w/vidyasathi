import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "VidyaSathi (विद्यासाथी) — AI Early Screening & IEP Copilot",
  description: "15-Minute Gamified Multimodal Early Screening for Specific Learning Disabilities & Automated Bilingual IEP Generation. PRASUNEX INNOVATHON 2026.",
};

export const viewport: Viewport = {
  themeColor: "#4353FF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface text-ink antialiased selection:bg-brand-100 selection:text-brand-700">
        {children}
      </body>
    </html>
  );
}
