"use client";

import { useMemo, useState } from "react";

type ServiceKey = "site" | "sistema" | "app" | "chatbot" | "manutencao" | "hospedagem";

type ServiceOption = {
  key: ServiceKey;
  title: string;
  desc: string;
  from: string;
};

const services: ServiceOption[] = [
  { key: "site", title: "Site / Landing Page", desc: "Institucional, landing page, páginas e formulários.", from: "a partir de R$ 1.000" },
  { key: "sistema", title: "Sistema Web / Dashboard", desc: "Login, painel admin, relatórios, permissões.", from: "a partir de R$ 3.000" },
  { key: "app", title: "App (PWA / Mobile)", desc: "Aplicação instalável, catálogo, serviços, offline (opcional).", from: "a partir de R$ 4.000" },
  { key: "chatbot", title: "Chatbot (WhatsApp + Site)", desc: "Atendimento automático + captação de leads.", from: "a partir de R$ 1.500" },
  { key: "manutencao", title: "Manutenção Mensal", desc: "Suporte, melhorias contínuas, correções.", from: "a partir de R$ 199/mês" },
  { key: "hospedagem", title: "Hospedagem / VPS", desc: "Servidor, SSL, monitoramento, deploy.", from: "a partir de R$ 149/mês" },
];

type AddonKey = "seo" | "analytics" | "email" | "blog" | "pagamentos" | "portal" | "integracoes";

type AddonOption = {
  key: AddonKey;
  title: string;
  desc: string;
};

const addons: AddonOption[] = [
  { key: "seo", title: "SEO avançado", desc: "Otimização para Google + meta + performance." },
  { key: "analytics", title: "Analytics / Pixel", desc: "Métricas, eventos e conversões." },
  { key: "email", title: "E-mail profissional", desc: "contato@seudominio + configuração." },
  { key: "blog", title: "Blog / Conteúdo", desc: "Área de artigos para SEO e autoridade." },
  { key: "pagamentos", title: "Pagamentos", desc: "Checkout, links de pagamento, integrações." },
  { key: "portal", title: "Portal do Cliente", desc: "Login + painel de chamados/projetos." },
  { key: "integracoes", title: "Integrações", desc: "CRM, WhatsApp API, planilhas, automações." },
];

const deadlines = ["Urgente (até 7 dias)", "15 dias", "30 dias", "60+ dias"] as const;
type Deadline = (typeof deadlines)[number];

const budgets = ["Até R$ 1.000", "R$ 1.000 a R$ 3.000", "R$ 3.000 a R$ 8.000", "R$ 8.000+"] as const;
type Budget = (typeof budgets)[number];

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

