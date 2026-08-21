import type { Metadata } from "next";
import { LandingPage } from "@/components/landingPage/landing-page";

export const metadata: Metadata = {
  title: "Nexus Analytics",
  description: "Сервис аналитики продаж, заказов и клиентов для растущего бизнеса.",
};

export default function HomePage() {
  return <LandingPage />;
}
