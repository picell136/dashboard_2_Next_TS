"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const slides = [
  {
    title: "Обзор продаж",
    description: "Следите за выручкой, заказами и средним чеком в одном экране.",
    accent: "from-indigo-500 to-sky-400",
    stats: ["₽ 1 284 600", "2 418 заказов", "+12.4% рост"],
  },
  {
    title: "Клиенты и сегменты",
    description: "Видите LTV, статусы, менеджеров и историю заказов по каждому клиенту.",
    accent: "from-emerald-400 to-teal-500",
    stats: ["864 клиента", "42% органика", "VIP сегменты"],
  },
  {
    title: "Глубокая аналитика",
    description: "Разбирайте каналы, воронку, города, продукты и способы оплаты.",
    accent: "from-fuchsia-500 to-rose-400",
    stats: ["18 420 визитов", "4 канала", "90 дней"],
  },
];

const features = [
  "Интерактивные отчёты без сложной настройки",
  "Заказы, клиенты и аналитика в едином интерфейсе",
  "Светлая и тёмная тема для комфортной работы",
  "Локальная регистрация для демонстрационного доступа",
];

export function LandingPage() {
  const [active, setActive] = useState(0);
  const slide = slides[active];

  const nextLabel = useMemo(() => {
    const next = slides[(active + 1) % slides.length];
    return next.title;
  }, [active]);

  function nextSlide() {
    setActive((current) => (current + 1) % slides.length);
  }

  return (
    <main className="min-h-full overflow-hidden bg-background text-foreground">
      <section className="relative px-4 py-6 sm:px-6 lg:px-8">
        <div className="absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

        <header className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-border bg-surface/80 px-4 py-3 backdrop-blur">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 font-semibold text-white">
              N
            </span>
            <span>
              <span className="block text-sm font-semibold">Nexus</span>
              <span className="block text-xs text-muted">Analytics dashboard</span>
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
          >
            Открыть дашборд
          </Link>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
          <div>
            <p className="inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
              Аналитика продаж для малого бизнеса
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Nexus превращает заказы и клиентов в понятные решения
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Сервис собирает ключевые метрики в красивый дашборд: выручка,
              продукты, каналы трафика, клиенты, LTV и воронка продаж всегда под рукой.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="rounded-xl bg-indigo-500 px-5 py-3 text-center text-sm font-medium text-white hover:bg-indigo-400"
              >
                Попробовать демо
              </Link>
              <a
                href="#screens"
                className="rounded-xl border border-border px-5 py-3 text-center text-sm font-medium text-muted hover:text-foreground"
              >
                Смотреть скрины
              </a>
            </div>

            <ul className="mt-8 grid gap-3 text-sm text-muted sm:grid-cols-2">
              {features.map((feature) => (
                <li key={feature} className="rounded-xl border border-border bg-surface p-3">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <section id="screens" className="rounded-[2rem] border border-border bg-surface p-3 shadow-2xl shadow-indigo-500/10">
            <div className="overflow-hidden rounded-[1.5rem] border border-border bg-background">
              <div className={`bg-gradient-to-r ${slide.accent} px-5 py-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] opacity-80">Screenshot</p>
                    <h2 className="mt-1 text-xl font-semibold">{slide.title}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium hover:bg-white/30"
                  >
                    Далее: {nextLabel}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 p-5 lg:grid-cols-3">
                {slide.stats.map((stat) => (
                  <div key={stat} className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-xs text-muted">Метрика</p>
                    <p className="mt-2 text-xl font-semibold">{stat}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 px-5 pb-5 lg:grid-cols-[1.4fr_0.8fr]">
                <div className="rounded-2xl border border-border bg-surface p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-medium">{slide.title}</p>
                    <span className="rounded-full bg-indigo-500/15 px-2.5 py-1 text-xs text-indigo-600 dark:text-indigo-300">
                      live
                    </span>
                  </div>
                  <div className="flex h-44 items-end gap-2">
                    {[42, 58, 51, 73, 88, 64, 47].map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-xl bg-indigo-400/80"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-4">
                  <p className="text-sm font-medium">Описание</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{slide.description}</p>
                  <div className="mt-5 space-y-2">
                    {["Органика", "Реклама", "Соцсети"].map((item, index) => (
                      <div key={item} className="flex items-center justify-between text-sm">
                        <span className="text-muted">{item}</span>
                        <span>{[42, 28, 18][index]}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-2">
              {slides.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  aria-label={`Показать скрин ${item.title}`}
                  onClick={() => setActive(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    active === index ? "w-8 bg-indigo-500" : "w-2.5 bg-muted/40"
                  }`}
                />
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
