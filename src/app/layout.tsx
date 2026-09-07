import type { Metadata } from "next";
import "./globals.css";
import { AmbientBackground } from "@/components/background/AmbientBackground";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Elementa — Precision Periodic Laboratory & Atomic Directory",
  description:
    "An authoritative, research-grade periodic table cataloging all 118 chemical elements with quantum electron configurations, thermodynamic phase modeling, and periodic trends.",
  keywords: [
    "Periodic Table",
    "Chemistry",
    "Chemical Elements",
    "Physics",
    "Atomic Model",
    "Periodic Trends",
    "Thermodynamics",
    "IUPAC",
  ],
  authors: [{ name: "Elementa Laboratory" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#07090e] text-slate-100 font-sans min-h-screen relative antialiased selection:bg-cyan-500/20 selection:text-cyan-200">
        <LanguageProvider>
          <AmbientBackground />
          <div className="relative z-10">{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
