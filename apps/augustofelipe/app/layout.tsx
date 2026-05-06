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
