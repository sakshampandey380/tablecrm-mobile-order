"use client";

import { BarChart3, CircleHelp, Database, FileText, Folder, Home, Layers3, MoreHorizontal, Search, Settings, Sparkles, Users2 } from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onQuickCreate: () => void;
}

export default function DashboardLayout({
  children,
  onQuickCreate,
}: DashboardLayoutProps) {
  const primaryItems = [
    { label: "Dashboard", icon: Home, active: true },
    { label: "Lifecycle", icon: Layers3 },
    { label: "Analytics", icon: BarChart3 },
    { label: "Projects", icon: Folder },
    { label: "Team", icon: Users2 },
  ];

  const secondaryItems = [
    { label: "Data Library", icon: Database },
    { label: "Reports", icon: FileText },
    { label: "Word Assistant", icon: Sparkles },
    { label: "More", icon: MoreHorizontal },
  ];

  const utilityItems = [
    { label: "Settings", icon: Settings },
    { label: "Get Help", icon: CircleHelp },
    { label: "Search", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf8] text-slate-900 transition-colors dark:bg-[#0f1115] dark:text-slate-100">
      <div className="grid min-h-screen xl:grid-cols-[232px_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-200/80 bg-[#f7f7f5] xl:flex xl:flex-col dark:border-slate-800 dark:bg-[#111317]">
          <div className="flex items-center gap-3 border-b border-slate-200/80 px-6 py-6 dark:border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-900 dark:bg-slate-100" />
            </div>
            <span className="text-lg font-semibold">Acme Inc.</span>
          </div>

          <div className="flex-1 space-y-8 px-4 py-5">
            <div>
              <p className="px-3 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                Home
              </p>
              <nav className="mt-3 space-y-1">
                {primaryItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      item.active
                        ? "bg-white text-slate-950 shadow-sm dark:bg-slate-900 dark:text-slate-100"
                        : "text-slate-600 hover:bg-white hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <p className="px-3 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                Documents
              </p>
              <nav className="mt-3 space-y-1">
                {secondaryItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="border-t border-slate-200/80 px-4 py-4 dark:border-slate-800">
            <div className="space-y-1">
              {utilityItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <p className="text-sm font-medium">shadcn</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">m@example.com</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-[linear-gradient(135deg,#111827,#374151)]" />
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 py-4 backdrop-blur xl:px-6 dark:border-slate-800 dark:bg-[#111317]/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white xl:hidden dark:border-slate-800 dark:bg-slate-900">
                <Home className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Documents</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                type="button"
                onClick={onQuickCreate}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Quick Create
              </button>
            </div>
          </header>

          <div className="px-4 py-5 xl:px-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
