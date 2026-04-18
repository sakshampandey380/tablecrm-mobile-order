"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import DocumentsTable from "@/components/DocumentsTable";
import QuickCreateModal from "@/components/QuickCreateModal";
import VisitorsChart from "@/components/VisitorsChart";
import { useOrderStore } from "@/lib/store";

const statCards = [
  {
    title: "Total Revenue",
    value: "$1,250.00",
    delta: "+12.5%",
    trend: "up",
    note: "Trending up this month",
    subnote: "Visitors for the last 6 months",
  },
  {
    title: "New Customers",
    value: "1,234",
    delta: "-20%",
    trend: "down",
    note: "Down 20% this period",
    subnote: "Acquisition needs attention",
  },
  {
    title: "Active Accounts",
    value: "45,678",
    delta: "+12.5%",
    trend: "up",
    note: "Strong user retention",
    subnote: "Engagement exceed targets",
  },
  {
    title: "Growth Rate",
    value: "4.5%",
    delta: "+4.5%",
    trend: "up",
    note: "Steady performance increase",
    subnote: "Meets growth projections",
  },
] as const;

export default function OrderPage() {
  const router = useRouter();
  const hydrated = useOrderStore((state) => state.hydrated);
  const token = useOrderStore((state) => state.token);
  const theme = useOrderStore((state) => state.theme);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !token) {
      router.replace("/");
    }
  }, [hydrated, token, router]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const skeleton = useMemo(
    () => (
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-48 rounded-[28px] border border-slate-200 bg-white shimmer dark:border-slate-800 dark:bg-slate-950"
            />
          ))}
        </div>
        <div className="h-[380px] rounded-[28px] border border-slate-200 bg-white shimmer dark:border-slate-800 dark:bg-slate-950" />
        <div className="h-[520px] rounded-[28px] border border-slate-200 bg-white shimmer dark:border-slate-800 dark:bg-slate-950" />
      </div>
    ),
    [],
  );

  if (!hydrated) {
    return <DashboardLayout onQuickCreate={() => {}}>{skeleton}</DashboardLayout>;
  }

  if (!token) {
    return null;
  }

  return (
    <>
      <DashboardLayout onQuickCreate={() => setQuickCreateOpen(true)}>
        <div className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_-34px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {card.title}
                    </p>
                    <p className="mt-4 text-[2rem] font-semibold tracking-tight text-slate-950 dark:text-slate-100">
                      {card.value}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                    {card.trend === "up" ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {card.delta}
                  </span>
                </div>
                <div className="mt-8 space-y-1.5">
                  <p className="text-base font-medium text-slate-900 dark:text-slate-100">
                    {card.note}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {card.subnote}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <VisitorsChart />
          <DocumentsTable />
        </div>
      </DashboardLayout>

      <QuickCreateModal open={quickCreateOpen} onOpenChange={setQuickCreateOpen} />
    </>
  );
}
