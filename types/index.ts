export interface NamedEntity {
  id: string;
  name: string;
  secondaryName?: string;
  raw?: Record<string, unknown>;
}

export interface Customer extends NamedEntity {
  phone: string;
}

export interface Product extends NamedEntity {
  price: number;
  sku?: string;
  unit?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  lineTotal: number;
  priceTypeId?: string;
  sku?: string;
  unit?: string;
}

export interface InvoiceState {
  number: string;
  createdAt: string;
  currencyCode: string;
  status: "Draft";
}

export interface SaleGoodPayload {
  nomenclature: number | string;
  quantity: number;
  price: number;
  price_type?: number;
  nomenclature_name?: string;
  unit_name?: string;
}

export interface SaleDocumentPayload {
  organization: number;
  contragent?: number;
  warehouse?: number;
  paybox?: number;
  status?: boolean;
  operation?: string;
  number?: string;
  dated?: number;
  comment?: string;
  goods: SaleGoodPayload[];
}
