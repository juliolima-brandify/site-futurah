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
                  Ver as oportunidades
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
              A sua audiência já é o ativo.{" "}
              <span className="text-brand-highlight">Falta só colocar ela pra trabalhar</span> — sem queimar o que ela gosta em você.
            </h2>
            <p className="text-base md:text-lg text-white/70 font-light leading-relaxed max-w-3xl">
              A maioria dos criadores do seu porte pula direto pra um curso genérico e, no processo, perde a
              confiança que construiu. A nossa aposta é inversa: entrar pelas bordas com produtos leves,
              validar o que a audiência de fato compra, e só depois subir o ticket. O que você vai ver abaixo
              é o mapa do que é possível — o formato da parceria a gente desenha junto depois.
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
                  <li>→ Tabela de precificação editável</li>
                  <li>→ Pack de stencils e moldes para espelho</li>
                  <li>→ Guia &ldquo;Vidraceiro que aparece nas redes&rdquo;</li>
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
                  <li>→ Turmas fechadas e intimistas</li>
                  <li>→ Metodologia baseada no seu próprio caso</li>
                  <li>→ Lançamento só depois da validação</li>
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

        {/* POTENCIAL DE RECEITA */}
        <section className="w-full bg-brand-title text-white px-4 md:px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-sm font-medium uppercase tracking-wider text-brand-highlight">
                06 · O que está na mesa
              </span>
              <h2 className="text-4xl lg:text-[56px] font-medium leading-[1.05]">
                Todo dia sem estrutura é dinheiro que passa.
              </h2>
              <p className="text-base md:text-lg text-white/70 font-light leading-relaxed">
                Os números abaixo são ilustrativos, com premissas conservadoras de mercado. Servem só pra dar
                a ordem de grandeza do que a audiência atual já comporta — antes mesmo de crescer mais.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 flex flex-col gap-4">
                <span className="text-xs font-medium uppercase tracking-wider text-brand-highlight">
                  Frente 1 · Publi
                </span>
                <h3 className="text-2xl font-medium leading-tight">Patrocínios recorrentes</h3>
                <p className="text-sm text-white/70 font-light leading-relaxed">
                  Com media kit e prospecção ativa, um perfil do seu porte sustenta confortavelmente de 2 a 4
                  publis mensais com ticket médio de mercado na faixa de R$ 3 mil a R$ 8 mil por postagem.
                </p>
                <div className="pt-4 border-t border-white/10">
                  <span className="text-xs text-white/50 uppercase tracking-wider">Potencial mensal</span>
                  <p className="text-3xl font-medium mt-1">R$ 10k – R$ 30k</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 flex flex-col gap-4">
                <span className="text-xs font-medium uppercase tracking-wider text-brand-highlight">
                  Frente 2 · Digitais
                </span>
                <h3 className="text-2xl font-medium leading-tight">Produtos low-ticket</h3>
                <p className="text-sm text-white/70 font-light leading-relaxed">
                  Margem ~100%, entrega automática. Com uma base engajada do seu tamanho, uma taxa de conversão
                  de 1% em campanhas pontuais já gera volume relevante — e escala sem custo marginal.
                </p>
                <div className="pt-4 border-t border-white/10">
                  <span className="text-xs text-white/50 uppercase tracking-wider">Potencial mensal</span>
                  <p className="text-3xl font-medium mt-1">R$ 8k – R$ 20k</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-brand-highlight bg-brand-highlight/10 p-8 flex flex-col gap-4">
                <span className="text-xs font-medium uppercase tracking-wider text-brand-highlight">
                  Frente 3 · Mentoria
                </span>
                <h3 className="text-2xl font-medium leading-tight">Ticket alto</h3>
                <p className="text-sm text-white/70 font-light leading-relaxed">
                  Pensada pra rodar 2 a 3 vezes por ano, com turmas enxutas e ticket alto. É a camada que
                  transforma audiência em negócio de verdade, sem exigir esforço operacional diário.
                </p>
                <div className="pt-4 border-t border-white/10">
                  <span className="text-xs text-white/50 uppercase tracking-wider">Potencial por turma</span>
                  <p className="text-3xl font-medium mt-1">R$ 40k – R$ 100k</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-brand-highlight text-brand-title p-8 md:p-10 flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
              <div className="flex-1">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Somando as três frentes em regime
                </span>
                <p className="text-4xl md:text-5xl font-medium leading-tight mt-2">
                  + R$ 300k a R$ 700k/ano
                </p>
              </div>
              <p className="text-sm font-light leading-relaxed md:max-w-sm">
                em receita adicional possível, mantendo a essência do conteúdo. Hoje, boa parte disso é
                atenção que passa e não volta.
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
              <span className="text-xs font-medium uppercase tracking-wider text-brand-highlight">
                Formatos possíveis de parceria
              </span>
              <p className="text-base text-white/80 font-light leading-relaxed max-w-3xl">
                O modelo a gente desenha juntos conforme o seu apetite: pode ser{" "}
                <span className="font-bold text-white">fee mensal fixo</span> pela operação, uma{" "}
                <span className="font-bold text-white">divisão de receita (50/50 ou variável por produto)</span>{" "}
                nos infoprodutos que lançarmos, ou até uma{" "}
                <span className="font-bold text-white">sociedade em novos negócios</span> que nasçam dessa
                audiência. Cada formato tem vantagens — a conversa certa é sobre qual faz sentido pra você neste momento.
              </p>
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
              Isto aqui é um mapa, não uma cobrança. O próximo passo é uma conversa de 30 minutos pra você
              nos contar o que faz sentido pra sua vida hoje — e aí a gente desenha juntos o formato de parceria
              (fee, divisão de receita, sociedade, o que couber).
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button variant="primary" showIcon href="/aplicacao">
                Marcar a conversa
              </Button>
              <Button variant="secondary" href="mailto:contato@futurah.com.br?subject=Proposta%20Augusto%20Felipe">
                Responder por e-mail
              </Button>
            </div>
            <p className="text-xs text-brand-body/60 pt-6 border-t border-brand-title/10 w-full">
              Documento de caráter estratégico e ilustrativo. Os números mostrados são referências de mercado
              para dimensionar o potencial, não uma oferta comercial.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
