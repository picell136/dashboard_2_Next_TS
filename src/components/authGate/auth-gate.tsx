"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboardShell/dashboard-shell";
import { LoginForm } from "@/components/loginForm/login-form";
import { RegisterForm } from "@/components/registerForm/register-form";
import { clearSession, readSession, type PublicUser } from "@/lib/auth";

export function AuthGate() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  useEffect(() => {
    setUser(readSession());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!user) {
      document.title = mode === "register" ? "Регистрация" : "Вход";
    }
  }, [user, mode]);

  if (!ready) {
    return <div className="min-h-full bg-background" />;
  }

  if (!user) {
    if (mode === "register") {
      return (
        <RegisterForm
          onSuccess={setUser}
          onBackToLogin={() => setMode("login")}
        />
      );
    }

    return (
      <LoginForm
        onSuccess={setUser}
        onGoToRegister={() => setMode("register")}
      />
    );
  }

  return (
    <DashboardShell
      user={user}
      onLogout={() => {
        clearSession();
        setUser(null);
        setMode("login");
      }}
    />
  );
}
