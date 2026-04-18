"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useOrderStore } from "@/lib/store";

export default function TokenForm() {
  const router = useRouter();
  const hydrated = useOrderStore((state) => state.hydrated);
  const token = useOrderStore((state) => state.token);
  const setToken = useOrderStore((state) => state.setToken);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (hydrated && token) {
      router.replace("/order");
    }
  }, [hydrated, token, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const rawValue = value.trim();
    let nextToken = rawValue;

    try {
      if (rawValue.startsWith("http://") || rawValue.startsWith("https://")) {
        nextToken = new URL(rawValue).searchParams.get("token") || rawValue;
      }
    } catch {
      nextToken = rawValue;
    }

    if (!nextToken) {
      return;
    }

    setToken(nextToken);
    router.push("/order");
  };

  return (
    <Card className="crm-card relative z-10 w-full max-w-[440px] overflow-hidden">
      <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(248,250,252,0.92))] px-6 py-6 sm:px-8">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-900">
          <Store className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          TableCRM cash sale
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Enter the cash register token to unlock the mobile order form. The token is
          persisted on this device for your next session.
        </p>
      </div>

      <CardContent className="space-y-5 px-6 py-6 sm:px-8">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>
              Use the same token you use inside TableCRM for the sales modal. This keeps
              the form aligned with your live company data.
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="crm-label" htmlFor="cash-token">
              Cash register token
            </label>
            <Input
              id="cash-token"
              className="crm-input"
              placeholder="Paste your TableCRM token or docs_sales URL"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <Button className="h-12 w-full rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.75)] transition hover:bg-slate-800">
            Respond
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
