import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs"; // precisa de fs

type Lead = {
  id: string;
  createdAt: string;
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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Omit<Lead, "id" | "createdAt">;

    const filePath = path.join(process.cwd(), "data", "leads.json");
    ensureDataFile(filePath);

    const raw = fs.readFileSync(filePath, "utf8");
    const list = JSON.parse(raw) as Lead[];

    const lead: Lead = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...body,
    };

    list.unshift(lead);
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf8");

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "erro ao salvar" },
      { status: 500 }
    );
  }
}
