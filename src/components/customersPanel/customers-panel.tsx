"use client";

import { useMemo, useState } from "react";
import { initialsFromName } from "@/lib/auth";
import {
  customerSegmentLabel,
  customerStatusClass,
  customerStatusLabel,
  customers,
  formatMoney,
  orders,
  statusClass,
  statusLabel,
  type Customer,
  type CustomerStatus,
} from "@/lib/data";

const statusFilters: Array<{ id: "all" | CustomerStatus; label: string }> = [
  { id: "all", label: "Все" },
  { id: "active", label: "Активные" },
  { id: "trial", label: "Пробные" },
  { id: "churned", label: "Отток" },
];

export function CustomersPanel({ query }: { query: string }) {
  const [status, setStatus] = useState<"all" | CustomerStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>(customers[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchesStatus = status === "all" || customer.status === status;
      const matchesQuery =
        !q ||
        `${customer.id} ${customer.name} ${customer.email} ${customer.company} ${customer.city} ${customer.plan} ${customer.manager}`
          .toLowerCase()
          .includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  const selected =
    filtered.find((customer) => customer.id === selectedId) ?? filtered[0] ?? null;

  const activeCount = customers.filter((customer) => customer.status === "active").length;
  const trialCount = customers.filter((customer) => customer.status === "trial").length;
  const vipCount = customers.filter((customer) => customer.segment === "vip").length;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Клиенты</h1>
        <p className="mt-1 text-sm text-muted">
          Карточки клиентов, сегменты, контакты и связанные заказы.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Всего клиентов" value={String(customers.length)} hint="в базе дашборда" />
        <SummaryCard label="Активные" value={String(activeCount)} hint="оплачивают подписку" />
        <SummaryCard label="Пробные" value={String(trialCount)} hint="нужен онбординг" />
        <SummaryCard label="VIP" value={String(vipCount)} hint="приоритетный сегмент" />
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
            <h2 className="text-sm font-medium">Список клиентов</h2>
            <span className="text-xs text-muted">
              {filtered.length} из {customers.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-y border-border text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Клиент</th>
                  <th className="px-5 py-3 font-medium">Компания</th>
                  <th className="px-5 py-3 font-medium">План</th>
                  <th className="px-5 py-3 font-medium">Заказы</th>
                  <th className="px-5 py-3 font-medium">LTV</th>
                  <th className="px-5 py-3 font-medium">Сегмент</th>
                  <th className="px-5 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => {
                  const stats = statsFor(customer.email);
                  return (
                    <tr
                      key={customer.id}
                      onClick={() => setSelectedId(customer.id)}
                      className={`cursor-pointer border-b border-border last:border-0 ${
                        selected?.id === customer.id ? "bg-indigo-500/10" : "hover:bg-foreground/5"
                      }`}
                    >
                      <td className="px-5 py-3">
                        <p>{customer.name}</p>
                        <p className="text-xs text-muted">{customer.city}</p>
                      </td>
                      <td className="px-5 py-3 text-subtle">{customer.company}</td>
                      <td className="px-5 py-3">{customer.plan}</td>
                      <td className="px-5 py-3">{stats.count}</td>
                      <td className="px-5 py-3">{formatMoney(stats.ltv)}</td>
                      <td className="px-5 py-3 text-subtle">
                        {customerSegmentLabel[customer.segment]}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ${customerStatusClass[customer.status]}`}
                        >
                          {customerStatusLabel[customer.status]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
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

        <CustomerDetails customer={selected} />
      </div>
    </section>
  );
}

function statsFor(email: string) {
  const related = orders.filter((order) => order.email === email);
  return {
    related,
    count: related.length,
    ltv: related
      .filter((order) => order.status === "paid")
      .reduce((sum, order) => sum + order.amount, 0),
  };
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

function CustomerDetails({ customer }: { customer: Customer | null }) {
  if (!customer) {
    return (
      <article className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="text-sm font-medium">Карточка клиента</h2>
        <p className="mt-3 text-sm text-muted">Выберите клиента в таблице.</p>
      </article>
    );
  }

  const stats = statsFor(customer.email);
  const rows = [
    ["ID", customer.id],
    ["Email", customer.email],
    ["Телефон", customer.phone],
    ["Компания", customer.company],
    ["Город", customer.city],
    ["План", customer.plan],
    ["Менеджер", customer.manager],
    ["Клиент с", customer.since],
    ["Сегмент", customerSegmentLabel[customer.segment]],
    ["LTV", formatMoney(stats.ltv)],
  ];

  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-xs font-semibold">
            {initialsFromName(customer.name)}
          </div>
          <div>
            <h2 className="text-sm font-medium">{customer.name}</h2>
            <p className="text-xs text-muted">{customer.company}</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs ${customerStatusClass[customer.status]}`}>
          {customerStatusLabel[customer.status]}
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
        <p className="text-xs font-medium text-muted">Заметка</p>
        <p className="mt-1 text-sm">{customer.notes}</p>
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium text-muted">Связанные заказы</p>
        {stats.related.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Заказов пока нет.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {stats.related.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-mono text-xs text-muted">{order.id}</p>
                  <p>
                    {order.product} · {formatMoney(order.amount)}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs ${statusClass[order.status]}`}>
                  {statusLabel[order.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
