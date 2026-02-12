import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

export const runtime = "nodejs";

function getLeadsFile() {
  return path.join(process.cwd(), "data", "leads.json");
}

function loadLeads() {
  const file = getLeadsFile();
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function formatMoney(n?: number) {
  if (typeof n !== "number") return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key") || "";
  const id = url.searchParams.get("id") || "";

  const ADMIN_KEY = process.env.ADMIN_KEY || "";
  if (!ADMIN_KEY || key !== ADMIN_KEY) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const leads = loadLeads();
  const lead = leads.find((l: any) => l.id === id);
  if (!lead) {
    return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  }

  // PDF em memória
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Buffer[] = [];

  doc.on("data", (c) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  // Cabeçalho
  doc.fontSize(20).text("PROPOSTA COMERCIAL", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#444").text("NovaStack Desenvolvimento", { align: "center" });
  doc.fillColor("black");
  doc.moveDown(1);

  // Cliente
  doc.fontSize(12).text("Dados do Cliente", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11).text(`Nome: ${lead.name}`);
  doc.text(`Telefone: ${lead.phone}`);
  doc.text(`Data do pedido: ${new Date(lead.createdAt).toLocaleString("pt-BR")}`);
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
  doc.fontSize(11).text(`Prazo estimado: ${lead.prazoMin} a ${lead.prazoMax} dias úteis`);
  doc.text(`Previsão: ${lead.previsaoMin} a ${lead.previsaoMax}`);
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
  doc.fontSize(11).text(lead.details || "—", { width: 500 });

  doc.moveDown(1.5);

  // Validade + assinatura
  doc.fontSize(10).fillColor("#444").text("Validade desta proposta: 7 dias.", { align: "left" });
  doc.fillColor("black");
  doc.moveDown(2);

  doc.text("________________________________________");
  doc.text("NovaStack Desenvolvimento");

  doc.end();

  const pdf = await done;

// converte Buffer -> Uint8Array (BodyInit compatível)
const body = new Uint8Array(pdf);

return new NextResponse(body, {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename="proposta-${lead.id}.pdf"`,
    "Cache-Control": "no-store",
  },
});
}
