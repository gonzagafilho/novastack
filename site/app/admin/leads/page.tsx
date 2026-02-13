"use client";

import { useEffect, useMemo, useState } from "react";
import LeadsChart from "../_components/LeadsChart";

type LeadStatus = "novo" | "em_analise" | "proposta_enviada" | "fechado" | "perdido";
type Lead = {
  id: string;
  createdAt: string;

  status?: LeadStatus;

  finalValue?: number;
  entrada?: number;
  parcelas?: number;

  name: string;
  phone: string;

  prazoMin: number;
  prazoMax: number;
  previsaoMin: string;
  previsaoMax: string;

  totalMin: number;
  totalMax: number;

  preProposal: string;
};

function money(n?: number) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function brl(v: number) {
  return (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AdminLeadsPage() {
  // DASHBOARD STATS
  const [stats, setStats] = useState<any>(null);
  const [days, setDays] = useState<number>(30);
  const [loadingStats, setLoadingStats] = useState(false);

  // LEADS
  const [data, setData] = useState<Lead[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState<LeadStatus | "todos">("todos");
  const [q, setQ] = useState("");

  type SortKey = "createdAt" | "name" | "totalMax" | "finalValue";
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  async function loadLeads() {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads", { cache: "no-store" });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "erro");
      setData(j.leads || []);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    setLoadingStats(true);
    try {
      const url = days === 0 ? "/api/admin/stats" : `/api/admin/stats?days=${days}`;
      const r = await fetch(url, { cache: "no-store" });
      const j = await r.json();
      setStats(j);
    } catch {
      setStats(null);
    } finally {
      setLoadingStats(false);
    }
  }

  // carrega ao abrir a página
  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // atualiza stats quando muda período
  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  async function updateLead(id: string, patch: Partial<Lead>) {
    setErr("");
    try {
      const res = await fetch("/api/admin/leads/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "erro ao salvar");
      await loadLeads();
      await loadStats();
    } catch (e: any) {
      setErr(e.message);
    }
  }

  const filteredSorted = useMemo(() => {
    const term = q.trim().toLowerCase();

    const filtered = data.filter((l) => {
      const stOk = statusFilter === "todos" ? true : (l.status || "novo") === statusFilter;

      if (!term) return stOk;

      const nameOk = (l.name || "").toLowerCase().includes(term);
      const phoneOk = (l.phone || "").toLowerCase().includes(term);

      return stOk && (nameOk || phoneOk);
    });

    const dir = sortDir === "asc" ? 1 : -1;
    const getNumber = (v: any) => (typeof v === "number" && !Number.isNaN(v) ? v : 0);

    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === "createdAt") {
        const av = new Date(a.createdAt).getTime();
        const bv = new Date(b.createdAt).getTime();
        return (av - bv) * dir;
      }

      if (sortKey === "name") {
        const av = (a.name || "").toLowerCase();
        const bv = (b.name || "").toLowerCase();
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      }

      if (sortKey === "totalMax") {
        const av = getNumber(a.totalMax);
        const bv = getNumber(b.totalMax);
        return (av - bv) * dir;
      }

      const av = getNumber(a.finalValue);
      const bv = getNumber(b.finalValue);
      return (av - bv) * dir;
    });

    return sorted;
  }, [data, statusFilter, q, sortKey, sortDir]);

  return (
    <main className="min-h-screen bg-[#070A12] text-[#EAF0FF] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin • Orçamentos</h1>
            <p className="mt-2 text-sm text-[#9AA4BF]">
              Painel protegido por login. Leads carregam automaticamente.
            </p>
          </div>

          <button
            onClick={loadLeads}
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-[#070A12] hover:opacity-90 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Atualizando..." : "Atualizar"}
          </button>
          <button
            onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
        >
            Sair
        </button>

        </div>

        {err && <div className="mt-4 text-sm text-red-400">{err}</div>}

        {/* DASHBOARD */}
        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-white/70">Período:</span>

            <button
              onClick={() => setDays(0)}
              className={`px-3 py-1 rounded-lg text-sm border ${
                days === 0 ? "bg-white/15 border-white/30" : "border-white/10 hover:bg-white/10"
              }`}
            >
              Tudo
            </button>

            <button
              onClick={() => setDays(7)}
              className={`px-3 py-1 rounded-lg text-sm border ${
                days === 7 ? "bg-white/15 border-white/30" : "border-white/10 hover:bg-white/10"
              }`}
            >
              7 dias
            </button>

            <button
              onClick={() => setDays(30)}
              className={`px-3 py-1 rounded-lg text-sm border ${
                days === 30 ? "bg-white/15 border-white/30" : "border-white/10 hover:bg-white/10"
              }`}
            >
              30 dias
            </button>

            <button
              onClick={() => setDays(90)}
              className={`px-3 py-1 rounded-lg text-sm border ${
                days === 90 ? "bg-white/15 border-white/30" : "border-white/10 hover:bg-white/10"
              }`}
            >
              90 dias
            </button>

            {loadingStats && (
              <span className="text-xs text-white/50 ml-2">Carregando métricas…</span>
            )}
          </div>
          {/* GRÁFICO (usa o mesmo período dos botões) */}
          <div className="mt-4">
            <LeadsChart days={days === 0 ? 365 : days} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/60">Leads</div>
              <div className="text-2xl font-semibold">{stats?.total ?? "-"}</div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
              <div className="text-xs text-emerald-200/80">Fechados</div>
              <div className="text-2xl font-semibold">{stats?.closed ?? "-"}</div>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
              <div className="text-xs text-rose-200/80">Perdidos</div>
              <div className="text-2xl font-semibold">{stats?.lost ?? "-"}</div>
            </div>

            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3">
              <div className="text-xs text-sky-200/80">Conversão</div>
              <div className="text-2xl font-semibold">
                {stats?.conversion != null ? `${stats.conversion}%` : "-"}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/60">Receita Estimada</div>
              <div className="text-lg font-semibold">
                {stats?.revenueEstimated != null ? brl(stats.revenueEstimated) : "-"}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/60">Receita Fechada</div>
              <div className="text-lg font-semibold">
                {stats?.revenueClosed != null ? brl(stats.revenueClosed) : "-"}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/60">Ticket Médio</div>
              <div className="text-lg font-semibold">
                {stats?.ticketAvg != null ? brl(stats.ticketAvg) : "-"}
              </div>
            </div>
          </div>
        </div>

        {/* FILTROS + ORDENAÇÃO */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-xl border border-white/10 bg-[#0D1224]/60 px-3 py-2 text-xs text-white"
              >
                <option value="todos">Todos</option>
                <option value="novo">Novo</option>
                <option value="em_analise">Em análise</option>
                <option value="proposta_enviada">Proposta enviada</option>
                <option value="fechado">Fechado</option>
                <option value="perdido">Perdido</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Ordenar por:</span>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as any)}
                className="rounded-xl border border-white/10 bg-[#0D1224]/60 px-3 py-2 text-xs text-white"
              >
                <option value="createdAt">Data</option>
                <option value="name">Nome</option>
                <option value="totalMax">Valor estimado (máx.)</option>
                <option value="finalValue">Valor fechado</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
              title="Alternar ordem"
            >
              {sortDir === "asc" ? "Asc ↑" : "Desc ↓"}
            </button>

            <div className="flex-1 min-w-[220px]">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por nome ou telefone…"
                className="w-full rounded-xl border border-white/10 bg-[#0D1224]/60 px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setStatusFilter("todos");
                setSortKey("createdAt");
                setSortDir("desc");
                setQ("");
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
            >
              Limpar
            </button>
          </div>

          <div className="mt-3 text-xs text-white/50">
            Mostrando <b className="text-white">{filteredSorted.length}</b> de{" "}
            <b className="text-white">{data.length}</b> leads
          </div>
        </div>

        {/* LISTA */}
        <div className="mt-8 grid gap-4">
          {filteredSorted.map((l) => {
            const waText = encodeURIComponent(l.preProposal || "");
            const waLink = `https://wa.me/55${l.phone}?text=${waText}`;

            return (
              <div key={l.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">{l.name}</div>
                    <div className="text-sm text-[#9AA4BF]">
                      {new Date(l.createdAt).toLocaleString("pt-BR")}
                    </div>

                    <div className="mt-2 text-xs text-[#9AA4BF]">
                      Status: <b className="text-white">{(l.status || "novo").toUpperCase()}</b>
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
                    onChange={(e) => updateLead(l.id, { status: e.target.value as LeadStatus })}
                  >
                    <option value="novo">Novo</option>
                    <option value="em_analise">Em análise</option>
                    <option value="proposta_enviada">Proposta enviada</option>
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
                    href={`/api/admin/proposta?id=${encodeURIComponent(l.id)}`}
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

          {filteredSorted.length === 0 && (
            <div className="mt-6 text-sm text-[#9AA4BF]">
              Nenhum lead encontrado com os filtros atuais.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
