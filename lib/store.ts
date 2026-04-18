"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CartItem, Customer, InvoiceState, NamedEntity, Product } from "@/types";

function createInvoiceState(): InvoiceState {
  const datePart = new Date().toISOString().slice(0, 10).split("-").join("");

  return {
    number: `SALE-${datePart}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`,
    createdAt: new Date().toISOString(),
    currencyCode: "RUB",
    status: "Draft",
  };
}

type OrderStore = {
  hydrated: boolean;
  token: string;
  theme: "light" | "dark";
  invoice: InvoiceState;
  customer: Customer | null;
  organization: NamedEntity | null;
  warehouse: NamedEntity | null;
  paybox: NamedEntity | null;
  priceType: NamedEntity | null;
  cart: CartItem[];
  setHydrated: (hydrated: boolean) => void;
  setToken: (token: string) => void;
  clearToken: () => void;
  setTheme: (theme: "light" | "dark") => void;
  setCustomer: (customer: Customer | null) => void;
  setOrganization: (option: NamedEntity | null) => void;
  setWarehouse: (option: NamedEntity | null) => void;
  setPaybox: (option: NamedEntity | null) => void;
  setPriceType: (option: NamedEntity | null) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updatePrice: (productId: string, price: number) => void;
  removeFromCart: (productId: string) => void;
  resetDraft: () => void;
};

const initialDraft = () => ({
  invoice: createInvoiceState(),
  customer: null,
  organization: null,
  warehouse: null,
  paybox: null,
  priceType: null,
  cart: [] as CartItem[],
});

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      hydrated: false,
      token: "",
      theme: "light",
      ...initialDraft(),
      setHydrated: (hydrated) => set({ hydrated }),
      setTheme: (theme) => set({ theme }),
      setToken: (token) =>
        set((state) => ({
          token,
          invoice: state.invoice.number ? state.invoice : createInvoiceState(),
        })),
      clearToken: () =>
        set({
          hydrated: true,
          token: "",
          ...initialDraft(),
        }),
      setCustomer: (customer) => set({ customer }),
      setOrganization: (organization) => set({ organization }),
      setWarehouse: (warehouse) => set({ warehouse }),
      setPaybox: (paybox) => set({ paybox }),
      setPriceType: (priceType) => set({ priceType }),
      addToCart: (product, quantity = 1) =>
        set((state) => {
          const normalizedQuantity = quantity > 0 ? quantity : 1;
          const existing = state.cart.find((item) => item.productId === product.id);

          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.productId === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + normalizedQuantity,
                      lineTotal: (item.quantity + normalizedQuantity) * item.price,
                    }
                  : item,
              ),
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                id: crypto.randomUUID(),
                productId: product.id,
                name: product.name,
                quantity: normalizedQuantity,
                priceTypeId: state.priceType?.id,
                price: product.price > 0 ? product.price : 1,
                lineTotal: normalizedQuantity * (product.price > 0 ? product.price : 1),
                sku: product.sku,
                unit: product.unit,
              },
            ],
          };
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.productId === productId
                ? {
                    ...item,
                    quantity,
                    lineTotal: item.price * quantity,
                  }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),
      updatePrice: (productId, price) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  price,
                  lineTotal: price * item.quantity,
                }
              : item,
          ),
        })),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.productId !== productId),
        })),
      resetDraft: () =>
        set((state) => ({
          token: state.token,
          hydrated: state.hydrated,
          ...initialDraft(),
        })),
    }),
    {
      name: "tablecrm-order-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        theme: state.theme,
        invoice: state.invoice,
        customer: state.customer,
        organization: state.organization,
        warehouse: state.warehouse,
        paybox: state.paybox,
        priceType: state.priceType,
        cart: state.cart,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export function getOrderTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.lineTotal, 0);
}
