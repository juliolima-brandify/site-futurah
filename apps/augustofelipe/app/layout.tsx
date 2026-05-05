import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackerBoundary } from "@/components/tracker/TrackerBoundary";
import "./globals.css";

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
    <html lang="pt-BR">
      <body>
        <Suspense fallback={null}>
          <TrackerBoundary />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
