'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Status =
  | 'pendente_dados'
  | 'scraping'
  | 'gerando'
  | 'pendente_revisao'
  | 'publicada'
  | 'falhou';

const COPY_POR_STATUS: Record<Status, { titulo: string; body: string }> = {
  pendente_dados: {
    titulo: 'Sua aplicação foi recebida',
    body: 'Estamos preparando a análise. Isso pode levar até 2 minutos.',
  },
  scraping: {
    titulo: 'Mapeando sua presença digital',
    body: 'Coletando dados públicos do seu perfil e mercado.',
  },
  gerando: {
    titulo: 'Gerando sua análise estratégica',
    body: 'Nossa IA está cruzando seus dados com o catálogo de substituição da Futurah. Quase lá.',
  },
  pendente_revisao: {
    titulo: 'Um consultor está dando uma última conferida',
    body: 'Seu relatório ficará disponível em instantes. Pode manter essa aba aberta.',
  },
  publicada: {
    titulo: 'Pronto. Abrindo sua análise.',
    body: 'Redirecionando...',
  },
  falhou: {
    titulo: 'Algo deu errado',
    body: 'Não conseguimos gerar sua análise agora. Um consultor entrará em contato pelo WhatsApp para continuar manualmente.',
  },
};

export default function AguardandoAnalise({ slug }: { slug: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('pendente_dados');
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = async () => {
      try {
        const res = await fetch(`/api/aplicacao/${slug}/status`, {
          cache: 'no-store',
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setErro(body?.error || 'erro ao consultar status');
          return;
        }
        const data = (await res.json()) as { status: Status };
        if (cancelled) return;

        setStatus(data.status);

        if (data.status === 'publicada') {
          router.replace(`/analise/${slug}`);
          return;
        }

        if (data.status === 'falhou') {
          return; // para de pollar
        }

        timer = setTimeout(tick, 3000);
      } catch {
        if (!cancelled) {
          timer = setTimeout(tick, 5000);
        }
      }
    };

    tick();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [slug, router]);

  const copy = COPY_POR_STATUS[status];

  return (
    <div className="bg-white border border-black/5 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] px-8 py-12 md:px-12 md:py-16 flex flex-col items-center text-center gap-6">
      {status !== 'falhou' && status !== 'publicada' && (
        <div className="w-14 h-14 border-4 border-black/10 border-t-[#0B2FFF] rounded-full animate-spin" />
      )}
      <div className="space-y-3 max-w-[520px]">
        <h1 className="text-[28px] md:text-[32px] font-medium text-[#111] leading-tight">
          {copy.titulo}
        </h1>
        <p className="text-black/60 text-[15px] leading-relaxed">{copy.body}</p>
      </div>

      {erro && (
        <p className="text-sm text-red-500">Erro ao consultar status: {erro}</p>
      )}

      {status === 'falhou' && (
        <a
          href="mailto:contato@futurah.co"
          className="text-sm font-medium text-[#0B2FFF] underline underline-offset-4"
        >
          Falar com um consultor
        </a>
      )}

      <div className="text-[11px] tracking-[0.2em] font-bold text-black/40 uppercase pt-4">
        Ref: {slug}
      </div>
    </div>
  );
}
