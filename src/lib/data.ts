export type CustomerStatus = "active" | "trial" | "churned";
export type CustomerSegment = "new" | "regular" | "vip";
export type OrderStatus = "paid" | "pending" | "refunded";
export type PaymentMethod = "card" | "invoice" | "sbp";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  plan: string;
  status: CustomerStatus;
  segment: CustomerSegment;
  since: string;
  manager: string;
  notes: string;
};

export type Order = {
  id: string;
  customer: string;
  email: string;
  product: string;
  quantity: number;
  amount: number;
  status: OrderStatus;
  date: string;
  time: string;
  payment: PaymentMethod;
  channel: string;
  city: string;
  comment: string;
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

export const salesByMonth = [
  { label: "Мар", value: 210 },
  { label: "Апр", value: 248 },
  { label: "Май", value: 236 },
  { label: "Июн", value: 291 },
  { label: "Июл", value: 318 },
  { label: "Авг", value: 274 },
];

export const funnel = [
  { label: "Визиты", value: 18420 },
  { label: "Регистрации", value: 2460 },
  { label: "Оплаты", value: 864 },
  { label: "Повторные", value: 312 },
];

export const channels = [
  { name: "Органика", value: 42, color: "#818cf8" },
  { name: "Реклама", value: 28, color: "#34d399" },
  { name: "Соцсети", value: 18, color: "#fbbf24" },
  { name: "Партнёры", value: 12, color: "#fb7185" },
];

export const statusLabel: Record<OrderStatus, string> = {
  paid: "Оплачен",
  pending: "Ожидает",
  refunded: "Возврат",
};

export const statusClass: Record<OrderStatus, string> = {
  paid: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  refunded: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

export const paymentLabel: Record<PaymentMethod, string> = {
  card: "Карта",
  invoice: "Счёт",
  sbp: "СБП",
};

export const customerStatusLabel: Record<CustomerStatus, string> = {
  active: "Активен",
  trial: "Пробный",
  churned: "Отток",
};

export const customerStatusClass: Record<CustomerStatus, string> = {
  active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  trial: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  churned: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

export const customerSegmentLabel: Record<CustomerSegment, string> = {
  new: "Новый",
  regular: "Постоянный",
  vip: "VIP",
};

export function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export const orders: Order[] = [
  {
    id: "ORD-10482",
    customer: "Анна Смирнова",
    email: "anna.smirnova@example.com",
    product: "Pro план",
    quantity: 1,
    amount: 4900,
    status: "paid",
    date: "20 авг",
    time: "14:22",
    payment: "card",
    channel: "Органика",
    city: "Москва",
    comment: "Продление годовой подписки.",
  },
  {
    id: "ORD-10481",
    customer: "Игорь Петров",
    email: "igor.petrov@example.com",
    product: "Starter",
    quantity: 1,
    amount: 990,
    status: "pending",
    date: "20 авг",
    time: "11:05",
    payment: "sbp",
    channel: "Реклама",
    city: "Казань",
    comment: "Ждём подтверждение оплаты.",
  },
  {
    id: "ORD-10480",
    customer: "Мария Козлова",
    email: "maria.kozlova@example.com",
    product: "Add-on API",
    quantity: 2,
    amount: 3800,
    status: "paid",
    date: "19 авг",
    time: "18:41",
    payment: "invoice",
    channel: "Партнёры",
    city: "Санкт-Петербург",
    comment: "Докупка лимитов API для команды.",
  },
  {
    id: "ORD-10479",
    customer: "Дмитрий Орлов",
    email: "dmitry.orlov@example.com",
    product: "Team план",
    quantity: 1,
    amount: 12900,
    status: "paid",
    date: "19 авг",
    time: "09:18",
    payment: "card",
    channel: "Соцсети",
    city: "Екатеринбург",
    comment: "Переход со Starter на Team.",
  },
  {
    id: "ORD-10478",
    customer: "Елена Волкова",
    email: "elena.volkova@example.com",
    product: "Pro план",
    quantity: 1,
    amount: 4900,
    status: "refunded",
    date: "18 авг",
    time: "16:03",
    payment: "card",
    channel: "Органика",
    city: "Новосибирск",
    comment: "Возврат: дублирующий платёж.",
  },
  {
    id: "ORD-10477",
    customer: "Павел Новиков",
    email: "pavel.novikov@example.com",
    product: "Starter",
    quantity: 3,
    amount: 2970,
    status: "paid",
    date: "18 авг",
    time: "10:47",
    payment: "sbp",
    channel: "Реклама",
    city: "Краснодар",
    comment: "Три лицензии для филиала.",
  },
  {
    id: "ORD-10476",
    customer: "Ольга Белова",
    email: "olga.belova@example.com",
    product: "Team план",
    quantity: 1,
    amount: 12900,
    status: "pending",
    date: "17 авг",
    time: "13:29",
    payment: "invoice",
    channel: "Партнёры",
    city: "Самара",
    comment: "Счёт отправлен в бухгалтерию.",
  },
  {
    id: "ORD-10475",
    customer: "Никита Соколов",
    email: "nikita.sokolov@example.com",
    product: "Add-on API",
    quantity: 1,
    amount: 1900,
    status: "paid",
    date: "17 авг",
    time: "08:12",
    payment: "card",
    channel: "Органика",
    city: "Воронеж",
    comment: "Первая интеграция вебхуков.",
  },
];

export const customers: Customer[] = [
  {
    id: "CUS-2041",
    name: "Анна Смирнова",
    email: "anna.smirnova@example.com",
    phone: "+7 916 220-14-82",
    company: "Nimbus Studio",
    city: "Москва",
    plan: "Pro план",
    status: "active",
    segment: "vip",
    since: "12 янв 2025",
    manager: "Кирилл Иванов",
    notes: "Ключевой клиент. Интересует годовой контракт и белые лейблы.",
  },
  {
    id: "CUS-2042",
    name: "Игорь Петров",
    email: "igor.petrov@example.com",
    phone: "+7 843 115-09-33",
    company: "Petrov Logistics",
    city: "Казань",
    plan: "Starter",
    status: "trial",
    segment: "new",
    since: "18 авг 2026",
    manager: "Алина Сергеева",
    notes: "Пробный период до 25 августа. Нужен онбординг по отчётам.",
  },
  {
    id: "CUS-2043",
    name: "Мария Козлова",
    email: "maria.kozlova@example.com",
    phone: "+7 921 440-77-19",
    company: "North API",
    city: "Санкт-Петербург",
    plan: "Add-on API",
    status: "active",
    segment: "regular",
    since: "3 мар 2025",
    manager: "Кирилл Иванов",
    notes: "Растёт потребление API. Предложить Team план.",
  },
  {
    id: "CUS-2044",
    name: "Дмитрий Орлов",
    email: "dmitry.orlov@example.com",
    phone: "+7 343 201-55-08",
    company: "Orlov Digital",
    city: "Екатеринбург",
    plan: "Team план",
    status: "active",
    segment: "vip",
    since: "21 ноя 2024",
    manager: "Мария Кузнецова",
    notes: "Команда из 14 человек. Запрос на SSO и роли.",
  },
  {
    id: "CUS-2045",
    name: "Елена Волкова",
    email: "elena.volkova@example.com",
    phone: "+7 383 612-40-21",
    company: "Volkova Retail",
    city: "Новосибирск",
    plan: "Pro план",
    status: "churned",
    segment: "regular",
    since: "9 фев 2025",
    manager: "Алина Сергеева",
    notes: "Возврат из-за дубля платежа. Связаться после 1 сентября.",
  },
  {
    id: "CUS-2046",
    name: "Павел Новиков",
    email: "pavel.novikov@example.com",
    phone: "+7 861 330-18-44",
    company: "Юг Филиалы",
    city: "Краснодар",
    plan: "Starter",
    status: "active",
    segment: "regular",
    since: "27 мая 2025",
    manager: "Кирилл Иванов",
    notes: "Три лицензии на филиалы. Планирует расширение до Team.",
  },
  {
    id: "CUS-2047",
    name: "Ольга Белова",
    email: "olga.belova@example.com",
    phone: "+7 846 190-62-70",
    company: "Белова и партнёры",
    city: "Самара",
    plan: "Team план",
    status: "trial",
    segment: "new",
    since: "17 авг 2026",
    manager: "Мария Кузнецова",
    notes: "Счёт в бухгалтерии. Нужен акт и закрывающие документы.",
  },
  {
    id: "CUS-2048",
    name: "Никита Соколов",
    email: "nikita.sokolov@example.com",
    phone: "+7 473 255-03-16",
    company: "Sokolov Apps",
    city: "Воронеж",
    plan: "Add-on API",
    status: "active",
    segment: "new",
    since: "2 авг 2026",
    manager: "Алина Сергеева",
    notes: "Первая интеграция вебхуков прошла успешно.",
  },
  {
    id: "CUS-2049",
    name: "Татьяна Морозова",
    email: "tatiana.morozova@example.com",
    phone: "+7 495 780-11-09",
    company: "Morozova Media",
    city: "Москва",
    plan: "Pro план",
    status: "active",
    segment: "regular",
    since: "14 апр 2025",
    manager: "Мария Кузнецова",
    notes: "Пока без заказов в текущем списке. Ждёт демо по аналитике.",
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
