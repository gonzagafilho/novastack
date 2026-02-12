"use client";

export default function HomeClient() {
  const whatsapp =
    "https://wa.me/5561996088711?text=Ol%C3%A1%21%20Quero%20um%20or%C3%A7amento%20para%20um%20projeto%20com%20a%20NovaStack.";

  return (
    <main className="min-h-screen bg-[#070A12] text-[#EAF0FF]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/estrutura-1.jpg"
            alt="Ambiente de desenvolvimento"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#070A12]/70 to-[#070A12]" />
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute top-24 right-[-140px] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-[#EAF0FF]">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Desenvolvimento moderno • rápido • premium
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Sites, Sistemas, Apps e{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Chatbots
              </span>{" "}
              que vendem.
            </h1>

            <p className="mt-4 text-base leading-relaxed text-[#B7C0DA] md:text-lg">
              A NovaStack cria projetos com design profissional, performance e foco em conversão.
              Do site institucional ao portal do cliente com dashboard e automações.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-[#070A12] hover:opacity-90"
              >
                Pedir orçamento no WhatsApp
              </a>

              <a
                href="/portfolio"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Ver portfólio
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">SEO e Performance</div>
                <div className="mt-1 text-xs text-[#9AA4BF]">Rápido, leve e bem ranqueado</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">Painel / Dashboard</div>
                <div className="mt-1 text-xs text-[#9AA4BF]">Portal do cliente e admin</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">WhatsApp + Automação</div>
                <div className="mt-1 text-xs text-[#9AA4BF]">Leads, chatbots e integrações</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO SERVIÇOS (simples, depois refinamos) */}
      <section id="servicos" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-white">Serviços</h2>
        <p className="mt-2 max-w-2xl text-sm text-[#9AA4BF]">
          Escolha o que você precisa. A gente entrega com padrão premium e suporte.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            { t: "Sites", d: "Institucional, landing pages, SEO e conversão." },
            { t: "Sistemas", d: "Painéis, admin, relatórios e integrações." },
            { t: "Apps", d: "PWA e apps com experiência fluida." },
            { t: "Chatbots", d: "WhatsApp + site, captação de leads e automação." },
          ].map((i) => (
            <div key={i.t} className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
              <div className="text-sm font-semibold text-white">{i.t}</div>
              <div className="mt-2 text-sm text-[#9AA4BF]">{i.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <div className="text-lg font-semibold text-white">Vamos começar?</div>
            <div className="mt-2 text-sm text-[#9AA4BF]">
              Me chama no WhatsApp e eu já te mando uma proposta rápida.
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-[#070A12] hover:opacity-90"
              >
                Chamar no WhatsApp
              </a>
              <a
                href="/portfolio"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Ver portfólio
              </a>
            </div>
          </div>

          <div className="mt-10 text-sm text-[#9AA4BF]">
            © {new Date().getFullYear()} NovaStack Desenvolvimento.
          </div>
        </div>
      </section>
    </main>
  );
}
