import axios from "axios";

import type { Customer, NamedEntity, Product, SaleDocumentPayload } from "@/types";

const BASE_URL = "https://app.tablecrm.com/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

function withToken(endpoint: string, token: string) {
  const separator = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${separator}token=${encodeURIComponent(token)}`;
}

function asArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value as Record<string, unknown>[];
  }

  if (value && typeof value === "object") {
    const maybeObject = value as Record<string, unknown>;
    const keys = ["data", "items", "results", "rows", "payload"];

    for (const key of keys) {
      if (Array.isArray(maybeObject[key])) {
        return maybeObject[key] as Record<string, unknown>[];
      }
    }
  }

  return [];
}

function readId(item: Record<string, unknown>) {
  return String(
    item.id ??
      item.ID ??
      item.uuid ??
      item.guid ??
      item.value ??
      item.contractor_id ??
      item.product_id ??
      "",
  );
}

function readName(item: Record<string, unknown>) {
  return String(
    item.work_name ??
      item.short_name ??
      item.full_name ??
    item.name ??
    item.title ??
    item.label ??
      item.full_name ??
      item.display_name ??
      item.text ??
      "",
  );
}

function readPhone(item: Record<string, unknown>) {
  return String(item.phone ?? item.phone_number ?? item.mobile ?? item.tel ?? "");
}

function readPrice(item: Record<string, unknown>) {
  const prices =
    Array.isArray(item.prices) && item.prices.length > 0
      ? item.prices[0]
      : item.prices && typeof item.prices === "object"
        ? item.prices
        : null;

  const raw =
    item.price ??
    item.sale_price ??
    item.price_sale ??
    item.base_price ??
    (prices && typeof prices === "object"
      ? (prices as Record<string, unknown>).price ??
        (prices as Record<string, unknown>).value ??
        (prices as Record<string, unknown>).sum
      : null) ??
    item.cost ??
    item.sum ??
    item.amount ??
    0;

  return Number(raw) || 0;
}

function normalizeError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ||
      error.response?.statusText ||
      error.message;

    return new Error(message || "TableCRM request failed.");
  }

  return error instanceof Error ? error : new Error("TableCRM request failed.");
}

async function getCollection(
  endpoint: string,
  token: string,
  params?: Record<string, string | number>,
) {
  try {
    const response = await apiClient.get(withToken(endpoint, token), { params });
    return asArray(response.data);
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function fetchNamedCollection(endpoint: string, token: string) {
  const rows = await getCollection(endpoint, token);

  return rows
    .map(
      (item): NamedEntity => ({
        id: readId(item),
        name: readName(item),
        secondaryName: String(item.full_name ?? item.short_name ?? item.description ?? ""),
        raw: item,
      }),
    )
    .filter((item) => item.id && item.name);
}

export async function searchCustomers(token: string, query: string) {
  const endpoints = ["/contractors", "/contragents"];

  for (const [index, endpoint] of endpoints.entries()) {
    try {
      const rows = await getCollection(endpoint, token, {
        search: query,
        q: query,
        phone: query,
      });

      const customers = rows
        .map(
          (item): Customer => ({
            id: readId(item),
            name: readName(item),
            phone: readPhone(item),
            raw: item,
          }),
        )
        .filter((item) => item.id && (item.name || item.phone));

      if (customers.length > 0 || index === endpoints.length - 1) {
        return customers;
      }
    } catch (error) {
      if (index === endpoints.length - 1) {
        throw normalizeError(error);
      }
    }
  }

  return [];
}

export async function fetchProducts(token: string) {
  const rows = await getCollection("/nomenclature", token);

  return rows
    .map(
      (item): Product => ({
        id: readId(item),
        name: readName(item),
        price: readPrice(item),
        sku: String(item.article ?? item.sku ?? item.code ?? ""),
        unit: String(item.unit ?? item.measurement ?? item.unit_name ?? ""),
        raw: item,
      }),
    )
    .filter((item) => item.id && item.name);
}

export async function createSale(token: string, payload: SaleDocumentPayload) {
  try {
    const response = await apiClient.post(withToken("/docs_sales/", token), [payload]);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}
