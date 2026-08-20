"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { applyTheme, readTheme, type Theme } from "@/lib/theme";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const stored = readTheme();
    setThemeState(stored);
    applyTheme(stored);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (next: Theme) => {
        setThemeState(next);
        applyTheme(next);
      },
      toggleTheme: () => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setThemeState(next);
        applyTheme(next);
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
