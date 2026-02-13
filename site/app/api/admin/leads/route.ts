import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { readLeadsMongo } from "@/app/lib/leadsStoreMongo";

export const runtime = "nodejs";

function readLeadsJson() {
  const filePath = path.join(process.cwd(), "data", "leads.json");
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : (data?.leads ?? []);
  } catch {
    return [];
  }
}

export async function GET() {
  const useMongo = process.env.USE_MONGO === "1";

  try {
    const leads = useMongo ? await readLeadsMongo() : readLeadsJson();
    return NextResponse.json({ ok: true, leads });
  } catch (err: any) {
    // fallback automático pra JSON se Mongo der erro
    const leads = readLeadsJson();
    return NextResponse.json({
      ok: true,
      leads,
      warn: useMongo ? "Mongo falhou, usando JSON fallback" : undefined,
      error: useMongo ? String(err?.message || err) : undefined,
    });
  }
}
