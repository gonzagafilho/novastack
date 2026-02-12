import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "NovaStack Desenvolvimento | Sites, Sistemas, Apps e Chatbots",
  description:
    "Criamos sites profissionais, sistemas web, apps e chatbots com foco em performance, SEO e conversão.",
};

export default function HomePage() {
  return <HomeClient />;
}
