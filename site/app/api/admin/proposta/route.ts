import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfkit = require("pdfkit");
const PDFDocument = pdfkit?.default ?? pdfkit;

export const runtime = "nodejs";

function getLeadsFile() {
  return path.join(process.cwd(), "data", "leads.json");
}

function loadLeads() {
  const file = getLeadsFile();
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : data?.leads ?? [];
  } catch {
    return [];
  }
}

function formatMoney(n?: number) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function safeDateBR(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id") || "";

    if (!id) {
      return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });
    }

    const leads = loadLeads();
    const lead = leads.find((l: any) => String(l?.id) === String(id));

    if (!lead) {
      return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // ✅ força fonte TTF local (evita depender de Helvetica.afm)
    // Se não existir, não quebra: apenas segue sem registrar.
    try {
      const sans = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf";
      const bold = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";
      if (fs.existsSync(sans)) doc.registerFont("Sans", sans);
      if (fs.existsSync(bold)) doc.registerFont("SansBold", bold);
      if (fs.existsSync(sans)) doc.font("Sans");
    } catch {}

    const chunks: Buffer[] = [];

    doc.on("data", (c: Buffer | Uint8Array) => chunks.push(Buffer.from(c)));

    const done: Promise<Buffer> = new Promise((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });

    // Cabeçalho
    if (typeof doc.font === "function") {
      try {
        doc.font("SansBold");
      } catch {}
    }
    doc.fontSize(20).text("PROPOSTA COMERCIAL", { align: "center" });

    // volta pro normal
    if (typeof doc.font === "function") {
      try {
        doc.font("Sans");
      } catch {}
    }

    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#444").text("NovaStack Desenvolvimento", { align: "center" });
    doc.fillColor("black");
    doc.moveDown(1);

    // Cliente
    doc.fontSize(12).text("Dados do Cliente", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Nome: ${lead.name ?? "—"}`);
    doc.text(`Telefone: ${lead.phone ?? "—"}`);
    doc.text(`Data do pedido: ${safeDateBR(lead.createdAt)}`);
    doc.moveDown(1);

    // Escopo
    doc.fontSize(12).text("Escopo Selecionado", { underline: true });
    doc.moveDown(0.5);

    const services = (lead.services || []).map((s: any) => s.label || s.name || s).join(", ");
    const addons = (lead.addons || []).map((a: any) => a.label || a.name || a).join(", ");

    doc.fontSize(11).text(`Serviços: ${services || "—"}`);
    doc.text(`Adicionais: ${addons || "—"}`);
    doc.text(`Páginas (site): ${lead.sitePages ?? "—"}`);
    doc.text(`Usuários (sistema): ${lead.systemUsers ?? "—"}`);
    doc.text(`App: ${lead.appType ?? "—"}`);
    doc.moveDown(1);

    // Prazo
    doc.fontSize(12).text("Prazo", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Prazo estimado: ${lead.prazoMin ?? "—"} a ${lead.prazoMax ?? "—"} dias úteis`);
    doc.text(`Previsão: ${lead.previsaoMin ?? "—"} a ${lead.previsaoMax ?? "—"}`);
    doc.moveDown(1);

    // Valores
    doc.fontSize(12).text("Investimento", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Estimativa: ${formatMoney(lead.totalMin)} a ${formatMoney(lead.totalMax)}`);
    doc.moveDown(0.5);
    doc.text(`Valor fechado: ${formatMoney(lead.finalValue)}`);
    doc.text(`Entrada: ${formatMoney(lead.entrada)}`);
    doc.text(`Parcelas: ${lead.parcelas ?? "—"}`);
    doc.moveDown(1);

    // Observações
    doc.fontSize(12).text("Observações", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(lead.details || lead.preProposal || "—", { width: 500 });
    doc.moveDown(1.5);

    // Validade + assinatura
    doc.fontSize(10).fillColor("#444").text("Validade desta proposta: 7 dias.", { align: "left" });
    doc.fillColor("black");
    doc.moveDown(2);

    doc.text("________________________________________");
    doc.text("NovaStack Desenvolvimento");

    doc.end();

    const pdf = await done;
    const body = new Uint8Array(pdf);

    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="proposta-${String(lead.id)}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("PDF ERROR:", err);
    return NextResponse.json({ ok: false, error: err?.message || "Erro ao gerar PDF" }, { status: 500 });
  }
}
