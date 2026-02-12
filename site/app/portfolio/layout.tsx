import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfólio | NovaStack Desenvolvimento",
  description:
    "Confira nossos cases de sites, sistemas, apps e chatbots. Projetos modernos, rápidos e focados em resultado.",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
