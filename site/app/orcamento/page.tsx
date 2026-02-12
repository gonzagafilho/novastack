"use client";

import { useMemo, useState } from "react";

type ServiceKey = "site" | "sistema" | "app" | "chatbot" | "manutencao" | "hospedagem";
type AddonKey = "seo" | "analytics" | "email" | "blog" | "pagamentos" | "portal" | "integracoes" | "copy";

type PriceRange = { min: number; max: number };
type DaysRange = { min: number; max: number };

type ServiceOption = {
  key: ServiceKey;
  title: string;
  desc: string;
  price: PriceRange;
  days: DaysRange;
};

type AddonOption = {
  key: AddonKey;
  title: string;
  desc: string;
  price: PriceRange;
  days: DaysRange;
};

const services: ServiceOption[] = [
  {
    key: "site",
    title: "Site / Landing Page",
    desc: "Institucional, landing page, páginas, formulário, SEO básico.",
    price: { min: 1200, max: 3500 },
    days: { min: 7, max: 18 },
  },
  {
    key: "sistema",
    title: "Sistema Web / Dashboard",
    desc: "Login, painel admin, usuários/permissões, relatórios e integrações.",
    price: { min: 3500, max: 12000 },
    days: { min: 12, max: 35 },
  },
  {
    key: "app",
    title: "App (PWA / Mobile)",
    desc: "PWA instalável ou mobile (Android/iOS).",
    price: { min: 4000, max: 18000 },
    days: { min: 18, max: 45 },
  },
  {
    key: "chatbot",
    title: "Chatbot (WhatsApp + Site)",
    desc: "Captação de leads, atendimento automático e roteamento.",
    price: { min: 1500, max: 6000 },
    days: { min: 7, max: 20 },
  },
  {
    key: "manutencao",
    title: "Manutenção Mensal",
    desc: "Suporte, melhorias contínuas e correções.",
    price: { min: 199, max: 899 },
    days: { min: 0, max: 0 }, // não entra no prazo do projeto
  },
  {
    key: "hospedagem",
    title: "Hospedagem / VPS",
    desc: "Servidor, SSL, deploy e monitoramento.",
    price: { min: 149, max: 499 },
    days: { min: 0, max: 0 }, // não entra no prazo do projeto
  },
];

const addons: AddonOption[] = [
  { key: "seo", title: "SEO avançado", desc: "Otimizações extras + performance + estrutura.", price: { min: 600, max: 1800 }, days: { min: 2, max: 6 } },
  { key: "analytics", title: "Analytics / Pixel", desc: "Eventos, conversões, metas e rastreio.", price: { min: 200, max: 600 }, days: { min: 1, max: 2 } },
  { key: "email", title: "E-mail profissional", desc: "contato@seudominio + configurações.", price: { min: 150, max: 350 }, days: { min: 0, max: 1 } },
  { key: "blog", title: "Blog / Conteúdo", desc: "Área de artigos (ótimo para SEO).", price: { min: 600, max: 1800 }, days: { min: 2, max: 5 } },
  { key: "pagamentos", title: "Pagamentos", desc: "Checkout / links / integrações.", price: { min: 800, max: 2500 }, days: { min: 3, max: 8 } },
  { key: "portal", title: "Portal do Cliente", desc: "Login + painel de projetos/chamados.", price: { min: 2500, max: 9000 }, days: { min: 10, max: 25 } },
  { key: "integracoes", title: "Integrações", desc: "CRM, planilhas, APIs, automações.", price: { min: 600, max: 4000 }, days: { min: 2, max: 12 } },
  { key: "copy", title: "Copy profissional", desc: "Texto persuasivo (conversão).", price: { min: 400, max: 1500 }, days: { min: 2, max: 6 } },
];

function brl(n: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}
function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

