"use client";

import { useEffect, useMemo, useState } from "react";
import { Printer } from "lucide-react";

import type { Invoice } from "@/lib/invoice";
import { safeNumber } from "@/lib/invoice";
import type { Language } from "@/lib/i18n";
import { TRANSLATIONS } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { InvoiceEditor } from "@/components/invoice/InvoiceEditor";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";

function toISODate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const SENDER_STORAGE_KEY = "invoice_senderDetails_v1";
const PAYMENT_NOTES_STORAGE_KEY = "invoice_paymentNotes_v1";
const CZ_SETTINGS_STORAGE_KEY = "invoice_czSettings_v1";

const placeholderInvoice: Invoice = {
  senderDetails: {
    name: "Acme Studio LLC",
    address: "123 Market Street\nSan Francisco, CA 94103\nUnited States",
    email: "billing@acme.studio",
  },
  recipientDetails: {
    name: "Client Company",
    address: "500 King’s Road\nLondon SW10\nUnited Kingdom",
    email: "accounts@client.co",
  },
  invoiceDate: toISODate(new Date()),
  dueDate: toISODate(new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)),
  invoiceNumber: "INV-0001",
  currency: "USD",
  taxRate: 20,
  paymentNotes:
    "Bank Name: Chase\nAccount: 123456789\nRouting: 987654321\nReference: INV-0001",
  bankAccount: "123456789/0800",
  variableSymbol: "202506",
  paymentMethod: "Bankovní převod",
  legalFooterText: "Fyzická osoba zapsaná v živnostenském rejstříku.",
  qrCodeDataUrl: null,
  items: [
    { id: "item_1", description: "Design & UI work", quantity: 8, price: 120 },
    { id: "item_2", description: "Frontend implementation", quantity: 12, price: 140 },
  ],
};

export default function Home() {
  const [invoice, setInvoice] = useState<Invoice>(placeholderInvoice);
  const [language, setLanguage] = useState<Language>("cs");
  const t = TRANSLATIONS[language];

  // Load sender details on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SENDER_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Invoice["senderDetails"]>;
      if (!parsed || typeof parsed !== "object") return;

      setInvoice((prev) => ({
        ...prev,
        senderDetails: {
          ...prev.senderDetails,
          name: typeof parsed.name === "string" ? parsed.name : prev.senderDetails.name,
          address:
            typeof parsed.address === "string"
              ? parsed.address
              : prev.senderDetails.address,
          email:
            typeof parsed.email === "string" ? parsed.email : prev.senderDetails.email,
        },
      }));
    } catch {
      // ignore
    }
  }, []);

  // Load payment notes on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PAYMENT_NOTES_STORAGE_KEY);
      if (raw == null) return;
      setInvoice((prev) => ({
        ...prev,
        paymentNotes: raw,
      }));
    } catch {
      // ignore
    }
  }, []);

  // Load CZ layout settings on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CZ_SETTINGS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<
        Pick<
          Invoice,
          "bankAccount" | "variableSymbol" | "paymentMethod" | "legalFooterText" | "qrCodeDataUrl"
        >
      >;
      if (!parsed || typeof parsed !== "object") return;

      setInvoice((prev) => ({
        ...prev,
        bankAccount:
          typeof parsed.bankAccount === "string" ? parsed.bankAccount : prev.bankAccount,
        variableSymbol:
          typeof parsed.variableSymbol === "string"
            ? parsed.variableSymbol
            : prev.variableSymbol,
        paymentMethod:
          typeof parsed.paymentMethod === "string"
            ? parsed.paymentMethod
            : prev.paymentMethod,
        legalFooterText:
          typeof parsed.legalFooterText === "string"
            ? parsed.legalFooterText
            : prev.legalFooterText,
        qrCodeDataUrl:
          typeof parsed.qrCodeDataUrl === "string" || parsed.qrCodeDataUrl === null
            ? (parsed.qrCodeDataUrl as string | null)
            : prev.qrCodeDataUrl,
      }));
    } catch {
      // ignore
    }
  }, []);

  // Persist sender details
  useEffect(() => {
    try {
      localStorage.setItem(
        SENDER_STORAGE_KEY,
        JSON.stringify(invoice.senderDetails),
      );
    } catch {
      // ignore
    }
  }, [invoice.senderDetails]);

  // Persist payment notes
  useEffect(() => {
    try {
      localStorage.setItem(PAYMENT_NOTES_STORAGE_KEY, invoice.paymentNotes ?? "");
    } catch {
      // ignore
    }
  }, [invoice.paymentNotes]);

  // Persist CZ layout settings
  useEffect(() => {
    try {
      localStorage.setItem(
        CZ_SETTINGS_STORAGE_KEY,
        JSON.stringify({
          bankAccount: invoice.bankAccount ?? "",
          variableSymbol: invoice.variableSymbol ?? "",
          paymentMethod: invoice.paymentMethod ?? "",
          legalFooterText: invoice.legalFooterText ?? "",
          qrCodeDataUrl: invoice.qrCodeDataUrl ?? null,
        }),
      );
    } catch {
      // ignore
    }
  }, [
    invoice.bankAccount,
    invoice.variableSymbol,
    invoice.paymentMethod,
    invoice.legalFooterText,
    invoice.qrCodeDataUrl,
  ]);

  const subtotal = useMemo(() => {
    return invoice.items.reduce((sum, item) => {
      const q = safeNumber(item.quantity, 0);
      const p = safeNumber(item.price, 0);
      return sum + q * p;
    }, 0);
  }, [invoice.items]);

  const taxAmount = useMemo(() => {
    const rate = safeNumber(invoice.taxRate, 0);
    return subtotal * (rate / 100);
  }, [subtotal, invoice.taxRate]);

  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
        <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              {t.appTitle}
            </h1>
            <p className="text-sm text-slate-600">
              {t.appSubtitle}
            </p>
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-[440px_1fr] lg:items-start">
          <div data-print="hide">
            <InvoiceEditor
              invoice={invoice}
              setInvoice={setInvoice}
              language={language}
              setLanguage={setLanguage}
            />
          </div>

          <div className="min-w-0">
            <InvoicePreview
              invoice={invoice}
              subtotal={subtotal}
              taxAmount={taxAmount}
              total={total}
              language={language}
            />
          </div>
        </main>
      </div>

      <div className="print-hide" data-print="hide">
        <Button
          onClick={() => window.print()}
          className="fixed bottom-6 right-6 shadow-lg"
        >
          <Printer className="h-4 w-4" />
          {t.print}
        </Button>
      </div>
    </div>
  );
}
