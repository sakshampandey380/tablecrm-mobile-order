"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Phone, Search, UserRound, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { searchCustomers } from "@/lib/api";
import { useOrderStore } from "@/lib/store";

export default function CustomerSearch() {
  const token = useOrderStore((state) => state.token);
  const customer = useOrderStore((state) => state.customer);
  const setCustomer = useOrderStore((state) => state.setCustomer);

  const [query, setQuery] = useState(customer?.phone ?? "");
  const [results, setResults] = useState<typeof customer[]>([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(query, 350);

  useEffect(() => {
    if (!customer) {
      return;
    }

    setQuery(customer.phone || customer.name);
  }, [customer]);

  useEffect(() => {
    const normalized = debounced.trim();
    if (!token || normalized.length < 3) {
      setResults([]);
      return;
    }

    const request = async () => {
      try {
        setLoading(true);
        const data = await searchCustomers(token, normalized);
        setResults(data);
      } catch (error: any) {
        toast.error(error.message || "Unable to load customers.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    request();
  }, [debounced, token]);

  const hasResults = results.length > 0 && debounced.trim().length >= 3;
  const helperText = useMemo(() => {
    if (customer) {
      return "Customer linked to this sale.";
    }
    if (query.trim().length === 0) {
      return "Search by phone number to attach an existing customer.";
    }
    return "Phone search is debounced to avoid extra API requests.";
  }, [customer, query]);

  return (
    <Card className="crm-card overflow-visible">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Customer
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">
              Search customer by phone
            </h2>
            <p className="mt-1 text-sm text-slate-500">{helperText}</p>
          </div>

          {customer ? (
            <button
              type="button"
              className="crm-chip transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => {
                setCustomer(null);
                setQuery("");
                setResults([]);
              }}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Change
            </button>
          ) : null}
        </div>

        <div className="relative">
          <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="crm-input pl-11"
            inputMode="tel"
            placeholder="+7 (___) ___-__-__"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {loading ? (
            <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
          ) : (
            <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
          )}
        </div>

        {customer ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700">
                <UserRound className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-950">{customer.name}</p>
                <p className="mt-1 text-sm text-slate-500">{customer.phone || "Phone unavailable"}</p>
              </div>
            </div>
          </div>
        ) : null}

        {hasResults ? (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            {results.map((item) => (
              <button
                key={item?.id}
                type="button"
                className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 last:border-b-0"
                onClick={() => {
                  if (!item) return;
                  setCustomer(item);
                  setResults([]);
                }}
              >
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
                  <UserRound className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-950">{item?.name}</p>
                  <p className="mt-1 truncate text-sm text-slate-500">{item?.phone || "Phone unavailable"}</p>
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {!customer && query.trim().length >= 3 && !loading && !hasResults ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5 text-sm text-slate-500">
            No customers matched this phone search.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
