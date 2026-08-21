import type { Metadata } from "next";
import { AuthGate } from "@/components/authGate/auth-gate";

export const metadata: Metadata = {
  title: "Дашборд",
  description: "Аналитический дашборд Nexus с заказами, клиентами и отчётами.",
};

export default function DashboardPage() {
  return <AuthGate />;
}
