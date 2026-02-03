import type { Metadata, Viewport } from "next";

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
    icons: {
        icon: '/favicon.ico',
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
