"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOrderStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default function CartTable() {
  const cart = useOrderStore((state) => state.cart);
  const updateQuantity = useOrderStore((state) => state.updateQuantity);
  const updatePrice = useOrderStore((state) => state.updatePrice);
  const removeFromCart = useOrderStore((state) => state.removeFromCart);

  const total = cart.reduce((sum, item) => sum + item.lineTotal, 0);

  return (
    <Card className="crm-card">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Cart
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">Sale lines</h2>
            <p className="mt-1 text-sm text-slate-500">
              Review the products, quantities, and line totals before submission.
            </p>
          </div>

          <span className="crm-chip">{cart.length} lines</span>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/60 px-5 py-10 text-center text-sm text-slate-500">
            Your cart is empty.
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-[24px] border border-slate-200 md:block">
              <div className="grid grid-cols-[minmax(0,1.5fr)_120px_120px_120px_52px] border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span>Product</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Price</span>
                <span className="text-right">Line total</span>
                <span />
              </div>

              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="grid grid-cols-[minmax(0,1.5fr)_120px_120px_120px_52px] items-center border-b border-slate-100 px-4 py-4 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">{item.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.unit || "item"}</p>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-slate-950">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(event) =>
                        updatePrice(item.productId, Number(event.target.value) || 0)
                      }
                      className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-right text-sm font-medium text-slate-700 outline-none transition focus:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div className="text-right text-sm font-semibold text-slate-950">
                    {formatCurrency(item.lineTotal)}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 md:hidden">
              {cart.map((item) => (
                <div key={item.productId} className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">{item.name}</p>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(event) =>
                          updatePrice(item.productId, Number(event.target.value) || 0)
                        }
                        className="mt-2 w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-slate-950">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-slate-950">
                      {formatCurrency(item.lineTotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-4">
          <span className="text-sm font-medium text-slate-500">Total amount</span>
          <span className="text-lg font-semibold text-slate-950">{formatCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
