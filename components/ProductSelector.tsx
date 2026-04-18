"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Search, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchProducts } from "@/lib/api";
import { useOrderStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductSelector() {
  const token = useOrderStore((state) => state.token);
  const addToCart = useOrderStore((state) => state.addToCart);

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [prices, setPrices] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!token) {
      return;
    }

    const request = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(token);
        setProducts(data);
      } catch (error: any) {
        toast.error(error.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    request();
  }, [token]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.sku, product.unit].some((value) =>
        value?.toLowerCase().includes(query),
      ),
    );
  }, [products, search]);

  const handleAdd = (product: Product) => {
    const nextQuantity = Number(quantities[product.id] || "1");
    const nextPrice = Number(prices[product.id] || product.price || 1);
    addToCart(
      {
        ...product,
        price: nextPrice > 0 ? nextPrice : 1,
      },
      nextQuantity > 0 ? nextQuantity : 1,
    );
    setQuantities((current) => ({ ...current, [product.id]: "1" }));
    setPrices((current) => ({ ...current, [product.id]: String(nextPrice > 0 ? nextPrice : 1) }));
    toast.success(`${product.name} added to cart.`);
  };

  return (
    <Card className="crm-card">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Products
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">Product selector</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search the nomenclature list and add products into the sale draft.
            </p>
          </div>
          <span className="crm-chip">{filteredProducts.length} items</span>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="crm-input pl-11"
            placeholder="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 rounded-[24px] border border-white/80 bg-white shimmer" />
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-[24px] border border-slate-200 bg-slate-50/60 p-4 transition hover:border-slate-300 hover:bg-white"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {product.name}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {product.sku ? <span className="crm-chip">{product.sku}</span> : null}
                      {product.unit ? <span className="crm-chip">{product.unit}</span> : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Input
                      className="crm-input h-12 w-full text-center sm:w-20"
                      inputMode="numeric"
                      value={quantities[product.id] ?? "1"}
                      onChange={(event) =>
                        setQuantities((current) => ({
                          ...current,
                          [product.id]: event.target.value,
                        }))
                      }
                    />

                    <Input
                      className="crm-input h-12 w-full text-center sm:w-28"
                      inputMode="decimal"
                      value={prices[product.id] ?? String(product.price > 0 ? product.price : 1)}
                      onChange={(event) =>
                        setPrices((current) => ({
                          ...current,
                          [product.id]: event.target.value,
                        }))
                      }
                    />

                    <Button
                      type="button"
                      className="h-12 rounded-2xl bg-slate-950 px-4 text-white hover:bg-slate-800"
                      onClick={() => handleAdd(product)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  Suggested price: {formatCurrency(product.price > 0 ? product.price : 1)}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/60 px-5 py-10 text-center text-slate-500">
              <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">No products found</p>
              <p className="mt-1 text-sm">Try another search term or check the token permissions.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
