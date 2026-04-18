"use client";

import {
  Building2,
  CalendarDays,
  CreditCard,
  FileText,
  Package,
  ShoppingBag,
  Tags,
  UserRound,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useOrderStore } from "@/lib/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function InvoicePreview() {
  const invoice = useOrderStore((state) => state.invoice);
  const customer = useOrderStore((state) => state.customer);
  const organization = useOrderStore((state) => state.organization);
  const warehouse = useOrderStore((state) => state.warehouse);
  const paybox = useOrderStore((state) => state.paybox);
  const priceType = useOrderStore((state) => state.priceType);
  const cart = useOrderStore((state) => state.cart);

  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);

  const configRows = [
    { label: "Organization", value: organization?.name, icon: Building2 },
    { label: "Warehouse", value: warehouse?.name, icon: Package },
    { label: "Paybox", value: paybox?.name, icon: CreditCard },
    { label: "Price type", value: priceType?.name, icon: Tags },
  ];

  return (
    <Card className="crm-card sticky top-5">
      <CardContent className="space-y-5 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Invoice preview
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">Draft sale</h2>
          </div>
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {invoice.status}
          </span>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <FileText className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
              {invoice.number}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="h-4 w-4" />
            {formatDateTime(invoice.createdAt)}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Customer
          </p>
          <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
                <UserRound className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-950">
                  {customer?.name || "No customer selected"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {customer?.phone || "Attach a customer from the phone search field."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Document setup
          </p>
          <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            <div className="space-y-3">
              {configRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <row.icon className="h-4 w-4" />
                    <span>{row.label}</span>
                  </div>
                  <span className="max-w-[52%] truncate text-right text-sm font-medium text-slate-950">
                    {row.value || "Not selected"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Sale lines
            </p>
            <span className="crm-chip">{cart.length}</span>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            {cart.length > 0 ? (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-950">
                      {formatCurrency(item.lineTotal)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <ShoppingBag className="h-4 w-4" />
                No products added yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-950 p-4 text-white">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, invoice.currencyCode)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Total due</span>
            <span className="text-2xl font-semibold text-white">
              {formatCurrency(subtotal, invoice.currencyCode)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
