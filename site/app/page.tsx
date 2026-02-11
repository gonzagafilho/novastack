export default function Home() {
 const whatsapp = "https://wa.me/5561996088711?text=Ol%C3%A1%21%20Quero%20um%20or%C3%A7amento%20na%20NovaStack%20(Desenvolvimento).";

  return (
    <main className="min-h-screen bg-[#070A12] text-[#EAF0FF]">
      {/* Topbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070A12]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400/90 to-violet-500/90 shadow-lg shadow-cyan-400/20" />
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight">NovaStack</div>
              <div className="text-xs text-[#9AA4BF]">Desenvolvimento</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-[#9AA4BF] md:flex">
            <a className="hover:text-white" href="#servicos">Serviços</a>
            <a className="hover:text-white" href="#portfolio">Portfólio</a>
            <a className="hover:text-white" href="#planos">Planos</a>
            <a className="hover:text-white" href="#contato">Contato</a>
            <a className="hover:text-white" href="/portfolio">Portfólio</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={whatsapp}
              className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 md:inline-flex"
            >
              Falar no WhatsApp
            </a>
            <a
              href="#contato"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-[#070A12] shadow-lg shadow-cyan-400/20 hover:opacity-90"
            >
              Solicitar orçamento
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute top-20 right-[-120px] h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[-120px] h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-[#9AA4BF]">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.7)]" />
              Sites • Sistemas • Apps • Chatbot • Hospedagem
            </p>

            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
              Desenvolvimento <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">moderno</span> para empresas que querem crescer.
            </h1>

            <p className="mt-5 max-w-xl text-base text-[#9AA4BF] md:text-lg">
              Criamos sites rápidos, sistemas completos, aplicativos e automações com chatbot.
              Tudo com suporte, manutenção e hospedagem profissional.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsapp}
                className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
              >
                Chamar no WhatsApp
              </a>
              <a
                href="#servicos"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Ver serviços
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 text-xs text-[#9AA4BF]">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-white font-semibold">Entrega rápida</div>
                <div className="mt-1">Processo claro</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-white font-semibold">Alta performance</div>
                <div className="mt-1">SEO + Speed</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-white font-semibold">Suporte real</div>
                <div className="mt-1">Manutenção</div>
              </div>
            </div>
          </div>

          {/* Mock card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-cyan-400/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Portal do Cliente</div>
                <div className="mt-1 text-xs text-[#9AA4BF]">Acompanhe projetos, chamados e alertas</div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-cyan-400/80 to-violet-500/80 px-3 py-1 text-xs font-semibold text-[#070A12]">
                NOVO
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                { t: "Status do projeto", d: "Em desenvolvimento • 68%" },
                { t: "Chamados", d: "Suporte técnico • Prioridade normal" },
                { t: "Alertas", d: "Deploy publicado • Site no ar" },
              ].map((i) => (
                <div key={i.t} className="rounded-xl border border-white/10 bg-[#0D1224]/60 p-4">
                  <div className="text-sm font-semibold text-white">{i.t}</div>
                  <div className="mt-1 text-xs text-[#9AA4BF]">{i.d}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-[#0D1224]/60 p-4">
              <div className="text-xs text-[#9AA4BF]">Chat interno</div>
              <div className="mt-2 h-2 w-2 rounded-full bg-cyan-400" />
              <div className="mt-2 text-sm text-white font-semibold">Atendimento direto no painel</div>
              <div className="mt-1 text-xs text-[#9AA4BF]">Respostas rápidas e histórico salvo.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold">Serviços</h2>
        <p className="mt-2 text-[#9AA4BF]">Tudo que sua empresa precisa em um só lugar.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { t: "Sites", d: "Institucional, landing pages, e-commerce e portais." },
            { t: "Sistemas Web", d: "Painéis, relatórios, usuários, permissões e integrações." },
            { t: "Apps", d: "PWA, Android e iOS com foco em usabilidade." },
            { t: "Chatbots", d: "WhatsApp + site com atendimento e automações." },
            { t: "Hospedagem", d: "VPS, domínio, SSL, e-mails e monitoramento." },
            { t: "Manutenção", d: "Atualizações, melhorias contínuas e suporte." },
          ].map((i) => (
            <div key={i.t} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10">
              <div className="text-lg font-semibold">{i.t}</div>
              <div className="mt-2 text-sm text-[#9AA4BF]">{i.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold">Planos</h2>
        <p className="mt-2 text-[#9AA4BF]">Escolha o melhor para seu momento. Podemos personalizar.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { t: "Start", p: "Sob consulta", items: ["Site institucional", "Formulário de leads", "SSL + performance"] },
            { t: "Pro", p: "Sob consulta", items: ["Site + páginas extras", "Integrações", "Manutenção mensal"] },
            { t: "Premium", p: "Sob consulta", items: ["Sistema/Portal", "Chatbot + automações", "Suporte prioritário"] },
          ].map((pl) => (
            <div key={pl.t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{pl.t}</div>
                <div className="text-sm text-[#9AA4BF]">{pl.p}</div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-[#9AA4BF]">
                {pl.items.map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400/80" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <a
                href={whatsapp}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-[#070A12] hover:opacity-90"
              >
                Pedir orçamento
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold">Contato</h2>
          <p className="mt-2 text-[#9AA4BF]">
            Fale com a NovaStack e receba um orçamento rápido.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsapp}
              className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
            >
              WhatsApp
            </a>
            <a
              href="mailto:contato@dcinfinity.net.br"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              E-mail
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-4 text-sm text-[#9AA4BF]">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} NovaStack Desenvolvimento. Todos os direitos reservados.</div>
            <div className="flex gap-4">
              <a className="hover:text-white" href="#servicos">Serviços</a>
              <a className="hover:text-white" href="#planos">Planos</a>
              <a className="hover:text-white" href="#contato">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
