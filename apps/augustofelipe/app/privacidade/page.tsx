import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — Augusto Felipe",
  description:
    "Como coletamos, usamos e protegemos seus dados nos produtos e ferramentas do Augusto Felipe.",
};

const UPDATED = "8 de junho de 2026";

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-neutral-900">
      <article className="mx-auto max-w-2xl">
        <p className="text-sm uppercase tracking-widest text-neutral-500">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Política de Privacidade</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Última atualização: {UPDATED}
        </p>

        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-neutral-700">
          <p>
            Esta política explica como os dados são tratados nos sites, produtos
            e ferramentas do Augusto Felipe (incluindo o workshop “Construindo um
            Viral”, a análise de perfil e os assistentes de IA), em conformidade
            com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).
          </p>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900">
              1. Dados que coletamos
            </h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>
                <strong>Dados que você informa:</strong> nome, e-mail, WhatsApp,
                @ do Instagram e respostas de formulários/quizzes.
              </li>
              <li>
                <strong>Dados da análise de perfil:</strong> quando você solicita
                o diagnóstico, usamos o @ informado para coletar informações{" "}
                <strong>públicas</strong> do seu perfil no Instagram (bio,
                contadores e posts públicos) por meio de um serviço terceirizado
                de coleta de dados. Não acessamos contas privadas, senhas nem
                mensagens.
              </li>
              <li>
                <strong>Dados de navegação:</strong> informações de uso e eventos
                de conversão coletados via pixel e ferramentas de medição.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900">
              2. Como usamos os dados
            </h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>Entregar os produtos, bônus e ferramentas que você adquiriu.</li>
              <li>Gerar o diagnóstico do seu perfil e conteúdos personalizados.</li>
              <li>Enviar comunicações sobre sua compra e novidades relacionadas.</li>
              <li>Medir e melhorar a performance das nossas campanhas e páginas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900">
              3. Compartilhamento com terceiros
            </h2>
            <p className="mt-2">
              Compartilhamos dados apenas com prestadores que viabilizam a
              operação, atuando como operadores de dados:
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>Hospedagem e infraestrutura do site e da API.</li>
              <li>Serviço de coleta de dados públicos do Instagram (Apify).</li>
              <li>Envio de e-mails transacionais (Resend).</li>
              <li>Processamento de pagamentos (plataforma de checkout).</li>
              <li>Medição de conversões (Meta/Facebook).</li>
            </ul>
            <p className="mt-2">
              Não vendemos seus dados pessoais. Ao usar os assistentes de IA, o
              conteúdo que você digita é processado pela OpenAI conforme as
              políticas da plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900">
              4. Seus direitos
            </h2>
            <p className="mt-2">
              Você pode solicitar acesso, correção, portabilidade ou exclusão dos
              seus dados, bem como revogar consentimento, a qualquer momento,
              entrando em contato pelo e-mail abaixo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900">
              5. Retenção
            </h2>
            <p className="mt-2">
              Mantemos seus dados pelo tempo necessário para as finalidades acima
              ou conforme exigido por lei. Depois disso, são excluídos ou
              anonimizados.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900">
              6. Contato
            </h2>
            <p className="mt-2">
              Dúvidas ou solicitações sobre seus dados:{" "}
              <a
                className="font-medium text-neutral-900 underline"
                href="mailto:augustofelipe@futurah.co"
              >
                augustofelipe@futurah.co
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
