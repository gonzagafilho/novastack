import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { readLeadsMongo } from "@/app/lib/leadsStoreMongo";

type Lead = {
  id: string;
  name?: string;
  phone?: string;
  createdAt?: string; // ISO
  status?: string;

  // compat
  valorFechado?: number | string;

  // atual
  finalValue?: number | string;
  totalMin?: number | string;
  totalMax?: number | string;
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

async function readLeadsJson(): Promise<Lead[]> {
  const filePath = path.join(process.cwd(), "data", "leads.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : (parsed?.leads ?? []);
}

function filterByPeriod(leadsAll: Lead[], url: URL): Lead[] {
  const days = Number(url.searchParams.get("days") || "");
  const fromStr = url.searchParams.get("from") || "";
  const toStr = url.searchParams.get("to") || "";

  let leads = leadsAll;

  if (Number.isFinite(days) && days > 0) {
    const start = new Date();
    start.setDate(start.getDate() - days);

    leads = leads.filter((l) => {
      const d = safeDate(l.createdAt);
      return d ? d >= start : true;
    });
  } else if (fromStr || toStr) {
    const from = fromStr ? new Date(fromStr) : null;
    const to = toStr ? new Date(toStr) : null;

    leads = leads.filter((l) => {
      const d = safeDate(l.createdAt);
      if (!d) return true;
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }

  return leads;
}

export async function GET(req: Request) {
  try {
    const useMongo = process.env.USE_MONGO === "1";
    const url = new URL(req.url);

    // 1) leitura
    const leadsAll: Lead[] = useMongo ? (await readLeadsMongo() as any) : await readLeadsJson();

    // 2) período
    const leads = filterByPeriod(leadsAll, url);

    // 3) contagens
    const total = leads.length;

    const byStatus: Record<string, number> = {};
    for (const l of leads) {
      const st = (l.status || "novo").toString();
      byStatus[st] = (byStatus[st] || 0) + 1;
    }

    const closed = (byStatus["fechado"] || 0);
    const lost = (byStatus["perdido"] || 0);

    // 4) receita fechada (aceita finalValue e valorFechado)
    const revenueClosed = leads
      .filter((l) => (l.status || "") === "fechado")
      .reduce((sum, l: any) => sum + toNumber(l.finalValue ?? l.valorFechado), 0);

    const ticketAvg = closed > 0 ? revenueClosed / closed : 0;

    // 5) receita estimada (média do min/max)
    const revenueEstimated = leads.reduce((sum, l: any) => {
      const min = toNumber(l.totalMin);
      const max = toNumber(l.totalMax);
      if (min > 0 && max > 0) return sum + (min + max) / 2;
      return sum;
    }, 0);

    const conversion = total > 0 ? (closed / total) * 100 : 0;

    return NextResponse.json({
      ok: true,
      storage: useMongo ? "mongo" : "json",
      total,
      closed,
      lost,
      conversion: Number(conversion.toFixed(2)),
      revenueEstimated: Number(revenueEstimated.toFixed(2)),
      revenueClosed: Number(revenueClosed.toFixed(2)),
      ticketAvg: Number(ticketAvg.toFixed(2)),
      byStatus,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Erro ao gerar stats" },
      { status: 500 }
    );
  }
}
