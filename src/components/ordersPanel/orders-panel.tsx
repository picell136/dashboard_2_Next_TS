"use client";

import { useMemo, useState } from "react";
import {
  formatMoney,
  orders,
  paymentLabel,
  statusClass,
  statusLabel,
  type Order,
  type OrderStatus,
} from "@/lib/data";

const statusFilters: Array<{ id: "all" | OrderStatus; label: string }> = [
  { id: "all", label: "Все" },
  { id: "paid", label: "Оплачены" },
  { id: "pending", label: "Ожидают" },
  { id: "refunded", label: "Возвраты" },
];

export function OrdersPanel({ query }: { query: string }) {
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>(orders[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = status === "all" || order.status === status;
      const matchesQuery =
        !q ||
        `${order.id} ${order.customer} ${order.email} ${order.product} ${order.city} ${order.channel}`
          .toLowerCase()
          .includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  const selected =
    filtered.find((order) => order.id === selectedId) ?? filtered[0] ?? null;

  const paidCount = orders.filter((order) => order.status === "paid").length;
  const pendingCount = orders.filter((order) => order.status === "pending").length;
  const refundedCount = orders.filter((order) => order.status === "refunded").length;
  const paidSum = orders
    .filter((order) => order.status === "paid")
    .reduce((sum, order) => sum + order.amount, 0);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Заказы</h1>
        <p className="mt-1 text-sm text-muted">
          Полный список заказов, статусы оплаты и детали по каждому клиенту.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Всего заказов" value={String(orders.length)} hint="в текущей выборке" />
        <SummaryCard label="Оплачено" value={String(paidCount)} hint={formatMoney(paidSum)} />
        <SummaryCard label="Ожидают" value={String(pendingCount)} hint="нужно подтверждение" />
        <SummaryCard label="Возвраты" value={String(refundedCount)} hint="за выбранный период" />
      </div>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setStatus(item.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              status === item.id
                ? "bg-indigo-500 text-white"
                : "border border-border text-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <article className="overflow-hidden rounded-2xl border border-border bg-surface xl:col-span-2">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-sm font-medium">Список заказов</h2>
            <span className="text-xs text-muted">
              {filtered.length} из {orders.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-y border-border text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">ID</th>
                  <th className="px-5 py-3 font-medium">Клиент</th>
                  <th className="px-5 py-3 font-medium">Продукт</th>
                  <th className="px-5 py-3 font-medium">Сумма</th>
                  <th className="px-5 py-3 font-medium">Оплата</th>
                  <th className="px-5 py-3 font-medium">Дата</th>
                  <th className="px-5 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedId(order.id)}
                    className={`cursor-pointer border-b border-border last:border-0 ${
                      selected?.id === order.id ? "bg-indigo-500/10" : "hover:bg-foreground/5"
                    }`}
                  >
                    <td className="px-5 py-3 font-mono text-xs text-muted">{order.id}</td>
                    <td className="px-5 py-3">
                      <p>{order.customer}</p>
                      <p className="text-xs text-muted">{order.city}</p>
                    </td>
                    <td className="px-5 py-3 text-subtle">
                      {order.product} × {order.quantity}
                    </td>
                    <td className="px-5 py-3">{formatMoney(order.amount)}</td>
                    <td className="px-5 py-3 text-subtle">{paymentLabel[order.payment]}</td>
                    <td className="px-5 py-3 text-muted">
                      {order.date}, {order.time}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs ${statusClass[order.status]}`}>
                        {statusLabel[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-muted">
                      Ничего не найдено
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>

        <OrderDetails order={selected} />
      </div>
    </section>
  );
}

function SummaryCard({
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

function OrderDetails({ order }: { order: Order | null }) {
  if (!order) {
    return (
      <article className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="text-sm font-medium">Детали заказа</h2>
        <p className="mt-3 text-sm text-muted">Выберите заказ в таблице.</p>
      </article>
    );
  }

  const rows = [
    ["Клиент", order.customer],
    ["Email", order.email],
    ["Город", order.city],
    ["Продукт", `${order.product} × ${order.quantity}`],
    ["Сумма", formatMoney(order.amount)],
    ["Оплата", paymentLabel[order.payment]],
    ["Канал", order.channel],
    ["Дата", `${order.date}, ${order.time}`],
  ];

  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">Детали заказа</h2>
          <p className="mt-1 font-mono text-xs text-muted">{order.id}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs ${statusClass[order.status]}`}>
          {statusLabel[order.status]}
        </span>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4">
            <dt className="text-muted">{label}</dt>
            <dd className="text-right">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 rounded-xl border border-border bg-background p-3">
        <p className="text-xs font-medium text-muted">Комментарий</p>
        <p className="mt-1 text-sm">{order.comment}</p>
      </div>
    </article>
  );
}
