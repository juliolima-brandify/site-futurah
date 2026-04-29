import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fi de Vidraceiro",
  description: "Augusto Felipe — @fidevidraceiro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
