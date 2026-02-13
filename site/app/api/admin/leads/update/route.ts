import { NextResponse } from "next/server";
import { readLeads, writeLeads } from "@/app/lib/leadsStore";

export const runtime = "nodejs";

const STATUS_ALLOWED = new Set([
  "novo",
  "em_analise",
  "proposta_enviada",
  "fechado",
  "perdido",
]);

function toNumberOrUndefined(v: any): number | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  if (Number.isNaN(n)) return undefined;
  return n;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const id = String(body?.id || "").trim();
    if (!id) {
      return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });
    }

    const status = body?.status !== undefined ? String(body.status) : undefined;
    if (status !== undefined && !STATUS_ALLOWED.has(status)) {
      return NextResponse.json({ ok: false, error: "Status inválido" }, { status: 400 });
    }

    const finalValue = toNumberOrUndefined(body?.finalValue);
    const entrada = toNumberOrUndefined(body?.entrada);
    const parcelas = toNumberOrUndefined(body?.parcelas);

    const leads = await readLeads();
    const idx = leads.findIndex((l: any) => String(l?.id) === id);

    if (idx === -1) {
      return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
    }

    const lead = leads[idx];

    // histórico (diff)
    const now = new Date().toISOString();
    const changes: any = {};

    function track(field: string, from: any, to: any) {
      if (to === undefined) return;
      if (from !== to) changes[field] = { from, to };
    }

    track("status", lead.status ?? "novo", status);
    track("finalValue", lead.finalValue ?? null, finalValue ?? null);
    track("entrada", lead.entrada ?? null, entrada ?? null);
    track("parcelas", lead.parcelas ?? null, parcelas ?? null);

    const nextStatus = status ?? lead.status ?? "novo";

    const updatedLead = {
      ...lead,
      status: nextStatus,
      finalValue: finalValue ?? lead.finalValue,
      entrada: entrada ?? lead.entrada,
      parcelas: parcelas ?? lead.parcelas,
      updatedAt: now,
      closedAt: nextStatus === "fechado" ? (lead.closedAt ?? now) : (lead.closedAt ?? null),
      history: [
        ...(Array.isArray(lead.history) ? lead.history : []),
        { at: now, action: "update", changes },
      ],
    };

    leads[idx] = updatedLead;
    await writeLeads(leads);

    return NextResponse.json({ ok: true, lead: updatedLead });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Erro ao atualizar lead" },
      { status: 500 }
    );
  }
}
