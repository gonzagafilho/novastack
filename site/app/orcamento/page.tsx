"use client";

import { useMemo, useState } from "react";

type FormState = {
  name: string;
  phone: string;
  service: "Site" | "Sistema" | "App" | "Chatbot" | "Manutenção" | "Outro";
  deadline: "Urgente (até 7 dias)" | "15 dias" | "30 dias" | "60+ dias";
  budget: "Até R$ 1.000" | "R$ 1.000 a R$ 3.000" | "R$ 3.000 a R$ 8.000" | "R$ 8.000+";
  details: string;
};

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

export default function OrcamentoPage() {
  const whatsappNumber = "5561996088711";

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    service: "Site",
    deadline: "30 dias",
    budget: "R$ 1.000 a R$ 3.000",
    details: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Informe seu nome.";
    const digits = onlyDigits(form.phone);
    if (digits.length < 10) e.phone = "WhatsApp inválido (DDD + número).";
    if (!form.details.trim()) e.details = "Descreva o que você precisa (mínimo 10 caracteres).";
    if (form.details.trim().length < 10) e.details = "Descreva um pouco melhor (mínimo 10 caracteres).";
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const message = useMemo(() => {
    const phoneDigits = onlyDigits(form.phone);
    const linhas = [
      "Olá! Quero um orçamento com a NovaStack 👋",
      "",
      `Nome: ${form.name || "-"}`,
      `WhatsApp: ${phoneDigits ? `+55 ${phoneDigits}` : "-"}`,
      `Serviço: ${form.service}`,
      `Prazo: ${form.deadline}`,
      `Orçamento estimado: ${form.budget}`,
      "",
      "Descrição:",
      form.details || "-",
    ];
    return linhas.join("\n");
  }, [form]);

  const waLink = useMemo(() => {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [message]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function markTouched(key: keyof FormState) {
    setTouched((p) => ({ ...p, [key]: true }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({
      name: true,
      phone: true,
      service: true,
      deadline: true,
      budget: true,
      details: true,
    });

    if (!isValid) return;
    window.open(waLink, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen bg-[#070A12] text-[#EAF0FF]">
      {/* Top bar */}
      <header className="border-b border-white/10 bg-[#070A12]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <a href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400/90 to-violet-500/90 shadow-lg shadow-cyan-400/20" />
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight">NovaStack</div>
              <div className="text-xs text-[#9AA4BF]">Orçamento</div>
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

      {/* Body */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute top-20 right-[-120px] h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-2">
          {/* Left */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Solicitar{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                orçamento
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-[#9AA4BF] md:text-base">
              Preencha os campos e a mensagem vai direto pro WhatsApp já organizada.
              Resposta rápida e objetiva.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">Formato</div>
                <div className="mt-1 text-xs text-[#9AA4BF]">Mensagem pronta no WhatsApp</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">Velocidade</div>
                <div className="mt-1 text-xs text-[#9AA4BF]">Orçamento rápido</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">Qualidade</div>
                <div className="mt-1 text-xs text-[#9AA4BF]">Design + performance</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">Suporte</div>
                <div className="mt-1 text-xs text-[#9AA4BF]">Acompanhamento</div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <form onSubmit={onSubmit} className="grid gap-4">
              <div>
                <label className="text-sm text-white/90">Seu nome</label>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  onBlur={() => markTouched("name")}
                  placeholder="Ex: Luiz Gonzaga"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0D1224]/60 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
                />
                {touched.name && errors.name && (
                  <div className="mt-1 text-xs text-red-400">{errors.name}</div>
                )}
              </div>

              <div>
                <label className="text-sm text-white/90">Seu WhatsApp</label>
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  onBlur={() => markTouched("phone")}
                  placeholder="Ex: (61) 99999-9999"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0D1224]/60 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
                />
                {touched.phone && errors.phone && (
                  <div className="mt-1 text-xs text-red-400">{errors.phone}</div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-white/90">Serviço</label>
                  <select
                    value={form.service}
                    onChange={(e) => update("service", e.target.value as FormState["service"])}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0D1224]/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                  >
                    <option className="bg-[#070A12]">Site</option>
                    <option className="bg-[#070A12]">Sistema</option>
                    <option className="bg-[#070A12]">App</option>
                    <option className="bg-[#070A12]">Chatbot</option>
                    <option className="bg-[#070A12]">Manutenção</option>
                    <option className="bg-[#070A12]">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-white/90">Prazo</label>
                  <select
                    value={form.deadline}
                    onChange={(e) =>
                      update("deadline", e.target.value as FormState["deadline"])
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0D1224]/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                  >
                    <option className="bg-[#070A12]">Urgente (até 7 dias)</option>
                    <option className="bg-[#070A12]">15 dias</option>
                    <option className="bg-[#070A12]">30 dias</option>
                    <option className="bg-[#070A12]">60+ dias</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-white/90">Orçamento estimado</label>
                <select
                  value={form.budget}
                  onChange={(e) => update("budget", e.target.value as FormState["budget"])}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0D1224]/60 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                >
                  <option className="bg-[#070A12]">Até R$ 1.000</option>
                  <option className="bg-[#070A12]">R$ 1.000 a R$ 3.000</option>
                  <option className="bg-[#070A12]">R$ 3.000 a R$ 8.000</option>
                  <option className="bg-[#070A12]">R$ 8.000+</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-white/90">Descreva o projeto</label>
                <textarea
                  value={form.details}
                  onChange={(e) => update("details", e.target.value)}
                  onBlur={() => markTouched("details")}
                  rows={5}
                  placeholder="Ex: Quero um site institucional com 5 páginas, formulário e integração com WhatsApp..."
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#0D1224]/60 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
                />
                {touched.details && errors.details && (
                  <div className="mt-1 text-xs text-red-400">{errors.details}</div>
                )}
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-[#070A12] hover:opacity-90 disabled:opacity-50"
                disabled={!isValid && Object.keys(touched).length > 0}
              >
                Enviar no WhatsApp
              </button>

              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="text-center text-xs text-[#9AA4BF] hover:text-white"
              >
                (Abrir link direto do WhatsApp)
              </a>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
