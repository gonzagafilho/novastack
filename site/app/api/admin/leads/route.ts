import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

function readLeads() {
  const filePath = path.join(process.cwd(), "data", "leads.json");
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

export async function GET() {

  return NextResponse.json({ ok: true, leads: readLeads() });
}
