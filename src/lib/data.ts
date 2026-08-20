export type OrderStatus = "paid" | "pending" | "refunded";

export type Order = {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: OrderStatus;
  date: string;
};

export type Kpi = {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  hint: string;
};

export const kpis: Kpi[] = [
  {
    label: "Выручка",
    value: "₽ 1 284 600",
    delta: "+12.4%",
    positive: true,
    hint: "за 30 дней",
  },
  {
    label: "Заказы",
    value: "2 418",
    delta: "+8.1%",
    positive: true,
    hint: "конверсия 3.6%",
  },
  {
    label: "Клиенты",
    value: "864",
    delta: "+4.2%",
    positive: true,
    hint: "новых за месяц",
  },
  {
    label: "Средний чек",
    value: "₽ 531",
    delta: "−1.8%",
    positive: false,
    hint: "vs прошлый период",
  },
];

export const salesByWeek = [
  { label: "Пн", value: 42 },
  { label: "Вт", value: 58 },
  { label: "Ср", value: 51 },
  { label: "Чт", value: 73 },
  { label: "Пт", value: 88 },
  { label: "Сб", value: 64 },
  { label: "Вс", value: 47 },
];

export const channels = [
  { name: "Органика", value: 42, color: "#818cf8" },
  { name: "Реклама", value: 28, color: "#34d399" },
  { name: "Соцсети", value: 18, color: "#fbbf24" },
  { name: "Партнёры", value: 12, color: "#fb7185" },
];

export const orders: Order[] = [
  {
    id: "ORD-10482",
    customer: "Анна Смирнова",
    product: "Pro план",
    amount: 4900,
    status: "paid",
    date: "20 авг",
  },
  {
    id: "ORD-10481",
    customer: "Игорь Петров",
    product: "Starter",
    amount: 990,
    status: "pending",
    date: "20 авг",
  },
  {
    id: "ORD-10480",
    customer: "Мария Козлова",
    product: "Add-on API",
    amount: 1900,
    status: "paid",
    date: "19 авг",
  },
  {
    id: "ORD-10479",
    customer: "Дмитрий Орлов",
    product: "Team план",
    amount: 12900,
    status: "paid",
    date: "19 авг",
  },
  {
    id: "ORD-10478",
    customer: "Елена Волкова",
    product: "Pro план",
    amount: 4900,
    status: "refunded",
    date: "18 авг",
  },
  {
    id: "ORD-10477",
    customer: "Павел Новиков",
    product: "Starter",
    amount: 990,
    status: "paid",
    date: "18 авг",
  },
];

export const products = [
  { name: "Pro план", sales: 842, revenue: "₽ 412 400" },
  { name: "Team план", sales: 216, revenue: "₽ 278 640" },
  { name: "Starter", sales: 1_104, revenue: "₽ 109 296" },
  { name: "Add-on API", sales: 188, revenue: "₽ 357 200" },
];

export const navItems = [
  { href: "#overview", label: "Обзор", icon: "grid" as const },
  { href: "#orders", label: "Заказы", icon: "bag" as const },
  { href: "#customers", label: "Клиенты", icon: "users" as const },
  { href: "#analytics", label: "Аналитика", icon: "chart" as const },
  { href: "#settings", label: "Настройки", icon: "gear" as const },
];
