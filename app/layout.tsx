import { inter } from "@/lib/fonts";
import "./(site)/globals.css";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" className={inter.variable}>
            <body className={inter.className} style={{ fontFamily: 'var(--font-neue-haas)' }}>
                {children}
            </body>
        </html>
    );
}
