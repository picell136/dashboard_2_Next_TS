"use client";

import { useTheme } from "@/components/themeProvider/theme-provider";

export function SettingsPanel() {
  const { theme, setTheme } = useTheme();

  return (
    <section className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Настройки</h1>
        <p className="mt-1 text-sm text-muted">Оформление дашборда.</p>
      </div>

      <article className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="text-sm font-medium">Тема</h2>
        <p className="mt-1 text-sm text-muted">
          Переключение между тёмным и светлым оформлением. Выбор сохраняется в браузере.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
              theme === "dark"
                ? "border-indigo-400 bg-indigo-500/15 text-foreground"
                : "border-border text-muted hover:border-indigo-400/60 hover:text-foreground"
            }`}
          >
            Тёмная
          </button>
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
              theme === "light"
                ? "border-indigo-400 bg-indigo-500/15 text-foreground"
                : "border-border text-muted hover:border-indigo-400/60 hover:text-foreground"
            }`}
          >
            Светлая
          </button>
        </div>
      </article>
    </section>
  );
}
