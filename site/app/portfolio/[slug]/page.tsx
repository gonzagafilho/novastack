type CaseItem = {
  slug: string;
  title: string;
  tag: "Sites" | "Sistemas" | "Apps" | "Chatbot";
  summary: string;
  bullets: string[];
  tech: string[];
};

const cases: CaseItem[] = [
  {
    slug: "site-institucional-premium",
    title: "Site Institucional Premium",
    tag: "Sites",
    summary: "Site moderno com foco em conversão, performance e presença no Google.",
    bullets: ["Design premium", "SEO e performance", "Formulário + WhatsApp", "Hospedagem e SSL"],
    tech: ["Next.js", "Tailwind", "SEO"],
  },
  {
    slug: "portal-cliente-dashboard",
    title: "Portal do Cliente (Dashboard)",
    tag: "Sistemas",
    summary: "Painel com login, chamados, andamento de projetos e histórico de atendimento.",
    bullets: ["Login e permissões", "Dashboard de status", "Chamados e chat interno", "Alertas automáticos"],
    tech: ["Next.js", "Auth", "Dashboard"],
  },
  {
    slug: "sistema-orcamentos-propostas",
    title: "Sistema de Orçamentos & Propostas",
    tag: "Sistemas",
    summary: "Gestão de propostas do pedido até a aprovação com histórico e organização total.",
    bullets: ["Cadastro de clientes", "Geração de propostas", "Aprovação e registros", "Relatórios e exportação"],
    tech: ["API", "PostgreSQL", "Admin"],
  },
  {
    slug: "landing-page-vendas",
    title: "Landing Page de Vendas",
    tag: "Sites",
    summary: "Landing page focada em leads com CTA forte e rastreamento de resultados.",
    bullets: ["Copy persuasiva", "Botões WhatsApp", "Formulário rápido", "Métricas e tags"],
    tech: ["Copy", "Analytics", "Performance"],
  },
  {
    slug: "app-pwa-catalogo",
    title: "App PWA (Catálogo/Serviços)",
    tag: "Apps",
    summary: "App instalável no celular para catálogo, pedidos, serviços e atendimento.",
    bullets: ["Instalável (PWA)", "Experiência rápida", "Offline opcional", "Integrações"],
    tech: ["PWA", "React", "Offline"],
  },
  {
    slug: "chatbot-whatsapp-site",
    title: "Chatbot WhatsApp + Site",
    tag: "Chatbot",
    summary: "Bot que atende, qualifica lead e direciona para humano, com histórico e automações.",
    bullets: ["Fluxos e FAQs", "Captura de leads", "Integração WhatsApp", "Escalonamento humano"],
    tech: ["WhatsApp API", "Webhooks", "IA"],
  },
];

export default async function CaseDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);

  const whatsapp =
    "https://wa.me/5561996088711?text=Ol%C3%A1%21%20Quero%20um%20projeto%20igual%20ao%20case%20da%20NovaStack.";

  if (!c) {
    return (
      <main className="min-h-screen bg-[#070A12] text-[#EAF0FF] grid place-items-center px-4">
        <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="text-xl font-bold">Case não encontrado</div>
          <p className="mt-2 text-[#9AA4BF]">Volte para o portfólio e selecione um item.</p>
          <a
            href="/portfolio"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
          >
            Voltar ao portfólio
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070A12] text-[#EAF0FF]">
      <header className="border-b border-white/10 bg-[#070A12]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <a href="/portfolio" className="text-sm text-[#9AA4BF] hover:text-white">
            ← Voltar ao portfólio
          </a>
          <a
            href={whatsapp}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Falar no WhatsApp
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#9AA4BF]">
              {c.tag}
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{c.title}</h1>
            <p className="mt-3 max-w-2xl text-[#9AA4BF]">{c.summary}</p>
          </div>

          <a
            href={whatsapp}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-[#070A12] hover:opacity-90"
          >
            Quero um projeto assim
          </a>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-lg font-semibold">O que entregamos</div>
            <ul className="mt-4 space-y-2 text-sm text-[#9AA4BF]">
              {c.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400/80" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-lg font-semibold">Tecnologias</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {c.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-white/10 bg-[#0D1224]/60 px-2.5 py-1 text-xs text-[#9AA4BF]"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-[#0D1224]/60 p-4">
              <div className="text-sm font-semibold">Próximo passo</div>
              <div className="mt-1 text-sm text-[#9AA4BF]">
                Me envie: tipo de projeto, cidade/UF, prazo e uma ideia do que precisa. Eu retorno com proposta.
              </div>
              <a
                href={whatsapp}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
              >
                Chamar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-4 text-sm text-[#9AA4BF]">
          © {new Date().getFullYear()} NovaStack Desenvolvimento.
        </div>
      </footer>
    </main>
  );
}
