import type { Metadata, Viewport } from "next";
import { inter } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Futura and Co. - Marketing do Futuro com Impacto no Presente",
  description: "A maior escola de IA para profissionais criativos. Aprenda a dirigir tecnologia com criatividade.",
  keywords: ["marketing", "inteligência artificial", "IA", "criatividade", "tecnologia", "cursos"],
  authors: [{ name: "Futura and Co." }],
  openGraph: {
    title: "Futura and Co. - Marketing do Futuro com Impacto no Presente",
    description: "A maior escola de IA para profissionais criativos.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Futura and Co. - Marketing do Futuro com Impacto no Presente",
    description: "A maior escola de IA para profissionais criativos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
