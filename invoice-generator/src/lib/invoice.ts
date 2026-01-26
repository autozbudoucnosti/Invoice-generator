export type Currency = "USD" | "EUR" | "GBP";

export interface PartyDetails {
  name: string;
  address: string;
  email: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  senderDetails: PartyDetails;
  recipientDetails: PartyDetails;
  invoiceDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  invoiceNumber: string;
  currency: Currency;
  taxRate: number; // percent
  paymentNotes: string;
  bankAccount: string; // number / code (e.g. 123456789/0800)
  variableSymbol: string; // VS
  paymentMethod: string; // e.g. Bank transfer
  legalFooterText: string;
  qrCodeDataUrl: string | null;
  items: InvoiceItem[];
}

export function formatCurrency(amount: number, currency: Currency) {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe);
}

export function safeNumber(value: unknown, fallback = 0) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function createId() {
  // Browser-safe unique id (no deps)
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `item_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

