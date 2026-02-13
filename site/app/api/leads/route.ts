import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { upsertLeadMongo } from "@/app/lib/leadsStoreMongo";

export const runtime = "nodejs";

type LeadStatus = "novo" | "negociando" | "proposta" | "fechado" | "perdido";

type Lead = {
  id: string;
  createdAt: string;
  status: LeadStatus;

  finalValue?: number;
  entrada?: number;
  parcelas?: number;

  name: string;
  phone: string;

  services: any[];
  addons: any[];
  sitePages: number;
  systemUsers: number;
  appType: string;

  totalMin: number;
  totalMax: number;

  prazoMin: number;
  prazoMax: number;
  previsaoMin: string;
  previsaoMax: string;

  details: string;
  preProposal: string;
};

function ensureDataFile(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]", "utf8");
}

function readLeadsJson(filePath: string): Lead[] {
  ensureDataFile(filePath);
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);
  return (Array.isArray(data) ? data : (data?.leads ?? [])) as Lead[];
}

function writeLeadsJson(filePath: string, leads: Lead[]) {
  ensureDataFile(filePath);
  fs.writeFileSync(filePath, JSON.stringify(leads, null, 2), "utf8");
}

export async function POST(req: Request) {
  try {
    const useMongo = process.env.USE_MONGO === "1";
    const body = (await req.json()) as Omit<Lead, "id" | "createdAt" | "status">;

    const lead: Lead = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "novo",
      ...body,
    };

    if (useMongo) {
      // grava no Mongo
      await upsertLeadMongo(lead);
      return NextResponse.json({ ok: true, id: lead.id, storage: "mongo" });
    }

    // fallback JSON
    const filePath = path.join(process.cwd(), "data", "leads.json");
    const list = readLeadsJson(filePath);

    list.unshift(lead);
    writeLeadsJson(filePath, list);

    return NextResponse.json({ ok: true, id: lead.id, storage: "json" });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "erro ao salvar" },
      { status: 500 }
    );
  }
}
