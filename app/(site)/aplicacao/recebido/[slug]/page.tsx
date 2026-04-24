import { Suspense } from "react";
import AguardandoAnalise from "./AguardandoAnalise";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const metadata = {
  title: "Processando sua análise | Futurah & Co.",
  robots: { index: false, follow: false },
};

export default async function RecebidoPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="bg-[#F5F5F5] min-h-screen">
      <div className="max-w-[720px] mx-auto px-4 md:px-8 py-20">
        <Suspense fallback={<div>Carregando...</div>}>
          <AguardandoAnalise slug={slug} />
        </Suspense>
      </div>
    </main>
  );
}