export default function OrcamentoPage() {
  const whatsappNumber = "5561996088711";

  // Dados do cliente
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");

  // Parâmetros “cardápio”
  const [sitePages, setSitePages] = useState(5); // padrão
  const [systemUsers, setSystemUsers] = useState(10); // padrão
  const [appType, setAppType] = useState<"PWA" | "Android+iOS">("PWA");

  // Seleções
  const [selectedServices, setSelectedServices] = useState<Record<ServiceKey, boolean>>({
    site: true,
    sistema: false,
    app: false,
    chatbot: false,
    manutencao: false,
    hospedagem: false,
  });

  const [selectedAddons, setSelectedAddons] = useState<Record<AddonKey, boolean>>({
    seo: true, // já pode vir ligado se quiser
    analytics: false,
    email: false,
    blog: false,
    pagamentos: false,
    portal: false,
    integracoes: false,
    copy: false,
  });

  const pickedServices = useMemo(() => services.filter((s) => selectedServices[s.key]), [selectedServices]);
  const pickedAddons = useMemo(() => addons.filter((a) => selectedAddons[a.key]), [selectedAddons]);

  // Ajustes dinâmicos por parâmetros (páginas/usuários/app)
  const dynamicAdjust = useMemo(() => {
    let extraPriceMin = 0;
    let extraPriceMax = 0;
    let extraDaysMin = 0;
    let extraDaysMax = 0;

    // Site: páginas além de 5
    if (selectedServices.site) {
      const extraPages = Math.max(0, sitePages - 5);
      extraPriceMin += extraPages * 120;
      extraPriceMax += extraPages * 250;
      extraDaysMin += Math.ceil(extraPages / 3);
      extraDaysMax += Math.ceil(extraPages / 2);
    }

    // Sistema: usuários além de 10 (regras/permissões e complexidade)
    if (selectedServices.sistema) {
      const extraUsers = Math.max(0, systemUsers - 10);
      const blocks = Math.ceil(extraUsers / 20);
      extraPriceMin += blocks * 300;
      extraPriceMax += blocks * 900;
      extraDaysMin += blocks * 1;
      extraDaysMax += blocks * 3;
    }

    // App type: Android+iOS tende a aumentar
    if (selectedServices.app && appType === "Android+iOS") {
      extraPriceMin += 2000;
      extraPriceMax += 6000;
      extraDaysMin += 7;
      extraDaysMax += 15;
    }

    return { extraPriceMin, extraPriceMax, extraDaysMin, extraDaysMax };
  }, [selectedServices.site, selectedServices.sistema, selectedServices.app, sitePages, systemUsers, appType]);

  // Total de preço (faixa)
  const totals = useMemo(() => {
    const baseMin =
      pickedServices.reduce((acc, s) => acc + s.price.min, 0) +
      pickedAddons.reduce((acc, a) => acc + a.price.min, 0) +
      dynamicAdjust.extraPriceMin;

    const baseMax =
      pickedServices.reduce((acc, s) => acc + s.price.max, 0) +
      pickedAddons.reduce((acc, a) => acc + a.price.max, 0) +
      dynamicAdjust.extraPriceMax;

    // Observação: manutenção/hospedagem são mensais, mas entram na pré-proposta como itens
    return { min: baseMin, max: baseMax };
  }, [pickedServices, pickedAddons, dynamicAdjust]);

  // ✅ Prazo automático (heurística realista, com paralelismo + buffer)
  const prazo = useMemo(() => {
    // apenas itens que “consomem prazo”
    const timeServices = pickedServices.filter((s) => s.days.max > 0);
    const timeAddons = pickedAddons.filter((a) => a.days.max > 0);

    const minSum =
      timeServices.reduce((acc, s) => acc + s.days.min, 0) +
      timeAddons.reduce((acc, a) => acc + a.days.min, 0) +
      dynamicAdjust.extraDaysMin;

    const maxSum =
      timeServices.reduce((acc, s) => acc + s.days.max, 0) +
      timeAddons.reduce((acc, a) => acc + a.days.max, 0) +
      dynamicAdjust.extraDaysMax;

    // Paralelismo: parte do trabalho ocorre em paralelo
    // Regra: reduzir 25% do somatório e adicionar buffer fixo + buffer por integrações
    const hasIntegrations = selectedAddons.integracoes || selectedServices.chatbot || selectedAddons.portal;
    const buffer = 5 + (hasIntegrations ? 5 : 2);

    const min = Math.max(7, Math.round(minSum * 0.75 + buffer));
    const max = Math.max(min + 7, Math.round(maxSum * 0.75 + buffer + 7));

    return { min, max };
  }, [pickedServices, pickedAddons, dynamicAdjust, selectedAddons.integracoes, selectedServices.chatbot, selectedAddons.portal]);

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

    const items = pickedServices
      .map((s) => {
        let extra = "";
        if (s.key === "site") extra = ` • ~${sitePages} páginas`;
        if (s.key === "sistema") extra = ` • ~${systemUsers} usuários`;
        if (s.key === "app") extra = ` • ${appType}`;
        const isMonthly = s.key === "manutencao" || s.key === "hospedagem";
        const priceLine = isMonthly
          ? `(${brl(s.price.min)} a ${brl(s.price.max)}/mês)`
          : `(${brl(s.price.min)} a ${brl(s.price.max)})`;
        return `• ${s.title}${extra} ${priceLine}`;
      })
      .join("\n") || "-";

    const extras = pickedAddons.map((a) => `• ${a.title} (${brl(a.price.min)} a ${brl(a.price.max)})`).join("\n") || "• Nenhum extra por enquanto";

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
      `🧾 *Subtotal estimado:* ${brl(totals.min)} a ${brl(totals.max)} (valor final após confirmar escopo)`,
      `⏱️ *Prazo estimado:* ${prazo.min} a ${prazo.max} dias`,
      "",
      details.trim() ? "📝 *Observações do cliente:*" : "📝 *Observações:*",
      details.trim() ? details.trim() : "Sem observações.",
      "",
      "🔁 *Próximos passos:*",
      "1) Confirmar escopo (páginas, telas, integrações e regras)",
      "2) Definir prazo final e valor fechado",
      "3) Enviar proposta oficial + contrato",
    ];

    return linhas.join("\n");
  }, [name, phone, pickedServices, pickedAddons, sitePages, systemUsers, appType, totals, prazo, details]);

  const waLink = useMemo(() => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(preProposal)}`, [preProposal]);

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

  function gerarPdf() {
    // Sem instalar nada: usa impressão do navegador (Salvar como PDF)
    window.print();
  }

  return (
    <main className="min-h-screen bg-[#070A12] text-[#EAF0FF] print:bg-white print:text-black">
      <header className="border-b border-white/10 bg-[#070A12]/80 backdrop-blur print:hidden">
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
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-[#070A12] hover:opacity-90"
            >
              Enviar no WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden print:hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute top-20 right-[-120px] h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Cardápio de{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              orçamento
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#9AA4BF] md:text-base">
            O prazo é calculado automaticamente conforme o que o cliente escolhe. Ex.: projeto completo pode cair em ~45 dias.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* LEFT */}
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
                      const isMonthly = s.key === "manutencao" || s.key === "hospedagem";
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => toggleService(s.key)}
                          className={[
                            "text-left rounded-2xl border px-4 py-4 transition",
                            active ? "border-cyan-400/40 bg-cyan-400/10" : "border-white/10 bg-[#0D1224]/40 hover:bg-[#0D1224]/60",
                          ].join(" ")}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-white">{s.title}</div>
                              <div className="mt-1 text-xs text-[#9AA4BF]">{s.desc}</div>
                              <div className="mt-2 text-xs text-white/80">
                                {brl(s.price.min)} a {brl(s.price.max)}{isMonthly ? "/mês" : ""} • prazo base {s.days.min}-{s.days.max} dias
                              </div>
                            </div>
                            <div className={["mt-1 h-5 w-5 rounded-md border flex items-center justify-center", active ? "border-cyan-400/60 bg-cyan-400/20" : "border-white/20"].join(" ")}>
                              {active ? "✓" : ""}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Parâmetros */}
                <div className="rounded-2xl border border-white/10 bg-[#0D1224]/40 p-5">
                  <div className="text-sm font-semibold text-white">Detalhes do pedido</div>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs text-[#9AA4BF]">Quantidade de páginas (Site)</label>
                      <input
                        type="range"
                        min={1}
                        max={12}
                        value={sitePages}
                        onChange={(e) => setSitePages(Number(e.target.value))}
                        className="mt-2 w-full"
                      />
                      <div className="mt-1 text-sm text-white">{sitePages} página(s)</div>
                    </div>

                    <div>
                      <label className="text-xs text-[#9AA4BF]">Usuários (Sistema)</label>
                      <input
                        type="range"
                        min={1}
                        max={200}
                        step={1}
                        value={systemUsers}
                        onChange={(e) => setSystemUsers(Number(e.target.value))}
                        className="mt-2 w-full"
                      />
                      <div className="mt-1 text-sm text-white">{systemUsers} usuário(s)</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-xs text-[#9AA4BF]">Tipo de App</label>
                    <div className="mt-2 flex gap-2">
                      {(["PWA", "Android+iOS"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setAppType(t)}
                          className={[
                            "rounded-xl px-4 py-2 text-sm border transition",
                            appType === t ? "border-violet-500/40 bg-violet-500/10" : "border-white/10 bg-white/5 hover:bg-white/10",
                          ].join(" ")}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Extras */}
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
                            active ? "border-violet-500/40 bg-violet-500/10" : "border-white/10 bg-[#0D1224]/40 hover:bg-[#0D1224]/60",
                          ].join(" ")}
                        >
                          <div className="text-sm font-semibold text-white">{a.title}</div>
                          <div className="mt-1 text-xs text-[#9AA4BF]">{a.desc}</div>
                          <div className="mt-2 text-xs text-white/80">
                            {brl(a.price.min)} a {brl(a.price.max)} • +{a.days.min}-{a.days.max} dias
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/90">Observações (opcional)</label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={4}
                    placeholder="Ex: Quero formulário, integração com WhatsApp, área de clientes..."
                    className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#0D1224]/60 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
                  />
                  {errors.details && <div className="mt-1 text-xs text-red-400">{errors.details}</div>}
                </div>

                {/* Resumo */}
                <div className="rounded-2xl border border-white/10 bg-[#0D1224]/60 p-5">
                  <div className="text-sm font-semibold text-white">Resumo automático</div>
                  <div className="mt-2 text-sm text-[#DDE6FF]">
                    Subtotal: <span className="font-semibold">{brl(totals.min)} a {brl(totals.max)}</span>
                  </div>
                  <div className="mt-1 text-sm text-[#DDE6FF]">
                    Prazo estimado: <span className="font-semibold">{prazo.min} a {prazo.max} dias</span>
                    <span className="text-xs text-[#9AA4BF]"> (calculado conforme o cardápio)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-[#070A12] hover:opacity-90"
                  disabled={!isValid}
                >
                  Gerar pré-proposta e enviar no WhatsApp
                </button>

                <button
                  type="button"
                  onClick={gerarPdf}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Gerar PDF (Salvar como PDF)
                </button>
              </div>
            </form>

            {/* RIGHT: Preview */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 print:border-black/10 print:bg-white">
              <div className="flex items-center justify-between print:hidden">
                <div className="text-sm font-semibold text-white">Pré-proposta (preview)</div>
                <span className="text-xs text-[#9AA4BF]">automática</span>
              </div>

              <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-[#0D1224]/60 p-4 text-xs text-[#DDE6FF] print:border-black/10 print:bg-white print:text-black">
{preProposal}
              </pre>

              <div className="mt-4 text-xs text-[#9AA4BF] print:hidden">
                O prazo sai automático. Ex.: site + sistema + app + portal normalmente cai perto de ~45 dias (dependendo dos extras).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS de impressão simples */}
      <style jsx global>{`
        @media print {
          header, nav, button, a[href="/portfolio"] { display: none !important; }
          pre { font-size: 11px !important; }
        }
      `}</style>
    </main>
  );
}
