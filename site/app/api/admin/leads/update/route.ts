import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

function getFile() {
  return path.join(process.cwd(), "data", "leads.json");
}

export async function POST(req: Request) {
  try {
    const { id, status, finalValue, entrada, parcelas } = await req.json();

    const file = getFile();
    if (!fs.existsSync(file)) {
      return NextResponse.json({ ok: false, error: "no data" }, { status: 400 });
    }

    const raw = fs.readFileSync(file, "utf8");
    const leads = JSON.parse(raw);

    const index = leads.findIndex((l: any) => l.id === id);
    if (index === -1) {
      return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
    }

    leads[index] = {
      ...leads[index],
      status: status ?? leads[index].status,
      finalValue: finalValue ?? leads[index].finalValue,
      entrada: entrada ?? leads[index].entrada,
      parcelas: parcelas ?? leads[index].parcelas,
    };

    fs.writeFileSync(file, JSON.stringify(leads, null, 2), "utf8");

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
