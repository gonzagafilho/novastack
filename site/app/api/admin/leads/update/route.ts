import { NextResponse } from "next/server";
import { readLeads, writeLeads } from "@/app/lib/leadsStore";
import { findLeadMongo, upsertLeadMongo } from "@/app/lib/leadsStoreMongo";

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

function jsonError(msg: string, status = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status });
}

export async function POST(req: Request) {
  try {
    const useMongo = process.env.USE_MONGO === "1";
    const body = await req.json();

    const id = String(body?.id || "").trim();
    if (!id) return jsonError("missing id", 400);

    const status = body?.status !== undefined ? String(body.status) : undefined;
    if (status !== undefined && !STATUS_ALLOWED.has(status)) {
      return jsonError("Status inválido", 400);
    }

    const finalValue = toNumberOrUndefined(body?.finalValue);
    const entrada = toNumberOrUndefined(body?.entrada);
    const parcelas = toNumberOrUndefined(body?.parcelas);

    // =========================
    // 1) CARREGAR LEAD
    // =========================
    let lead: any | null = null;
    let leadsJson: any[] | null = null;
    let idx = -1;

    if (useMongo) {
      lead = await findLeadMongo(id);
      if (!lead) return jsonError("not found", 404);
    } else {
      leadsJson = await readLeads();
      idx = leadsJson.findIndex((l: any) => String(l?.id) === id);
      if (idx === -1) return jsonError("not found", 404);
      lead = leadsJson[idx];
    }

    // =========================
    // 2) HISTÓRICO (DIFF)
    // =========================
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

    // =========================
    // 3) SALVAR
    // =========================
    if (useMongo) {
      await upsertLeadMongo(updatedLead);
      return NextResponse.json({ ok: true, lead: updatedLead, storage: "mongo" });
    }

    // JSON fallback
    leadsJson![idx] = updatedLead;
    await writeLeads(leadsJson!);
    return NextResponse.json({ ok: true, lead: updatedLead, storage: "json" });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Erro ao atualizar lead" },
      { status: 500 }
    );
  }
}
