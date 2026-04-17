import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Análise · @fidevidraceiro | Futurah and Co.",
  description:
    "Uma leitura estratégica do potencial de monetização do perfil @fidevidraceiro — Augusto Felipe.",
  robots: { index: false, follow: false },
};

export default function PropostaAugustoFelipe() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* HERO */}
        <section className="relative min-h-[85vh] flex items-center justify-center bg-white overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6 lg:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-title/10 bg-brand-background">
                <span className="w-2 h-2 rounded-full bg-brand-button-hover animate-pulse" />
                <span className="text-xs font-medium uppercase tracking-wider text-brand-title">
                  Análise estratégica · @fidevidraceiro
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-[72px] font-normal uppercase text-brand-title leading-[1.05]">
                Uma leitura do <br />
                potencial que o seu <br />
                perfil carrega <span className="italic font-medium">hoje.</span>
              </h1>

              <p className="text-base md:text-lg text-brand-body leading-relaxed max-w-2xl font-light">
                Augusto, este documento não é uma oferta. É uma conversa em forma de análise, olhando pro
                seu perfil como profissionais de marketing olhariam — e mapeando o que já está pronto pra
                virar negócio, sem atropelar o que te trouxe até aqui.
              </p>

              <div className="flex flex-col items-center gap-3 pt-2">
                <a
                  href="#leitura"
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-title underline underline-offset-4 hover:text-brand-button-hover transition-colors"
                >
                  Começar a leitura ↓
                </a>
                <span className="text-xs text-brand-body/60">
                  Preparada pela Futurah and Co. · Abril de 2026
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* RETRATO · DADOS */}
        <section id="leitura" className="w-full bg-white px-4 md:px-8 lg:px-12 pb-16 lg:pb-24 border-t border-brand-title/5">
          <div className="max-w-6xl mx-auto pt-16 lg:pt-24 flex flex-col gap-10">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
                Retrato do perfil
              </span>
              <h2 className="text-4xl lg:text-[56px] font-medium text-brand-title leading-[1.05]">
                Quem é o Augusto, em números reais.
              </h2>
              <p className="text-base md:text-lg text-brand-body font-light leading-relaxed">
                Antes de qualquer conversa sobre monetização, o exercício é olhar com calma pro ativo. E
                o que se vê de fora é raro:
              </p>
            </div>

            {/* MOCK · Instagram bio */}
            <div className="bg-black rounded-[24px] p-6 md:p-10 lg:p-12 text-white border border-white/10 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start gap-6 md:gap-10 lg:gap-14">
                {/* Avatar — foto real */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden ring-1 ring-white/10 shadow-xl">
                    <Image
                      src="/proposta-augusto/augusto.jpg"
                      alt="Augusto Felipe"
                      width={176}
                      height={176}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Bio info */}
                <div className="flex-1 w-full min-w-0">
                  {/* username + verified */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-xl md:text-2xl lg:text-[28px] font-normal text-white">
                      fidevidraceiro
                    </h3>
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0"
                      viewBox="0 0 40 40"
                      aria-hidden="true"
                    >
                      <path
                        d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v6.354h6.234L14.638 40l5.36-3.094L25.358 40l2.972-5.15h6.234v-6.354L40 25.359 36.905 20 40 14.641l-5.432-3.137V5.15h-6.234L25.358 0l-5.36 3.094Z"
                        fill="#0095f6"
                      />
                      <path
                        d="m11 20.5 5.5 5.5 12.5-12.5"
                        stroke="#fff"
                        strokeWidth="3.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-white/40 text-xl leading-none ml-1">···</span>
                  </div>

                  {/* display name */}
                  <p className="text-sm text-white/70 mb-4">Augusto Felipe</p>

                  {/* stats */}
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5 text-sm md:text-[15px]">
                    <span>
                      <strong className="font-semibold text-white">594</strong>{" "}
                      <span className="text-white/70">posts</span>
                    </span>
                    <span>
                      <strong className="font-semibold text-white">739 mil</strong>{" "}
                      <span className="text-white/70">seguidores</span>
                    </span>
                    <span>
                      <strong className="font-semibold text-white">3.029</strong>{" "}
                      <span className="text-white/70">seguindo</span>
                    </span>
                  </div>

                  {/* bio text */}
                  <div className="text-sm leading-relaxed space-y-0.5">
                    <p className="text-white/60">Criador(a) de conteúdo digital</p>
                    <p className="font-medium text-white">
                      Toda semana transformo ideias malucas em arte{" "}
                      <span aria-hidden>🖼️</span>
                    </p>
                    <p className="text-white/85 flex items-center gap-1.5">
                      <span aria-hidden>🎨</span>
                      <span>@fidevidraceiro.art</span>
                    </p>
                    <p className="text-white/85 flex items-center gap-1.5">
                      <span aria-hidden>📩</span>
                      <span>fidevidraceiro@outlook.com</span>
                    </p>
                    <p className="text-[#0095f6] font-medium flex items-center gap-1.5 pt-0.5">
                      <span aria-hidden>🔗</span>
                      <span>linktr.ee/fidevidraceiro</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* rodapé sutil */}
              <p className="text-[11px] text-white/30 mt-8 pt-4 border-t border-white/5">
                Mock visual baseado no perfil público @fidevidraceiro · Instagram
              </p>
            </div>

            {/* Stats complementares */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { num: "23", label: "anos · formado em administração" },
                { num: "1M+", label: "views no vídeo viral do globo de luz" },
                { num: "IG + TikTok", label: "presença ativa nas duas plataformas" },
              ].map((s) => (
                <div key={s.label} className="bg-brand-background rounded-[24px] p-6 flex flex-col gap-2">
                  <span className="text-3xl md:text-4xl font-medium text-brand-title leading-none">
                    {s.num}
                  </span>
                  <span className="text-xs md:text-sm text-brand-body font-light leading-snug">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-sm text-brand-body/70 font-light max-w-3xl">
              Mais relevante que o número bruto: a base é <span className="font-medium text-brand-title">engajada, híbrida
              (fãs + vidraceiros)</span>, com perfil verificado, e foi construída em torno de algo raro — a relação
              com o seu pai e o bastidor de uma vidraçaria de cidade do interior. Isso não se compra em tráfego pago.
            </p>
          </div>
        </section>

        {/* DIAGNÓSTICO */}
        <section className="w-full bg-brand-background px-4 md:px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
                Diagnóstico
              </span>
              <h2 className="text-4xl lg:text-[56px] font-medium text-brand-title leading-[1.05]">
                Seis coisas que a gente notou no seu perfil.
              </h2>
              <p className="text-base md:text-lg text-brand-body font-light leading-relaxed">
                Leitura de fora pra dentro, como faríamos com qualquer criador antes de pensar em estratégia.
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
              A tese
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-[56px] font-medium leading-[1.1] text-white">
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

        {/* FRENTES · 3 CAMINHOS */}
        <section id="proposta" className="w-full bg-white px-4 md:px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto flex flex-col gap-12">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
                Frentes de monetização
              </span>
              <h2 className="text-4xl lg:text-[56px] font-medium text-brand-title leading-[1.05]">
                Por onde esse perfil poderia começar a gerar receita.
              </h2>
              <p className="text-base md:text-lg text-brand-body font-light leading-relaxed">
                Três caminhos possíveis, com tempos e riscos diferentes. Nenhum exclui o outro — na prática,
                rodam em paralelo e um financia o outro.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Frente 1 */}
              <div className="bg-brand-background rounded-[28px] p-8 flex flex-col gap-5 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-brand-title/5">
                <div className="flex items-start justify-between">
                  <span className="text-5xl font-medium text-brand-title/30">01</span>
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
                  <span className="text-5xl font-medium text-brand-title/30">02</span>
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
                  <span className="text-5xl font-medium text-white/30">03</span>
                  <span className="px-3 py-1 rounded-full bg-brand-highlight text-xs font-medium text-brand-title uppercase tracking-wider">
                    Ticket alto
                  </span>
                </div>
                <h3 className="text-2xl font-medium leading-tight text-white">
                  Mentoria em grupo — fase 2
                </h3>
                <p className="text-sm text-white/85 font-light leading-relaxed">
                  Só depois que os low-tickets validarem a disposição de pagar, construímos uma mentoria focada
                  em vidraceiros que querem crescer pelo digital. Ticket mais alto, turmas fechadas, preserva
                  seu tempo e sua marca.
                </p>
                <ul className="text-sm text-white/85 font-light space-y-2 pt-2 border-t border-white/15">
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

        {/* BANCO DE IDEIAS */}
        <section className="w-full bg-white px-4 md:px-8 lg:px-12 py-16 lg:py-24 border-t border-brand-title/5">
          <div className="max-w-6xl mx-auto flex flex-col gap-12">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
                Banco de ideias
              </span>
              <h2 className="text-4xl lg:text-[56px] font-medium text-brand-title leading-[1.05]">
                Coisas que a gente pensou olhando pro seu perfil.
              </h2>
              <p className="text-base md:text-lg text-brand-body font-light leading-relaxed">
                Essa lista é pra você guardar. Nem tudo aqui faz sentido agora, nem tudo é pra sempre — mas
                tudo é factível com o que você já tem. A gente jogou isso no papel como quem pensa junto, na
                mesa de bar, sem compromisso de executar tudo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categoria 1 */}
              <div className="bg-brand-background rounded-[28px] p-8 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-brand-title text-brand-highlight flex items-center justify-center text-sm font-medium">
                    01
                  </span>
                  <h3 className="text-xl font-medium text-brand-title">Cursos & mentoria</h3>
                </div>
                <ul className="text-sm text-brand-body font-light space-y-2.5 leading-relaxed">
                  <li>→ Curso &ldquo;Vidraceiro que Vende&rdquo; — como captar clientes pelo Instagram</li>
                  <li>→ Mini-curso &ldquo;Do zero ao primeiro espelho personalizado&rdquo;</li>
                  <li>→ Masterclass de precificação para vidraçaria</li>
                  <li>→ Mentoria em grupo para vidraceiros que querem crescer</li>
                  <li>→ Workshop gravado &ldquo;Como viralizei sendo vidraceiro&rdquo;</li>
                  <li>→ Curso &ldquo;Empresa familiar sem brigar com o pai&rdquo; (meta, só seu)</li>
                </ul>
              </div>

              {/* Categoria 2 */}
              <div className="bg-brand-background rounded-[28px] p-8 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-brand-title text-brand-highlight flex items-center justify-center text-sm font-medium">
                    02
                  </span>
                  <h3 className="text-xl font-medium text-brand-title">Produtos digitais · baixo ticket</h3>
                </div>
                <ul className="text-sm text-brand-body font-light space-y-2.5 leading-relaxed">
                  <li>→ Tabela de precificação editável (planilha pronta)</li>
                  <li>→ Pack de stencils/moldes para espelhos</li>
                  <li>→ E-book &ldquo;Guia de orçamento para vidraçaria&rdquo;</li>
                  <li>→ Kit de templates de stories e reels</li>
                  <li>→ Scripts de WhatsApp para atendimento de cliente difícil</li>
                  <li>→ Checklist de segurança na obra</li>
                  <li>→ Pack &ldquo;Receitas de conteúdo&rdquo; (roteiros prontos)</li>
                </ul>
              </div>

              {/* Categoria 3 */}
              <div className="bg-brand-background rounded-[28px] p-8 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-brand-title text-brand-highlight flex items-center justify-center text-sm font-medium">
                    03
                  </span>
                  <h3 className="text-xl font-medium text-brand-title">Produtos físicos & loja</h3>
                </div>
                <ul className="text-sm text-brand-body font-light space-y-2.5 leading-relaxed">
                  <li>→ Linha de espelhos autorais (capivara, personalizados, minis)</li>
                  <li>→ Kit &ldquo;Faça você mesmo&rdquo; — cortador + tutorial digital</li>
                  <li>→ Merch: bonés, camisetas, moletom do canal</li>
                  <li>→ Adesivos e decalques com arte das peças virais</li>
                  <li>→ Caixa-presente &ldquo;Presenteie um Vidraceiro&rdquo;</li>
                  <li>→ Licenciamento da marca pra outras vidraçarias</li>
                  <li className="text-brand-body/60 pt-1 italic">obs: logística pesada, fica pra fase avançada</li>
                </ul>
              </div>

              {/* Categoria 4 */}
              <div className="bg-brand-background rounded-[28px] p-8 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-brand-title text-brand-highlight flex items-center justify-center text-sm font-medium">
                    04
                  </span>
                  <h3 className="text-xl font-medium text-brand-title">Patrocínios & parcerias</h3>
                </div>
                <ul className="text-sm text-brand-body font-light space-y-2.5 leading-relaxed">
                  <li>→ Ferramentas (Tramontina, Vonder, DeWalt, Bosch)</li>
                  <li>→ EPI e segurança (luvas, óculos, capacetes)</li>
                  <li>→ Fabricantes de vidro (Cebrace, Guardian, Saint-Gobain)</li>
                  <li>→ Selantes e adesivos (você já usa a Silvaselantes)</li>
                  <li>→ Apps de gestão pra MEI (Conta Azul, Nubank PJ)</li>
                  <li>→ Plataformas de afiliado (Hotmart, Kiwify, Eduzz)</li>
                  <li>→ Embaixador de longo prazo (anual, não pontual)</li>
                </ul>
              </div>

              {/* Categoria 5 */}
              <div className="bg-brand-background rounded-[28px] p-8 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-brand-title text-brand-highlight flex items-center justify-center text-sm font-medium">
                    05
                  </span>
                  <h3 className="text-xl font-medium text-brand-title">Comunidade & recorrência</h3>
                </div>
                <ul className="text-sm text-brand-body font-light space-y-2.5 leading-relaxed">
                  <li>→ &ldquo;Clube do Claudão&rdquo; — membership mensal pros fãs</li>
                  <li>→ Rede PRO de vidraceiros (networking pago mensal)</li>
                  <li>→ Newsletter premium com bastidores e dicas</li>
                  <li>→ Grupo fechado no Telegram/WhatsApp</li>
                  <li>→ Lives exclusivas com o pai, bastidores, bloopers</li>
                  <li>→ Programa de indicação entre vidraceiros</li>
                </ul>
              </div>

              {/* Categoria 6 */}
              <div className="bg-brand-background rounded-[28px] p-8 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-brand-title text-brand-highlight flex items-center justify-center text-sm font-medium">
                    06
                  </span>
                  <h3 className="text-xl font-medium text-brand-title">IA, bots & automações</h3>
                </div>
                <ul className="text-sm text-brand-body font-light space-y-2.5 leading-relaxed">
                  <li>→ Bot de WhatsApp &ldquo;Orçamento Rápido de Vidraçaria&rdquo;</li>
                  <li>→ Agente de atendimento automatizado pra vidraçarias</li>
                  <li>→ Chatbot &ldquo;Calcule seu espelho&rdquo; pro consumidor final</li>
                  <li>→ Assistente de IA que ajuda no diagnóstico de obra</li>
                  <li>→ Automação de captura e follow-up de lead</li>
                  <li>→ App simples de gestão de orçamentos (pago mensal)</li>
                </ul>
              </div>

              {/* Categoria 7 · full-width */}
              <div className="md:col-span-2 bg-brand-title text-white rounded-[28px] p-8 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-brand-highlight text-brand-title flex items-center justify-center text-sm font-medium">
                    07
                  </span>
                  <h3 className="text-xl font-medium text-white">
                    Pra sonhar junto · ideias de longo prazo
                  </h3>
                </div>
                <ul className="text-sm text-white/85 font-light space-y-2.5 leading-relaxed md:columns-2 md:gap-8">
                  <li>→ Encontro presencial anual de vidraceiros (evento de marca)</li>
                  <li>→ Livro físico &ldquo;De vidraceiro a criador&rdquo;</li>
                  <li>→ Podcast semanal com seu pai, sobre ofício e vida</li>
                  <li>→ Canal no YouTube com conteúdo longo e entrevistas</li>
                  <li>→ Franquia/licenciamento da marca &ldquo;Fí de Vidraceiro&rdquo;</li>
                  <li>→ Série documental &ldquo;Bastidores de um ofício&rdquo;</li>
                  <li>→ Feira de produtos de vidraçarias independentes</li>
                  <li>→ Plataforma de cursos própria pra profissionais do ofício</li>
                </ul>
              </div>
            </div>

            <div className="rounded-[24px] bg-brand-background px-6 py-5 text-sm text-brand-body font-light leading-relaxed max-w-3xl">
              <span className="font-medium text-brand-title">Sobre essa lista:</span> não é pra fazer tudo,
              nem é pra fazer agora. É pra você ter em mãos quando bater aquela dúvida de &ldquo;o que dá
              pra fazer com isso aqui?&rdquo;. A gente pensou como parceiro pensa — sem agenda, sem
              cronograma, só jogando ideia em cima da mesa.
            </div>
          </div>
        </section>

        {/* FASES / TIMELINE */}
        <section className="w-full bg-brand-background px-4 md:px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto flex flex-col gap-12">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
                Como isso poderia rodar
              </span>
              <h2 className="text-4xl lg:text-[56px] font-medium text-brand-title leading-[1.05]">
                Um exercício de imaginação: 90 dias em três fases.
              </h2>
              <p className="text-base md:text-lg text-brand-body font-light leading-relaxed">
                Não é um cronograma fechado. É só um jeito de mostrar a ordem natural das coisas —
                o que viria primeiro, o que financiaria o quê.
              </p>
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

        {/* O QUE A FUTURAH FARIA */}
        <section className="w-full bg-white px-4 md:px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
                O que a Futurah faria
              </span>
              <h2 className="text-4xl lg:text-[56px] font-medium text-brand-title leading-[1.05]">
                Tudo que envolve estratégia, execução e acompanhamento.
              </h2>
              <p className="text-base md:text-lg text-brand-body font-light leading-relaxed">
                Caso você decida envolver a gente nessa jornada, o escopo natural de trabalho seria:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Estratégia comercial e de produto",
                "Identidade visual dos produtos digitais",
                "Páginas de venda e checkout integrado",
                "Funis de e-mail e automações",
                "Prospecção e negociação de publis",
                "Copy de lançamento e roteiros de reels",
                "Dashboards com métricas reais, não de vaidade",
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

        {/* POTENCIAL / ORDEM DE GRANDEZA */}
        <section className="w-full bg-brand-title text-white px-4 md:px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="text-sm font-medium uppercase tracking-wider text-brand-highlight">
                Ordem de grandeza
              </span>
              <h2 className="text-4xl lg:text-[56px] font-medium leading-[1.05] text-white">
                Pra você dimensionar o tamanho do que já é possível hoje.
              </h2>
              <p className="text-base md:text-lg text-white/70 font-light leading-relaxed">
                As faixas abaixo são referências de mercado, não promessas. Servem pra mostrar a escala do
                que uma audiência do seu porte comporta — antes mesmo dela crescer mais.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-[28px] border border-white/20 bg-white/[0.08] p-8 flex flex-col gap-4">
                <span className="text-xs font-medium uppercase tracking-wider text-brand-highlight">
                  Frente 1 · Publi
                </span>
                <h3 className="text-2xl font-medium leading-tight text-white">Patrocínios recorrentes</h3>
                <p className="text-sm text-white/80 font-light leading-relaxed">
                  Com media kit e prospecção ativa, um perfil do seu porte sustenta confortavelmente de 2 a 4
                  publis mensais com ticket médio de mercado na faixa de R$ 3 mil a R$ 8 mil por postagem.
                </p>
                <div className="pt-4 border-t border-white/15">
                  <span className="text-xs text-white/60 uppercase tracking-wider">Potencial mensal</span>
                  <p className="text-3xl font-medium mt-1 text-white">R$ 10k – R$ 30k</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/20 bg-white/[0.08] p-8 flex flex-col gap-4">
                <span className="text-xs font-medium uppercase tracking-wider text-brand-highlight">
                  Frente 2 · Digitais
                </span>
                <h3 className="text-2xl font-medium leading-tight text-white">Produtos low-ticket</h3>
                <p className="text-sm text-white/80 font-light leading-relaxed">
                  Margem ~100%, entrega automática. Com uma base engajada do seu tamanho, uma taxa de conversão
                  de 1% em campanhas pontuais já gera volume relevante — e escala sem custo marginal.
                </p>
                <div className="pt-4 border-t border-white/15">
                  <span className="text-xs text-white/60 uppercase tracking-wider">Potencial mensal</span>
                  <p className="text-3xl font-medium mt-1 text-white">R$ 8k – R$ 20k</p>
                </div>
              </div>

              <div className="rounded-[28px] border-2 border-brand-highlight bg-brand-highlight p-8 flex flex-col gap-4">
                <span className="text-xs font-medium uppercase tracking-wider text-brand-title">
                  Frente 3 · Mentoria
                </span>
                <h3 className="text-2xl font-medium leading-tight text-brand-title">Ticket alto</h3>
                <p className="text-sm text-brand-title/80 font-light leading-relaxed">
                  Pensada pra rodar 2 a 3 vezes por ano, com turmas enxutas e ticket alto. É a camada que
                  transforma audiência em negócio de verdade, sem exigir esforço operacional diário.
                </p>
                <div className="pt-4 border-t border-brand-title/20">
                  <span className="text-xs text-brand-title/70 uppercase tracking-wider">Potencial por turma</span>
                  <p className="text-3xl font-medium mt-1 text-brand-title">R$ 40k – R$ 100k</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/15 bg-white/[0.06] p-8 md:p-10 flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-brand-highlight">
                Sobre os números acima
              </span>
              <p className="text-sm md:text-base text-white/80 font-light leading-relaxed max-w-3xl">
                São faixas de mercado, não promessas. Servem apenas pra dimensionar a ordem de grandeza do
                que uma audiência como a sua já comporta — hoje, boa parte disso é atenção que passa e não
                volta em forma de negócio.
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

        {/* ENCERRAMENTO */}
        <section id="contato" className="w-full bg-brand-background px-4 md:px-8 lg:px-12 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-8">
            <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
              Encerrando a leitura
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-[56px] font-medium text-brand-title leading-[1.1]">
              Se fez sentido, <span className="italic">a gente conversa.</span>
            </h2>
            <p className="text-base md:text-lg text-brand-body font-light leading-relaxed">
              Este documento existe só pra abrir o diálogo. Nenhuma proposta comercial, nenhum compromisso.
              Se alguma das ideias aqui mexer com você, a gente senta, escuta o que você quer da sua vida
              hoje — e só então discute formato de trabalho, se houver interesse de parte a parte.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="mailto:contato@futurah.com.br?subject=Conversa%20sobre%20a%20análise%20do%20%40fidevidraceiro"
                className="text-sm font-medium text-brand-title underline underline-offset-4 hover:text-brand-button-hover transition-colors"
              >
                contato@futurah.com.br
              </a>
            </div>
            <p className="text-xs text-brand-body/60 pt-10 border-t border-brand-title/10 w-full max-w-2xl">
              Documento de caráter analítico. Os números usados são referências públicas de mercado ou dados
              de matérias sobre o @fidevidraceiro. Não constitui oferta comercial.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
