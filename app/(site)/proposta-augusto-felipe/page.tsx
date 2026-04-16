import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Proposta Augusto Felipe | Futurah and Co.",
  description:
    "Uma proposta sob medida para transformar a audiência do @fidevidraceiro em um ecossistema de monetização sustentável.",
  robots: { index: false, follow: false },
};

export default function PropostaAugustoFelipe() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* HERO */}
        <section className="relative min-h-[85vh] flex items-end bg-white overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-20">
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl space-y-6 lg:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-title/10 bg-brand-background">
                <span className="w-2 h-2 rounded-full bg-brand-button-hover animate-pulse" />
                <span className="text-xs font-medium uppercase tracking-wider text-brand-title">
                  Proposta confidencial · Exclusiva
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-[72px] font-normal uppercase text-brand-title leading-[1.05]">
                Augusto,<br />
                sua audiência <br />
                vale <span className="italic font-medium">muito</span> mais <br />
                do que ela rende hoje.
              </h1>

              <p className="text-base md:text-lg text-brand-body leading-relaxed max-w-2xl font-light">
                Você construiu algo raro: uma audiência híbrida — fãs de entretenimento e profissionais do ofício — em volta de um ativo
                irrepetível, a relação com seu pai. Esta é uma proposta para{" "}
                <span className="font-bold text-brand-title">monetizar sem queimar essa magia.</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button variant="primary" showIcon href="#proposta">
                  Ver proposta completa
                </Button>
                <a
                  href="#contato"
                  className="text-sm font-medium text-brand-title underline underline-offset-4 hover:text-brand-button-hover transition-colors"
                >
                  Falar direto com a Futurah
                </a>
              </div>
            </div>
          </div>

          {/* badge decorativo */}
          <div className="absolute top-28 right-4 lg:right-12 hidden md:flex flex-col items-end gap-2">
            <div className="px-5 py-2 rounded-full bg-brand-highlight text-brand-title text-sm font-medium">
              Preparada por Futurah and Co.
            </div>
            <span className="text-xs text-brand-body/60">Abril de 2026</span>
          </div>
        </section>

        {/* DIAGNÓSTICO */}
        <section className="w-full bg-brand-background px-4 md:px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
                01 · Diagnóstico
              </span>
              <h2 className="text-4xl lg:text-[56px] font-medium text-brand-title leading-[1.05]">
                O que a gente vê no seu perfil.
              </h2>
              <p className="text-base md:text-lg text-brand-body font-light leading-relaxed">
                Antes de sugerir qualquer coisa, o exercício é entender o ativo. E o seu é incomum.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  title: "Audiência híbrida",
                  body: "Fãs de entretenimento (humor, relação pai/filho) coabitam com um nicho técnico altíssimo (vidraceiros). Dois mercados em uma só base.",
                },
                {
                  title: "Prova social viva",
                  body: "A vidraçaria cresceu desde o primeiro espelho viral. Você é o próprio case — e esse tipo de autoridade não se compra em tráfego pago.",
                },
                {
                  title: "Demanda reprimida",
                  body: "Pedidos de espelhos customizados e de dicas para vidraceiros aparecem nos comentários. Há oferta esperando do outro lado da tela.",
                },
                {
                  title: "Zero monetização estruturada",
                  body: "Hoje não existe ponto de captura, funil, produto próprio ou publi recorrente. A atenção é gerada e perdida todo dia.",
                },
                {
                  title: "Ativo de marca frágil",
                  body: "A autenticidade é o que sustenta tudo. Qualquer produto mal calibrado corrói o que levou anos pra construir.",
                },
                {
                  title: "Timing favorável",
                  body: "A base ainda está em expansão. Monetizar agora, com calma e estratégia, custa muito menos do que tentar consertar depois.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-white rounded-[24px] p-7 border border-brand-title/5 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-xl font-medium text-brand-title mb-3 leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm text-brand-body font-light leading-relaxed">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESE */}
        <section className="w-full bg-brand-title text-white px-4 md:px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-5xl mx-auto flex flex-col gap-8">
            <span className="text-sm font-medium uppercase tracking-wider text-brand-highlight">
              02 · Nossa tese
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-[56px] font-medium leading-[1.1]">
              A sua audiência não precisa de{" "}
              <span className="text-brand-highlight">mais um lançamento.</span>{" "}
              Precisa de um <span className="italic">ecossistema</span> que respeite o motivo dela estar ali.
            </h2>
            <p className="text-base md:text-lg text-white/70 font-light leading-relaxed max-w-3xl">
              A maioria dos criadores do seu porte pula direto pra um curso de R$997 ou uma mentoria genérica — e,
              no processo, perde a confiança que construiu. A nossa aposta é inversa: entrar pelas bordas,
              validar com produtos leves, e só depois subir o ticket. Receita previsível, marca preservada.
            </p>
          </div>
        </section>

        {/* PROPOSTA · 3 FRENTES */}
        <section id="proposta" className="w-full bg-white px-4 md:px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto flex flex-col gap-12">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
                03 · A proposta
              </span>
              <h2 className="text-4xl lg:text-[56px] font-medium text-brand-title leading-[1.05]">
                Três frentes. Uma ordem certa.
              </h2>
              <p className="text-base md:text-lg text-brand-body font-light leading-relaxed">
                Cada frente tem tempo, risco e retorno diferentes. Rodadas em paralelo, se financiam.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Frente 1 */}
              <div className="bg-brand-background rounded-[28px] p-8 flex flex-col gap-5 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-brand-title/5">
                <div className="flex items-start justify-between">
                  <span className="text-5xl font-medium text-brand-title/20">01</span>
                  <span className="px-3 py-1 rounded-full bg-brand-highlight text-xs font-medium text-brand-title uppercase tracking-wider">
                    Caixa rápido
                  </span>
                </div>
                <h3 className="text-2xl font-medium text-brand-title leading-tight">
                  Publi & parcerias estratégicas
                </h3>
                <p className="text-sm text-brand-body font-light leading-relaxed">
                  Prospecção ativa com marcas que combinam com seu conteúdo — ferramentas (Tramontina, Vonder),
                  EPI, vidros (Cebrace, Guardian), apps de gestão pra MEI. Fluxo de caixa imediato, zero risco
                  de brand se curado direito.
                </p>
                <ul className="text-sm text-brand-body font-light space-y-2 pt-2 border-t border-brand-title/10">
                  <li>→ Media kit profissional</li>
                  <li>→ Tabela de preços por formato</li>
                  <li>→ Contrato modelo e critérios de aprovação</li>
                  <li>→ Meta: 2–4 publis/mês até o fim do trimestre</li>
                </ul>
              </div>

              {/* Frente 2 */}
              <div className="bg-brand-background rounded-[28px] p-8 flex flex-col gap-5 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-brand-title/5">
                <div className="flex items-start justify-between">
                  <span className="text-5xl font-medium text-brand-title/20">02</span>
                  <span className="px-3 py-1 rounded-full bg-brand-title text-xs font-medium text-white uppercase tracking-wider">
                    Baixo risco
                  </span>
                </div>
                <h3 className="text-2xl font-medium text-brand-title leading-tight">
                  Produtos digitais low-ticket
                </h3>
                <p className="text-sm text-brand-body font-light leading-relaxed">
                  Produtos que resolvem dor real do vidraceiro que te segue. Margem ~100%, entrega automática,
                  zero logística. Servem pra validar demanda antes de qualquer curso mais caro.
                </p>
                <ul className="text-sm text-brand-body font-light space-y-2 pt-2 border-t border-brand-title/10">
                  <li>→ Tabela de precificação editável — R$ 37</li>
                  <li>→ Pack de stencils/moldes — R$ 27</li>
                  <li>→ Guia "Vidraceiro que aparece" — R$ 47</li>
                  <li>→ Captura de e-mail em todo ponto de contato</li>
                </ul>
              </div>

              {/* Frente 3 */}
              <div className="bg-brand-title text-white rounded-[28px] p-8 flex flex-col gap-5 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between">
                  <span className="text-5xl font-medium text-white/20">03</span>
                  <span className="px-3 py-1 rounded-full bg-brand-highlight text-xs font-medium text-brand-title uppercase tracking-wider">
                    Ticket alto
                  </span>
                </div>
                <h3 className="text-2xl font-medium leading-tight">
                  Mentoria em grupo — fase 2
                </h3>
                <p className="text-sm text-white/70 font-light leading-relaxed">
                  Só depois que os low-tickets validarem a disposição de pagar, construímos uma mentoria focada
                  em vidraceiros que querem crescer pelo digital. Ticket mais alto, turmas fechadas, preserva
                  seu tempo e sua marca.
                </p>
                <ul className="text-sm text-white/70 font-light space-y-2 pt-2 border-t border-white/10">
                  <li>→ Lista de espera a partir dos low-tickets</li>
                  <li>→ Turmas de 20–40 alunos</li>
                  <li>→ Ticket estimado R$ 1.500–2.500</li>
                  <li>→ Lançamento previsto: após 90 dias</li>
                </ul>
              </div>
            </div>

            <div className="rounded-[24px] bg-brand-highlight/30 border border-brand-highlight px-6 py-5 text-sm text-brand-title font-light leading-relaxed">
              <span className="font-bold">Obs. importante:</span> e-commerce de espelhos customizados foi
              descartado nessa primeira fase. A operação física (produção, quebra, frete) exige estrutura que
              não se monta em 90 dias sem comprometer a qualidade. Fica pra uma fase 3, já com caixa.
            </div>
          </div>
        </section>

        {/* FASES / TIMELINE */}
        <section className="w-full bg-brand-background px-4 md:px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto flex flex-col gap-12">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
                04 · Como a gente executa
              </span>
              <h2 className="text-4xl lg:text-[56px] font-medium text-brand-title leading-[1.05]">
                90 dias, três fases.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  phase: "Fase 1",
                  weeks: "Semanas 1 a 4",
                  title: "Base e caixa rápido",
                  bullets: [
                    "Media kit + tabela de publis",
                    "Prospecção ativa de marcas",
                    "Captura de e-mail em todos os pontos",
                    "Definição de identidade comercial",
                  ],
                },
                {
                  phase: "Fase 2",
                  weeks: "Semanas 5 a 8",
                  title: "Validação low-ticket",
                  bullets: [
                    "Lançamento da tabela de precificação",
                    "Pack de stencils + guia digital",
                    "Funil de e-mail automatizado",
                    "Primeiras campanhas pagas leves",
                  ],
                },
                {
                  phase: "Fase 3",
                  weeks: "Semanas 9 a 12",
                  title: "Subida de ticket",
                  bullets: [
                    "Abertura da lista de espera da mentoria",
                    "Captação qualificada com anúncios",
                    "Preparo do lançamento principal",
                    "Relatório e plano para próximo trimestre",
                  ],
                },
              ].map((f) => (
                <div
                  key={f.phase}
                  className="bg-white rounded-[24px] p-7 flex flex-col gap-4 border border-brand-title/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-brand-button-hover">
                      {f.phase}
                    </span>
                    <span className="text-xs text-brand-body/60">{f.weeks}</span>
                  </div>
                  <h3 className="text-xl font-medium text-brand-title leading-tight">
                    {f.title}
                  </h3>
                  <ul className="space-y-2 pt-2 border-t border-brand-title/10">
                    {f.bullets.map((b) => (
                      <li key={b} className="text-sm text-brand-body font-light leading-relaxed">
                        → {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* O QUE ENTREGAMOS */}
        <section className="w-full bg-white px-4 md:px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
                05 · O que entra no pacote
              </span>
              <h2 className="text-4xl lg:text-[56px] font-medium text-brand-title leading-[1.05]">
                Tudo feito com a gente. Nada terceirizado pra fora.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Estratégia comercial e de produto",
                "Identidade visual dos produtos digitais",
                "Páginas de venda e checkout integrado",
                "Funis de e-mail e automações",
                "Prospecção e negociação de publis",
                "Copy de lançamento e roteiros de reels",
                "Dashboards com métricas reais, não 'vaidade'",
                "Acompanhamento semanal com você",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4 p-5 rounded-[20px] bg-brand-background hover:bg-brand-highlight/20 transition-all duration-300"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-title text-white flex items-center justify-center text-xs font-medium">
                    ✓
                  </span>
                  <p className="text-base text-brand-body font-light leading-relaxed pt-1">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INVESTIMENTO */}
        <section className="w-full bg-brand-title text-white px-4 md:px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-5xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-sm font-medium uppercase tracking-wider text-brand-highlight">
                06 · Investimento
              </span>
              <h2 className="text-4xl lg:text-[56px] font-medium leading-[1.05]">
                Transparente, como a gente gosta.
              </h2>
              <p className="text-base md:text-lg text-white/70 font-light leading-relaxed">
                Um fee mensal cobre a operação e a estratégia. Não cobramos percentual sobre publis nem
                comissão sobre vendas — o incentivo é simples: seu negócio funcionar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 flex flex-col gap-4">
                <span className="text-xs font-medium uppercase tracking-wider text-brand-highlight">
                  Plano recomendado
                </span>
                <h3 className="text-3xl font-medium leading-tight">Parceria 90 dias</h3>
                <p className="text-sm text-white/70 font-light leading-relaxed">
                  Execução completa das três frentes, reuniões semanais, entregáveis listados acima.
                </p>
                <div className="pt-4 border-t border-white/10 flex items-end gap-2">
                  <span className="text-4xl font-medium">R$ 8.500</span>
                  <span className="text-sm text-white/60 pb-1">/mês</span>
                </div>
                <p className="text-xs text-white/50">
                  Setup inicial incluso · Contrato mínimo de 3 meses
                </p>
              </div>

              <div className="rounded-[28px] border border-brand-highlight bg-brand-highlight/10 p-8 flex flex-col gap-4">
                <span className="text-xs font-medium uppercase tracking-wider text-brand-highlight">
                  Formato alternativo
                </span>
                <h3 className="text-3xl font-medium leading-tight">Diagnóstico + roadmap</h3>
                <p className="text-sm text-white/70 font-light leading-relaxed">
                  Se preferir validar antes de fechar: um mês de imersão, entrega de plano completo e você
                  decide se segue com a gente na execução.
                </p>
                <div className="pt-4 border-t border-white/10 flex items-end gap-2">
                  <span className="text-4xl font-medium">R$ 3.500</span>
                  <span className="text-sm text-white/60 pb-1">/único</span>
                </div>
                <p className="text-xs text-white/50">
                  Abatido do fee se fechar a parceria depois
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section id="contato" className="w-full bg-brand-background px-4 md:px-8 lg:px-12 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto flex flex-col items-start gap-8">
            <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
              07 · Próximo passo
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium text-brand-title leading-[1.05]">
              Bora transformar <br />
              atenção em <span className="italic">negócio</span>?
            </h2>
            <p className="text-base md:text-lg text-brand-body font-light leading-relaxed max-w-2xl">
              Se fez sentido, o próximo passo é uma call de 30 minutos pra alinhar expectativas, tirar dúvidas
              e começar a desenhar o que é prioridade na sua realidade. Sem compromisso.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button variant="primary" showIcon href="/aplicacao">
                Agendar conversa
              </Button>
              <Button variant="secondary" href="mailto:contato@futurah.com.br?subject=Proposta%20Augusto%20Felipe">
                Responder por e-mail
              </Button>
            </div>
            <p className="text-xs text-brand-body/60 pt-6 border-t border-brand-title/10 w-full">
              Esta proposta é válida por 30 dias a partir da data de envio. Condições podem ser ajustadas após
              a primeira conversa, conforme escopo real.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
