"use client";

import { CalendarDays, FileText, ShoppingBasket, UserRound } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useOrderStore } from "@/lib/store";

export default function InvoiceSection() {
  const invoice = useOrderStore((state) => state.invoice);
  const customer = useOrderStore((state) => state.customer);
  const cart = useOrderStore((state) => state.cart);

  const total = cart.reduce((sum, item) => sum + item.lineTotal, 0);

  return (
    <Card className="crm-card">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Invoice
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">
              Sale document preview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Mirrors the top portion of the TableCRM create sale flow.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {invoice.status}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="crm-panel">
            <div className="flex items-center gap-2 text-slate-500">
              <FileText className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                Number
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-950">{invoice.number}</p>
          </div>

          <div className="crm-panel">
            <div className="flex items-center gap-2 text-slate-500">
              <CalendarDays className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                Created
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-950">
              {formatDateTime(invoice.createdAt)}
            </p>
          </div>

          <div className="crm-panel">
            <div className="flex items-center gap-2 text-slate-500">
              <ShoppingBasket className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                Amount
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-950">
              {formatCurrency(total, invoice.currencyCode)}
            </p>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <UserRound className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
              Selected customer
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-950">
            {customer?.name || "No customer selected"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {customer?.phone || "Search by phone to bind a customer to this draft sale."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
