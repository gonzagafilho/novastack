import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orçamento | NovaStack Desenvolvimento",
  description:
    "Solicite um orçamento rápido para sites, sistemas, apps e chatbots. Resposta direta no WhatsApp.",
};

export default function OrcamentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