export default function OrcamentoPage() {
  const whatsappNumber = "5561996088711";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deadline, setDeadline] = useState<Deadline>("30 dias");
  const [budget, setBudget] = useState<Budget>("R$ 1.000 a R$ 3.000");
  const [details, setDetails] = useState("");

  const [selectedServices, setSelectedServices] = useState<Record<ServiceKey, boolean>>({
    site: true,
    sistema: false,
    app: false,
    chatbot: false,
    manutencao: false,
    hospedagem: false,
  });

  const [selectedAddons, setSelectedAddons] = useState<Record<AddonKey, boolean>>({
    seo: false,
    analytics: false,
    email: false,
    blog: false,
    pagamentos: false,
    portal: false,
    integracoes: false,
  });

  const pickedServices = useMemo(() => {
    return services.filter((s) => selectedServices[s.key]);
  }, [selectedServices]);

  const pickedAddons = useMemo(() => {
    return addons.filter((a) => selectedAddons[a.key]);
  }, [selectedAddons]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Informe seu nome.";
    const digits = onlyDigits(phone);
    if (digits.length < 10) e.phone = "WhatsApp inválido (DDD + número).";
    if (pickedServices.length === 0) e.services = "Selecione pelo menos 1 item.";
    if (details.trim() && details.trim().length < 10) e.details = "Se escrever, mínimo 10 caracteres.";
    return e;
  }, [name, phone, pickedServices.length, details]);

  const isValid = Object.keys(errors).length === 0;

  const preProposal = useMemo(() => {
    const phoneDigits = onlyDigits(phone);

    const items = pickedServices.map((s) => `• ${s.title} (${s.from})`).join("\n") || "-";
    const extras = pickedAddons.map((a) => `• ${a.title}`).join("\n") || "• Nenhum extra por enquanto";

    const linhas = [
      "📌 *PRÉ-PROPOSTA — NovaStack Desenvolvimento*",
      "",
      `👤 *Cliente:* ${name || "-"}`,
      `📱 *WhatsApp:* ${phoneDigits ? `+55 ${phoneDigits}` : "-"}`,
      "",
      "✅ *Itens selecionados:*",
      items,
      "",
      "➕ *Extras:*",
      extras,
      "",
      `⏱️ *Prazo desejado:* ${deadline}`,
      `💰 *Orçamento estimado:* ${budget}`,
      "",
      details.trim() ? "📝 *Observações do cliente:*" : "📝 *Observações:*",
      details.trim() ? details.trim() : "Sem observações.",
      "",
      "🔁 *Próximos passos:*",
      "1) Confirmar escopo (páginas, funcionalidades e integrações)",
      "2) Definir prazo final e valor fechado",
      "3) Enviar proposta oficial + contrato",
    ];

    return linhas.join("\n");
  }, [name, phone, pickedServices, pickedAddons, deadline, budget, details]);

  const waLink = useMemo(() => {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(preProposal)}`;
  }, [preProposal]);

  function toggleService(k: ServiceKey) {
    setSelectedServices((p) => ({ ...p, [k]: !p[k] }));
  }

  function toggleAddon(k: AddonKey) {
    setSelectedAddons((p) => ({ ...p, [k]: !p[k] }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    window.open(waLink, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen bg-[#070A12] text-[#EAF0FF]">
      <header className="border-b border-white/10 bg-[#070A12]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <a href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400/90 to-violet-500/90 shadow-lg shadow-cyan-400/20" />
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight">NovaStack</div>
              <div className="text-xs text-[#9AA4BF]">Orçamento (Cardápio)</div>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/portfolio"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Ver portfólio
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-[#070A12] hover:opacity-90"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute top-20 right-[-120px] h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Monte seu{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              orçamento
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#9AA4BF] md:text-base">
            Escolha os itens como um cardápio. No final, a página gera automaticamente uma *pré-proposta* pronta e manda no WhatsApp.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Left: Form */}
            <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm text-white/90">Seu nome</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Luiz Gonzaga"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0D1224]/60 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
                    />
                    {errors.name && <div className="mt-1 text-xs text-red-400">{errors.name}</div>}
                  </div>

                  <div>
                    <label className="text-sm text-white/90">Seu WhatsApp</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: (61) 99999-9999"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0D1224]/60 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
                    />
                    {errors.phone && <div className="mt-1 text-xs text-red-400">{errors.phone}</div>}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-white/90">Cardápio (escolha 1 ou mais)</label>
                    <span className="text-xs text-[#9AA4BF]">{pickedServices.length} selecionado(s)</span>
                  </div>

                  {errors.services && <div className="mt-1 text-xs text-red-400">{errors.services}</div>}

                  <div className="mt-3 grid gap-3">
                    {services.map((s) => {
                      const active = !!selectedServices[s.key];
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => toggleService(s.key)}
                          className={[
                            "text-left rounded-2xl border px-4 py-4 transition",
                            active
                              ? "border-cyan-400/40 bg-cyan-400/10"
                              : "border-white/10 bg-[#0D1224]/40 hover:bg-[#0D1224]/60",
                          ].join(" ")}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-white">{s.title}</div>
                              <div className="mt-1 text-xs text-[#9AA4BF]">{s.desc}</div>
                              <div className="mt-2 text-xs text-white/80">{s.from}</div>
                            </div>
                            <div
                              className={[
                                "mt-1 h-5 w-5 rounded-md border flex items-center justify-center",
                                active ? "border-cyan-400/60 bg-cyan-400/20" : "border-white/20",
                              ].join(" ")}
                            >
                              {active ? "✓" : ""}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/90">Extras (opcional)</label>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {addons.map((a) => {
                      const active = !!selectedAddons[a.key];
                      return (
                        <button
                          key={a.key}
                          type="button"
                          onClick={() => toggleAddon(a.key)}
                          className={[
                            "text-left rounded-2xl border px-4 py-4 transition",
                            active
                              ? "border-violet-500/40 bg-violet-500/10"
                              : "border-white/10 bg-[#0D1224]/40 hover:bg-[#0D1224]/60",
                          ].join(" ")}
                        >
                          <div className="text-sm font-semibold text-white">{a.title}</div>
                          <div className="mt-1 text-xs text-[#9AA4BF]">{a.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm text-white/90">Prazo</label>
                    <select
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value as Deadline)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0D1224]/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                    >
                      {deadlines.map((d) => (
                        <option key={d} className="bg-[#070A12]">{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-white/90">Orçamento estimado</label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value as Budget)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0D1224]/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                    >
                      {budgets.map((b) => (
                        <option key={b} className="bg-[#070A12]">{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/90">Observações (opcional)</label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={4}
                    placeholder="Ex: Quero 5 páginas, formulário, integração com WhatsApp..."
                    className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#0D1224]/60 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
                  />
                  {errors.details && <div className="mt-1 text-xs text-red-400">{errors.details}</div>}
                </div>

                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-[#070A12] hover:opacity-90"
                  disabled={!isValid}
                >
                  Gerar pré-proposta e enviar no WhatsApp
                </button>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-center text-xs text-[#9AA4BF] hover:text-white"
                >
                  (Abrir link direto do WhatsApp)
                </a>
              </div>
            </form>

            {/* Right: Preview */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">Pré-proposta (preview)</div>
                <span className="text-xs text-[#9AA4BF]">gerada automaticamente</span>
              </div>

              <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-[#0D1224]/60 p-4 text-xs text-[#DDE6FF]">
{preProposal}
              </pre>

              <div className="mt-4 text-xs text-[#9AA4BF]">
                Dica: você pode copiar esse texto e colar em qualquer conversa, mas o botão já abre o WhatsApp pronto.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
