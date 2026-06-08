import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Suspense } from "react";
import { TrackerBoundary } from "@/components/tracker/TrackerBoundary";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Augusto Felipe",
  description: "Augusto Felipe — hub de landing pages, quizzes e análises.",
  other: {
    // Verificação de domínio no Meta Business (AEM / iOS 14.5+).
    "facebook-domain-verification": "gef606lynfadexvjwsqatozy3nis2y",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body className="font-sans">
        <Suspense fallback={null}>
          <TrackerBoundary />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
