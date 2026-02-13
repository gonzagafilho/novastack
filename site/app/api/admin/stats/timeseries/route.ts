import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { readLeadsMongo } from "@/app/lib/leadsStoreMongo";

type Lead = {
  id: string;
  createdAt?: string; // ISO
  status?: string;
  valorFechado?: number | string;
  finalValue?: number | string;
};

function toNumber(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "string") {
    const n = Number(v.replace(/[^\d.,-]/g, "").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function safeDate(v?: string): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function dayKey(d: Date) {
  // YYYY-MM-DD
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function readLeadsJson(): Promise<Lead[]> {
  const filePath = path.join(process.cwd(), "data", "leads.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : (parsed?.leads ?? []);
}

function resolvePeriod(url: URL) {
  const days = Number(url.searchParams.get("days") || "");
  const fromStr = url.searchParams.get("from") || "";
  const toStr = url.searchParams.get("to") || "";

  // default: 30 dias (se nada vier)
  if ((!fromStr && !toStr) && (!Number.isFinite(days) || days <= 0)) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end };
  }

  if (Number.isFinite(days) && days > 0) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return { start, end };
  }

  const start = fromStr ? new Date(fromStr) : new Date(0);
  const end = toStr ? new Date(toStr) : new Date();
  return { start, end };
}

function filterByPeriod(leadsAll: Lead[], start: Date, end: Date): Lead[] {
  return leadsAll.filter((l) => {
    const d = safeDate(l.createdAt);
    if (!d) return true; // mantém se não tem data (compat)
    return d >= start && d <= end;
  });
}

export async function GET(req: Request) {

  try {
    const useMongo = process.env.USE_MONGO === "1";
    const url = new URL(req.url);

    const { start, end } = resolvePeriod(url);

    const leadsAll: Lead[] = useMongo ? (await readLeadsMongo() as any) : await readLeadsJson();
    const leads = filterByPeriod(leadsAll, start, end);

    // monta mapa por dia
    const map = new Map<string, { date: string; leads: number; closed: number; revenueClosed: number }>();

    for (const l of leads) {
      const d = safeDate(l.createdAt);
      if (!d) continue;

      const key = dayKey(d);
      if (!map.has(key)) {
        map.set(key, { date: key, leads: 0, closed: 0, revenueClosed: 0 });
      }

      const row = map.get(key)!;
      row.leads += 1;

      if ((l.status || "") === "fechado") {
        row.closed += 1;
        row.revenueClosed += toNumber((l as any).finalValue ?? (l as any).valorFechado);
      }
    }

    // preencher dias vazios (linha contínua no gráfico)
    const out: { date: string; leads: number; closed: number; revenueClosed: number }[] = [];
    const cur = new Date(start);
    cur.setHours(0, 0, 0, 0);
    const endDay = new Date(end);
    endDay.setHours(0, 0, 0, 0);

    while (cur <= endDay) {
      const key = dayKey(cur);
      const row = map.get(key) || { date: key, leads: 0, closed: 0, revenueClosed: 0 };
      out.push(row);
      cur.setDate(cur.getDate() + 1);
    }

    return NextResponse.json({
      ok: true,
      storage: useMongo ? "mongo" : "json",
      start: start.toISOString(),
      end: end.toISOString(),
      series: out,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Erro ao gerar timeseries" },
      { status: 500 }
    );
  }
}
