import ApplicationWizard from '@/components/sections/ApplicationWizard';
import { Suspense } from 'react';

export default function AplicacaoPage() {
  return (
    <main className="bg-[#F5F5F5] min-h-screen">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
        <ApplicationWizard />
      </Suspense>
    </main>
  );
}
