"use client";

import { useMemo, useState } from "react";

type LeadStatus = "novo" | "negociando" | "proposta" | "fechado" | "perdido";

type Lead = {
  id: string;
  createdAt: string;

  status?: LeadStatus;

  // negociação
  finalValue?: number;
  entrada?: number;
  parcelas?: number;

  // cliente
  name: string;
  phone: string;

  // prazos
  prazoMin: number;
  prazoMax: number;
  previsaoMin: string;
  previsaoMax: string;

  // valores estimados
  totalMin: number;
  totalMax: number;

  // texto pronto
  preProposal: string;
};

function money(n?: number) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AdminLeadsPage() {
  const [key, setKey] = useState("");
  const [data, setData] = useState<Lead[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads?key=${encodeURIComponent(key)}`);
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "erro");
      setData(j.leads || []);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateLead(id: string, patch: Partial<Lead>) {
    setErr("");
    try {
      const res = await fetch("/api/admin/leads/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, id, ...patch }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "erro ao salvar");
      await load();
    } catch (e: any) {
      setErr(e.message);
    }
  }

  const sorted = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [data]);

  return (
    <main className="min-h-screen bg-[#070A12] text-[#EAF0FF] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Admin • Orçamentos</h1>
        <p className="mt-2 text-sm text-[#9AA4BF]">
          Digite a chave e carregue os leads salvos.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="ADMIN_KEY"
            className="w-64 rounded-xl border border-white/10 bg-[#0D1224]/60 px-4 py-3 text-sm text-white outline-none"
          />

          <button
            onClick={load}
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-[#070A12] hover:opacity-90 disabled:opacity-60"
            disabled={!key || loading}
          >
            {loading ? "Carregando..." : "Carregar"}
          </button>

          {err && <div className="text-sm text-red-400">{err}</div>}
        </div>

        <div className="mt-8 grid gap-4">
          {sorted.map((l) => {
            const waText = encodeURIComponent(l.preProposal || "");
            const waLink = `https://wa.me/55${l.phone}?text=${waText}`;

            return (
              <div
                key={l.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">{l.name}</div>
                    <div className="text-sm text-[#9AA4BF]">
                      {new Date(l.createdAt).toLocaleString("pt-BR")}
                    </div>

                    <div className="mt-2 text-xs text-[#9AA4BF]">
                      Status:{" "}
                      <b className="text-white">{(l.status || "novo").toUpperCase()}</b>
                    </div>
                  </div>

                  <div className="text-sm text-[#DDE6FF]">
                    <div>
                      Prazo: <b>{l.prazoMin}-{l.prazoMax}</b> dias úteis
                    </div>
                    <div>
                      Previsão: <b>{l.previsaoMin}</b> a <b>{l.previsaoMax}</b>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-sm text-[#DDE6FF]">
                  Estimativa: <b>{money(l.totalMin)} - {money(l.totalMax)}</b>
                </div>

                {/* Negociação */}
                <div className="mt-4 grid gap-2 md:grid-cols-4">
                  <select
                    defaultValue={l.status || "novo"}
                    className="rounded-xl border border-white/10 bg-[#0D1224]/60 px-3 py-2 text-xs text-white"
                    onChange={(e) =>
                      updateLead(l.id, { status: e.target.value as LeadStatus })
                    }
                  >
                    <option value="novo">Novo</option>
                    <option value="negociando">Em negociação</option>
                    <option value="proposta">Proposta enviada</option>
                    <option value="fechado">Fechado</option>
                    <option value="perdido">Perdido</option>
                  </select>

                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Valor fechado"
                    defaultValue={l.finalValue ?? ""}
                    className="rounded-xl border border-white/10 bg-[#0D1224]/60 px-3 py-2 text-xs text-white"
                    onBlur={(e) =>
                      updateLead(l.id, {
                        finalValue: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />

                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Entrada"
                    defaultValue={l.entrada ?? ""}
                    className="rounded-xl border border-white/10 bg-[#0D1224]/60 px-3 py-2 text-xs text-white"
                    onBlur={(e) =>
                      updateLead(l.id, {
                        entrada: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />

                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Parcelas"
                    defaultValue={l.parcelas ?? ""}
                    className="rounded-xl border border-white/10 bg-[#0D1224]/60 px-3 py-2 text-xs text-white"
                    onBlur={(e) =>
                      updateLead(l.id, {
                        parcelas: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>

                <div className="mt-2 text-xs text-[#9AA4BF]">
                  Fechado: <b className="text-white">{money(l.finalValue)}</b>{" "}
                  • Entrada: <b className="text-white">{money(l.entrada)}</b>{" "}
                  • Parcelas: <b className="text-white">{l.parcelas ?? "—"}</b>
                </div>

                {/* Ações */}
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir WhatsApp
                  </a>

                  <a
                    className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-[#070A12] hover:opacity-90"
                    href={`/api/admin/proposta?key=${encodeURIComponent(
                      key
                    )}&id=${encodeURIComponent(l.id)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Gerar PDF
                  </a>

                  <button
                    className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
                    onClick={() => navigator.clipboard.writeText(l.preProposal || "")}
                  >
                    Copiar pré-proposta
                  </button>
                </div>

                <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-[#0D1224]/60 p-4 text-xs text-[#DDE6FF]">
{l.preProposal}
                </pre>
              </div>
            );
          })}

          {sorted.length === 0 && (
            <div className="mt-6 text-sm text-[#9AA4BF]">
              Nenhum lead carregado ainda.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
