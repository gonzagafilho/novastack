"use client";

import { useMemo, useState } from "react";

type CaseItem = {
  slug: string;
  title: string;
  tag: "Sites" | "Sistemas" | "Apps" | "Chatbot";
  desc: string;
  tech: string[];
  image: string;
};

const allCases: CaseItem[] = [
  {
    slug: "site-institucional-premium",
    title: "Site Institucional Premium",
    tag: "Sites",
    desc: "Layout moderno, rápido e otimizado para conversão (SEO + performance).",
    tech: ["Next.js", "Tailwind", "SEO"],
    image: "/images/estrutura-1.jpg",
  },
  {
    slug: "portal-cliente-dashboard",
    title: "Portal do Cliente (Dashboard)",
    tag: "Sistemas",
    desc: "Painel com login, acompanhamento do projeto, chamados e alertas.",
    tech: ["Next.js", "Auth", "Dashboard"],
    image: "/images/estrutura-2.jpg",
  },
  {
    slug: "sistema-orcamentos-propostas",
    title: "Sistema de Orçamentos & Propostas",
    tag: "Sistemas",
    desc: "Fluxo completo: solicitação → proposta → aprovação → contrato.",
    tech: ["API", "PostgreSQL", "Admin"],
    image: "/images/estrutura-3.jpg",
  },
  {
    slug: "landing-page-vendas",
    title: "Landing Page de Vendas",
    tag: "Sites",
    desc: "Página focada em leads com WhatsApp, formulário e funil simples.",
    tech: ["Copy", "Analytics", "Performance"],
    image: "/images/estrutura-1.jpg",
  },
  {
    slug: "app-pwa-catalogo",
    title: "App PWA (Catálogo/Serviços)",
    tag: "Apps",
    desc: "Aplicação leve, instalável no celular, com recursos offline (opcional).",
    tech: ["PWA", "React", "Offline"],
    image: "/images/estrutura-2.jpg",
  },
  {
    slug: "chatbot-whatsapp-site",
    title: "Chatbot WhatsApp + Site",
    tag: "Chatbot",
    desc: "Atendimento automático, captura de leads e direcionamento para humano.",
    tech: ["WhatsApp API", "Webhooks", "IA"],
    image: "/images/estrutura-3.jpg",
  },
];

const filters = ["Todos", "Sites", "Sistemas", "Apps", "Chatbot"] as const;
type Filter = (typeof filters)[number];

export default function PortfolioPage() {
  const [filter, setFilter] = useState<Filter>("Todos");

  const whatsapp =
    "https://wa.me/5561996088711?text=Ol%C3%A1%21%20Quero%20ver%20mais%20cases%20da%20NovaStack%20e%20pedir%20um%20or%C3%A7amento.";

  const list = useMemo(() => {
    if (filter === "Todos") return allCases;
    return allCases.filter((c) => c.tag === filter);
  }, [filter]);

  return (
    <main className="min-h-screen bg-[#070A12] text-[#EAF0FF]">
      <header className="border-b border-white/10 bg-[#070A12]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <a href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400/90 to-violet-500/90 shadow-lg shadow-cyan-400/20" />
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight">
                NovaStack
              </div>
              <div className="text-xs text-[#9AA4BF]">Portfólio</div>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute top-20 right-[-120px] h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Portfólio{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              NovaStack
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-[#9AA4BF]">
            Selecione uma categoria e veja exemplos. Depois a gente coloca cases
            reais com prints e resultados.
          </p>

          {/* Filters */}
          <div className="mt-7 flex flex-wrap gap-2">
            {filters.map((f) => {
              const active = f === filter;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={[
                    "rounded-full px-4 py-2 text-sm transition",
                    active
                      ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-[#070A12] font-semibold"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10",
                  ].join(" ")}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {list.map((c) => (
              <div
                key={c.slug}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl hover:shadow-cyan-500/15"
              >
                <div className="relative h-44 overflow-hidden rounded-xl border border-white/10 bg-[#0D1224]/60">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute left-3 top-3">
                    <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur">
                      {c.tag}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-white">
                    {c.title}
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#9AA4BF]">
                    {c.tag}
                  </span>
                </div>

                <div className="mt-2 text-sm text-[#9AA4BF]">{c.desc}</div>

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

                <div className="mt-5 flex gap-2">
                  <a
                    href={`/portfolio/${c.slug}`}
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Ver detalhes
                  </a>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-[#070A12] hover:opacity-90"
                  >
                    Quero um igual
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-7">
            <div className="text-lg font-semibold">Quer entrar no próximo case?</div>
            <div className="mt-2 text-sm text-[#9AA4BF]">
              Me diga o que você precisa e eu te passo uma proposta rápida.
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
              >
                Chamar no WhatsApp
              </a>
              <a
                href="/#contato"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Ir para contato
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-4 text-sm text-[#9AA4BF]">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} NovaStack Desenvolvimento.</div>
            <div className="flex gap-4">
              <a className="hover:text-white" href="/">
                Início
              </a>
              <a className="hover:text-white" href="/#servicos">
                Serviços
              </a>
              <a className="hover:text-white" href="/#planos">
                Planos
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
