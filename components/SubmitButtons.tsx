"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, ReceiptText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createSale } from "@/lib/api";
import { useOrderStore } from "@/lib/store";
import type { SaleDocumentPayload } from "@/types";

export default function SubmitButtons() {
  const [activeAction, setActiveAction] = useState<"draft" | "conduct" | null>(null);

  const token = useOrderStore((state) => state.token);
  const customer = useOrderStore((state) => state.customer);
  const organization = useOrderStore((state) => state.organization);
  const warehouse = useOrderStore((state) => state.warehouse);
  const paybox = useOrderStore((state) => state.paybox);
  const priceType = useOrderStore((state) => state.priceType);
  const cart = useOrderStore((state) => state.cart);
  const resetDraft = useOrderStore((state) => state.resetDraft);

  const canSubmit =
    Boolean(token) &&
    Boolean(customer?.id) &&
    Boolean(organization?.id) &&
    Boolean(warehouse?.id) &&
    Boolean(paybox?.id) &&
    Boolean(priceType?.id) &&
    cart.length > 0;

  const submitSale = async (conduct: boolean) => {
    if (!canSubmit || !token || !customer || !organization || !warehouse || !paybox || !priceType) {
      toast.error("Select the customer, document settings, and at least one product.");
      return;
    }

    const payload: SaleDocumentPayload = {
      number: String(Math.floor(Date.now())),
      dated: Math.floor(Date.now() / 1000),
      organization: Number(organization.id),
      contragent: Number(customer.id),
      warehouse: Number(warehouse.id),
      paybox: Number(paybox.id),
      status: conduct,
      goods: cart.map((item) => ({
        nomenclature: Number(item.productId),
        quantity: item.quantity,
        price: item.price,
        price_type: Number(priceType.id),
        nomenclature_name: item.name,
        unit_name: item.unit,
      })),
    };

    try {
      setActiveAction(conduct ? "conduct" : "draft");
      await createSale(token, payload);
      toast.success(conduct ? "Sale created and conducted." : "Sale created.");
      resetDraft();
    } catch (error: any) {
      toast.error(error.message || "Unable to create sale.");
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Button
        type="button"
        className="h-12 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-950 shadow-none transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        disabled={!canSubmit || activeAction !== null}
        onClick={() => submitSale(false)}
      >
        {activeAction === "draft" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating
          </>
        ) : (
          <>
            <ReceiptText className="mr-2 h-4 w-4" />
            Create Sale
          </>
        )}
      </Button>

      <Button
        type="button"
        className="h-12 rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-[0_24px_50px_-28px_rgba(15,23,42,0.8)] transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        disabled={!canSubmit || activeAction !== null}
        onClick={() => submitSale(true)}
      >
        {activeAction === "conduct" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Conducting
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Create & Conduct Sale
          </>
        )}
      </Button>
    </div>
  );
}
