import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VidyaSathi (विद्यासाथी) — AI Screening & IEP Copilot",
  description: "15-Minute Gamified Multimodal AI Early Screening for Specific Learning Disabilities & Automated IEP Generation. PRASUNEX INNOVATHON 2026.",
};

export const viewport: Viewport = {
  themeColor: "#070B14",
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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-cosmic-950 text-slate-100 antialiased selection:bg-nebula-purple selection:text-white">
        {children}
      </body>
    </html>
  );
}
