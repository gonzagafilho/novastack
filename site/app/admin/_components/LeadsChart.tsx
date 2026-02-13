"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

type Row = { date: string; leads: number; closed: number; revenueClosed: number };

export default function LeadsChart({ days = 30 }: { days?: number }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  const data = useMemo(() => rows, [rows]);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/admin/stats/timeseries?days=${days}`, { cache: "no-store" });
        const json = await res.json();

        if (!res.ok || !json?.ok) {
          throw new Error(json?.error || `HTTP ${res.status}`);
        }

        if (alive) setRows(json.series || []);
      } catch (e: any) {
        if (alive) setError(e?.message || "Erro ao carregar gráfico");
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [days]);

  if (loading) return <div className="text-sm opacity-80">Carregando gráfico...</div>;
  if (error) return <div className="text-sm text-red-500">Erro no gráfico: {error}</div>;
  if (!data?.length) return <div className="text-sm opacity-80">Sem dados no período.</div>;

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-base font-semibold">Leads por dia</div>
          <div className="text-xs opacity-70">Últimos {days} dias</div>
        </div>
      </div>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="leads" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="closed" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
