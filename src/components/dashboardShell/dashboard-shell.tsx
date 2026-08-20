"use client";

import { useMemo, useState } from "react";
import {
  IconBag,
  IconBell,
  IconChart,
  IconGear,
  IconGrid,
  IconMenu,
  IconSearch,
  IconTrendDown,
  IconTrendUp,
  IconUsers,
} from "@/components/icons/icons";
import {
  channels,
  kpis,
  navItems,
  orders,
  products,
  salesByWeek,
  type OrderStatus,
} from "@/lib/data";
import { initialsFromName, type PublicUser } from "@/lib/auth";

const iconMap = {
  grid: IconGrid,
  bag: IconBag,
  users: IconUsers,
  chart: IconChart,
  gear: IconGear,
};

const statusLabel: Record<OrderStatus, string> = {
  paid: "Оплачен",
  pending: "Ожидает",
  refunded: "Возврат",
};

const statusClass: Record<OrderStatus, string> = {
  paid: "bg-emerald-500/15 text-emerald-300",
  pending: "bg-amber-500/15 text-amber-300",
  refunded: "bg-rose-500/15 text-rose-300",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function DashboardShell({
  user,
  onLogout,
}: {
  user: PublicUser;
  onLogout: () => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((order) =>
      `${order.id} ${order.customer} ${order.product}`.toLowerCase().includes(q),
    );
  }, [query]);

  const maxSale = Math.max(...salesByWeek.map((d) => d.value));
  const chartWidth = 560;
  const chartHeight = 180;
  const points = salesByWeek.map((d, i) => {
    const x = (i / (salesByWeek.length - 1)) * chartWidth;
    const y = chartHeight - (d.value / maxSale) * (chartHeight - 16) - 8;
    return `${x},${y}`;
  });
  const areaPath = `M0,${chartHeight} L${points.join(" L")} L${chartWidth},${chartHeight} Z`;
  const linePath = `M${points.join(" L")}`;

  const donutTotal = channels.reduce((sum, c) => sum + c.value, 0);
  const donutSegments = channels.reduce<
    { name: string; color: string; dash: number; offset: number; value: number }[]
  >((acc, channel) => {
    const dash = (channel.value / donutTotal) * 100;
    const offset = acc.reduce((sum, item) => sum + item.dash, 0);
    acc.push({ name: channel.name, color: channel.color, dash, offset, value: channel.value });
    return acc;
  }, []);

  return (
    <div className="flex min-h-full bg-slate-950 text-slate-100">
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Закрыть меню"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-slate-950/95 p-5 backdrop-blur transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 font-semibold">
            N
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">Nexus</p>
            <p className="text-xs text-slate-400">Analytics dashboard</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            const active = item.href === "#overview";
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-indigo-500/15 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-transparent p-4">
          <p className="text-sm font-medium">Pro-отчёты</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Экспорт CSV, алерты и совместный доступ к дашборду.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur sm:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-300 hover:bg-white/5 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Открыть меню"
          >
            <IconMenu className="h-5 w-5" />
          </button>

          <label className="relative min-w-0 flex-1">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск заказов, клиентов…"
              className="w-full rounded-xl border border-white/10 bg-slate-900 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-500 focus:border-indigo-400"
            />
          </label>

          <div className="hidden items-center gap-1 rounded-xl border border-white/10 p-1 sm:flex">
            {(["7d", "30d", "90d"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRange(item)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  range === item
                    ? "bg-indigo-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="relative rounded-xl border border-white/10 p-2 hover:bg-white/5"
            aria-label="Уведомления"
          >
            <IconBell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-400" />
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-white/10 py-1 pl-1 pr-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-400/30 text-xs font-semibold">
              {initialsFromName(user.name)}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium">{user.name}</p>
              <p className="text-[11px] text-slate-400">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg px-2 py-1 text-[11px] text-slate-400 hover:bg-white/5 hover:text-white"
            >
              Выйти
            </button>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-4 sm:p-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Обзор продаж</h1>
            <p className="mt-1 text-sm text-slate-400">
              Метрики за выбранный период ({range}). Данные демонстрационные.
            </p>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <article
                key={kpi.label}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
              >
                <p className="text-sm text-slate-400">{kpi.label}</p>
                <p className="mt-2 text-2xl font-semibold">{kpi.value}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span
                    className={`inline-flex items-center gap-1 ${
                      kpi.positive ? "text-emerald-300" : "text-rose-300"
                    }`}
                  >
                    {kpi.positive ? (
                      <IconTrendUp className="h-4 w-4" />
                    ) : (
                      <IconTrendDown className="h-4 w-4" />
                    )}
                    {kpi.delta}
                  </span>
                  <span className="text-slate-500">{kpi.hint}</span>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium">Динамика выручки</h2>
                  <p className="text-xs text-slate-400">Тысячи ₽ по дням недели</p>
                </div>
                <span className="rounded-full bg-indigo-500/15 px-2.5 py-1 text-xs text-indigo-300">
                  +18% к прошлой неделе
                </span>
              </div>
              <div className="overflow-x-auto">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight + 28}`}
                  className="h-52 w-full min-w-[420px]"
                  role="img"
                  aria-label="График выручки по дням недели"
                >
                  <defs>
                    <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill="url(#salesFill)" />
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {salesByWeek.map((d, i) => {
                    const x = (i / (salesByWeek.length - 1)) * chartWidth;
                    return (
                      <text
                        key={d.label}
                        x={x}
                        y={chartHeight + 22}
                        textAnchor="middle"
                        className="fill-slate-500 text-[11px]"
                      >
                        {d.label}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <h2 className="text-sm font-medium">Каналы трафика</h2>
              <p className="text-xs text-slate-400">Доля привлечения</p>
              <div className="mt-6 flex items-center gap-6">
                <svg viewBox="0 0 42 42" className="h-28 w-28 -rotate-90">
                  {donutSegments.map((segment) => (
                    <circle
                      key={segment.name}
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke={segment.color}
                      strokeWidth="6"
                      strokeDasharray={`${segment.dash} ${100 - segment.dash}`}
                      strokeDashoffset={-segment.offset}
                    />
                  ))}
                </svg>
                <ul className="space-y-2 text-sm">
                  {channels.map((channel) => (
                    <li key={channel.name} className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: channel.color }}
                      />
                      <span className="text-slate-300">{channel.name}</span>
                      <span className="ml-auto text-slate-500">{channel.value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <article
              id="orders"
              className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 xl:col-span-2"
            >
              <div className="flex items-center justify-between px-5 py-4">
                <h2 className="text-sm font-medium">Последние заказы</h2>
                <span className="text-xs text-slate-500">
                  {filteredOrders.length} из {orders.length}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="border-y border-white/10 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">ID</th>
                      <th className="px-5 py-3 font-medium">Клиент</th>
                      <th className="px-5 py-3 font-medium">Продукт</th>
                      <th className="px-5 py-3 font-medium">Сумма</th>
                      <th className="px-5 py-3 font-medium">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-white/5 last:border-0">
                        <td className="px-5 py-3 font-mono text-xs text-slate-400">
                          {order.id}
                        </td>
                        <td className="px-5 py-3">{order.customer}</td>
                        <td className="px-5 py-3 text-slate-300">{order.product}</td>
                        <td className="px-5 py-3">{formatMoney(order.amount)}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs ${statusClass[order.status]}`}
                          >
                            {statusLabel[order.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                          Ничего не найдено
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <h2 className="text-sm font-medium">Топ продукты</h2>
              <ul className="mt-4 space-y-4">
                {products.map((product) => (
                  <li key={product.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span>{product.name}</span>
                      <span className="text-slate-400">{product.revenue}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-indigo-400"
                        style={{ width: `${Math.min(100, product.sales / 12)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{product.sales} продаж</p>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
