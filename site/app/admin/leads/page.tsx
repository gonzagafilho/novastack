"use client";

import { useEffect, useMemo, useState } from "react";

type Lead = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  totalMin: number;
  totalMax: number;
  prazoMin: number;
  prazoMax: number;
  previsaoMin: string;
  previsaoMax: string;
  preProposal: string;
};

export default function AdminLeadsPage() {
  const [key, setKey] = useState("");
  const [data, setData] = useState<Lead[]>([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const res = await fetch(`/api/admin/leads?key=${encodeURIComponent(key)}`);
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "erro");
      setData(j.leads || []);
    } catch (e: any) {
      setErr(e.message);
    }
  }

  const sorted = useMemo(() => data, [data]);

  return (
    <main className="min-h-screen bg-[#070A12] text-[#EAF0FF] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Admin • Orçamentos</h1>
        <p className="mt-2 text-sm text-[#9AA4BF]">
          Digite a chave e carregue os leads salvos.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="ADMIN_KEY"
            className="w-64 rounded-xl border border-white/10 bg-[#0D1224]/60 px-4 py-3 text-sm text-white outline-none"
          />
          <button
            onClick={load}
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-[#070A12] hover:opacity-90"
          >
            Carregar
          </button>
          {err && <div className="text-sm text-red-400">{err}</div>}
        </div>

        <div className="mt-8 grid gap-4">
          {sorted.map((l) => (
            <div key={l.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{l.name}</div>
                  <div className="text-sm text-[#9AA4BF]">
                    {new Date(l.createdAt).toLocaleString("pt-BR")}
                  </div>
                </div>
                <div className="text-sm text-[#DDE6FF]">
                  <div>Prazo: <b>{l.prazoMin}-{l.prazoMax}</b> dias úteis</div>
                  <div>Previsão: <b>{l.previsaoMin}</b> a <b>{l.previsaoMax}</b></div>
                </div>
              </div>

              <div className="mt-3 text-sm text-[#DDE6FF]">
                Total: <b>R$ {l.totalMin} - R$ {l.totalMax}</b>
              </div>

              <div className="mt-4 flex gap-3">
                <a
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                  href={`https://wa.me/55${l.phone}?text=${encodeURIComponent(l.preProposal)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir WhatsApp
                </a>

                <button
                  className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
                  onClick={() => navigator.clipboard.writeText(l.preProposal)}
                >
                  Copiar pré-proposta
                </button>
              </div>

              <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-[#0D1224]/60 p-4 text-xs text-[#DDE6FF]">
{l.preProposal}
              </pre>
            </div>
          ))}

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
