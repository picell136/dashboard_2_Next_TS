"use client";

import { FormEvent, useState } from "react";
import { registerUser, type PublicUser } from "@/lib/auth";

export function RegisterForm({
  onSuccess,
  onBackToLogin,
}: {
  onSuccess: (user: PublicUser) => void;
  onBackToLogin: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = registerUser({ name, email, password });
    if (result.error || !result.user) {
      setError(result.error ?? "Не удалось зарегистрироваться.");
      return;
    }

    onSuccess(result.user);
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-8">
        <p className="text-sm font-semibold tracking-wide text-indigo-300">Nexus</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Регистрация</h1>
        <p className="mt-2 text-sm text-slate-400">
          Создайте аккаунт, чтобы открыть дашборд.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-xs text-slate-400">Имя</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-400"
              placeholder="Анна Иванова"
              autoComplete="name"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs text-slate-400">Логин</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-400"
              placeholder="anna@example.com"
              autoComplete="username"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs text-slate-400">Пароль</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-400"
              placeholder="Не менее 4 символов"
              autoComplete="new-password"
            />
          </label>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-400"
          >
            Зарегистрироваться
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Уже есть аккаунт?{" "}
          <button
            type="button"
            onClick={onBackToLogin}
            className="font-medium text-indigo-300 hover:text-indigo-200"
          >
            Войти
          </button>
        </p>
      </div>
    </div>
  );
}
