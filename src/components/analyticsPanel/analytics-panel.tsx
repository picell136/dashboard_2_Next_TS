"use client";

import { useMemo } from "react";
import {
  channels,
  customers,
  formatMoney,
  funnel,
  orders,
  paymentLabel,
  products,
  salesByMonth,
  salesByWeek,
} from "@/lib/data";

type Range = "7d" | "30d" | "90d";

export function AnalyticsPanel({
  query,
  range,
}: {
  query: string;
  range: Range;
}) {
  const series = range === "90d" ? salesByMonth : salesByWeek;
  const chart = useMemo(() => buildLineChart(series), [series]);
  const donut = useMemo(() => buildDonut(channels), []);

  const paidOrders = orders.filter((order) => order.status === "paid");
  const revenue = paidOrders.reduce((sum, order) => sum + order.amount, 0);
  const avgCheck = paidOrders.length ? Math.round(revenue / paidOrders.length) : 0;
  const conversion = funnel[0] ? Math.round((funnel[2].value / funnel[0].value) * 1000) / 10 : 0;

  const cityStats = useMemo(() => {
    const map = new Map<string, { orders: number; revenue: number }>();
    for (const order of orders) {
      const current = map.get(order.city) ?? { orders: 0, revenue: 0 };
      current.orders += 1;
      if (order.status === "paid") current.revenue += order.amount;
      map.set(order.city, current);
    }
    return [...map.entries()]
      .map(([city, stats]) => ({ city, ...stats }))
      .sort((a, b) => b.revenue - a.revenue);
  }, []);

  const paymentStats = useMemo(() => {
    const map = new Map<string, number>();
    for (const order of paidOrders) {
      map.set(order.payment, (map.get(order.payment) ?? 0) + order.amount);
    }
    const total = [...map.values()].reduce((sum, value) => sum + value, 0) || 1;
    return [...map.entries()].map(([payment, amount]) => ({
      payment,
      amount,
      share: Math.round((amount / total) * 100),
    }));
  }, [paidOrders]);

  const q = query.trim().toLowerCase();
  const filteredCities = cityStats.filter(
    (item) => !q || item.city.toLowerCase().includes(q),
  );
  const filteredProducts = products.filter(
    (item) => !q || item.name.toLowerCase().includes(q),
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Аналитика</h1>
        <p className="mt-1 text-sm text-muted">
          Выручка, воронка и срезы по каналам, городам и продуктам за период {range}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Выручка" value={formatMoney(revenue)} hint="оплаченные заказы" />
        <KpiCard label="Средний чек" value={formatMoney(avgCheck)} hint={`${paidOrders.length} оплат`} />
        <KpiCard label="Конверсия" value={`${conversion}%`} hint="визит → оплата" />
        <KpiCard
          label="Активные клиенты"
          value={String(customers.filter((c) => c.status === "active").length)}
          hint={`из ${customers.length} в базе`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-border bg-surface p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium">Динамика выручки</h2>
              <p className="text-xs text-muted">
                {range === "90d" ? "Тысячи ₽ по месяцам" : "Тысячи ₽ по дням недели"}
              </p>
            </div>
            <span className="rounded-full bg-indigo-500/15 px-2.5 py-1 text-xs text-indigo-600 dark:text-indigo-300">
              период {range}
            </span>
          </div>
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${chart.width} ${chart.height + 28}`}
              className="h-52 w-full min-w-[420px]"
              role="img"
              aria-label="График выручки"
            >
              <defs>
                <linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={chart.areaPath} fill="url(#analyticsFill)" />
              <path
                d={chart.linePath}
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {series.map((point, i) => {
                const x = (i / Math.max(series.length - 1, 1)) * chart.width;
                return (
                  <text
                    key={point.label}
                    x={x}
                    y={chart.height + 22}
                    textAnchor="middle"
                    className="fill-muted text-[11px]"
                  >
                    {point.label}
                  </text>
                );
              })}
            </svg>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Каналы трафика</h2>
          <p className="text-xs text-muted">Доля привлечения</p>
          <div className="mt-6 flex items-center gap-6">
            <svg viewBox="0 0 42 42" className="h-28 w-28 -rotate-90">
              {donut.map((segment) => (
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
                  <span className="text-subtle">{channel.name}</span>
                  <span className="ml-auto text-muted">{channel.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Воронка</h2>
          <p className="text-xs text-muted">От визита до повторной оплаты</p>
          <ul className="mt-4 space-y-3">
            {funnel.map((step, index) => {
              const width = Math.max(18, (step.value / funnel[0].value) * 100);
              return (
                <li key={step.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{step.label}</span>
                    <span className="text-muted">{step.value.toLocaleString("ru-RU")}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-foreground/10">
                    <div
                      className="h-full rounded-full bg-indigo-400"
                      style={{ width: `${width}%`, opacity: 1 - index * 0.12 }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Продукты</h2>
          <p className="text-xs text-muted">Выручка и продажи</p>
          <ul className="mt-4 space-y-4">
            {filteredProducts.map((product) => (
              <li key={product.name}>
                <div className="flex items-center justify-between text-sm">
                  <span>{product.name}</span>
                  <span className="text-muted">{product.revenue}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-full rounded-full bg-indigo-400"
                    style={{ width: `${Math.min(100, product.sales / 12)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted">{product.sales} продаж</p>
              </li>
            ))}
            {filteredProducts.length === 0 ? (
              <li className="text-sm text-muted">Ничего не найдено</li>
            ) : null}
          </ul>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Способы оплаты</h2>
          <p className="text-xs text-muted">Доля оплаченной выручки</p>
          <ul className="mt-4 space-y-4">
            {paymentStats.map((item) => (
              <li key={item.payment}>
                <div className="flex items-center justify-between text-sm">
                  <span>{paymentLabel[item.payment as keyof typeof paymentLabel]}</span>
                  <span className="text-muted">{formatMoney(item.amount)}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-full rounded-full bg-indigo-400"
                    style={{ width: `${item.share}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted">{item.share}%</p>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="px-5 py-4">
          <h2 className="text-sm font-medium">Города</h2>
          <p className="text-xs text-muted">Заказы и оплаченная выручка</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-y border-border text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Город</th>
                <th className="px-5 py-3 font-medium">Заказы</th>
                <th className="px-5 py-3 font-medium">Выручка</th>
                <th className="px-5 py-3 font-medium">Доля</th>
              </tr>
            </thead>
            <tbody>
              {filteredCities.map((item) => {
                const share = revenue ? Math.round((item.revenue / revenue) * 100) : 0;
                return (
                  <tr key={item.city} className="border-b border-border last:border-0">
                    <td className="px-5 py-3">{item.city}</td>
                    <td className="px-5 py-3">{item.orders}</td>
                    <td className="px-5 py-3">{formatMoney(item.revenue)}</td>
                    <td className="px-5 py-3 text-muted">{share}%</td>
                  </tr>
                );
              })}
              {filteredCities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-muted">
                    Ничего не найдено
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-3 text-xs text-muted">{hint}</p>
    </article>
  );
}

function buildLineChart(series: { label: string; value: number }[]) {
  const width = 560;
  const height = 180;
  const maxSale = Math.max(...series.map((item) => item.value), 1);
  const points = series.map((item, i) => {
    const x = (i / Math.max(series.length - 1, 1)) * width;
    const y = height - (item.value / maxSale) * (height - 16) - 8;
    return `${x},${y}`;
  });

  return {
    width,
    height,
    areaPath: `M0,${height} L${points.join(" L")} L${width},${height} Z`,
    linePath: `M${points.join(" L")}`,
  };
}

function buildDonut(items: { name: string; color: string; value: number }[]) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  return items.reduce<{ name: string; color: string; dash: number; offset: number }[]>(
    (acc, item) => {
      const dash = (item.value / total) * 100;
      const offset = acc.reduce((sum, current) => sum + current.dash, 0);
      acc.push({ name: item.name, color: item.color, dash, offset });
      return acc;
    },
    [],
  );
}
