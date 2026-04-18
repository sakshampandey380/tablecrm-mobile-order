"use client";

import { MoonStar, SunMedium } from "lucide-react";

import { useOrderStore } from "@/lib/store";

export default function ThemeToggle() {
  const theme = useOrderStore((state) => state.theme);
  const setTheme = useOrderStore((state) => state.setTheme);

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
    </button>
  );
}
