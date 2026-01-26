import type React from "react";

import { useEffect, useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import { FileUp, ImageUp, Plus, Trash2 } from "lucide-react";

import type { Currency, Invoice } from "@/lib/invoice";
import { createId, safeNumber } from "@/lib/invoice";
import type { Language } from "@/lib/i18n";
import { TRANSLATIONS } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Section } from "@/components/ui/Section";

export function InvoiceEditor({
  invoice,
  setInvoice,
  language,
  setLanguage,
}: {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
}) {
  const t = TRANSLATIONS[language];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const qrInputRef = useRef<HTMLInputElement | null>(null);
  const [importing, setImporting] = useState(false);
  const [importNotice, setImportNotice] = useState<
    | { type: "success" | "error"; message: string }
    | null
  >(null);
  const [qrNotice, setQrNotice] = useState<
    | { type: "success" | "error"; message: string }
    | null
  >(null);

  useEffect(() => {
    if (!importNotice) return;
    const t = window.setTimeout(() => setImportNotice(null), 4500);
    return () => window.clearTimeout(t);
  }, [importNotice]);

  useEffect(() => {
    if (!qrNotice) return;
    const t = window.setTimeout(() => setQrNotice(null), 4500);
    return () => window.clearTimeout(t);
  }, [qrNotice]);

  const setField = <K extends keyof Invoice>(key: K, value: Invoice[K]) => {
    setInvoice((prev) => ({ ...prev, [key]: value }));
  };

  const setPartyField = (
    party: "senderDetails" | "recipientDetails",
    key: "name" | "address" | "email",
    value: string,
  ) => {
    setInvoice((prev) => ({
      ...prev,
      [party]: { ...prev[party], [key]: value },
    }));
  };

  const updateItem = (
    id: string,
    patch: Partial<Invoice["items"][number]>,
  ) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));
  };

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: createId(), description: t.importedItemFallback, quantity: 1, price: 0 },
      ],
    }));
  };

  const deleteItem = (id: string) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== id),
    }));
  };

  const normalizeHeader = (h: string) =>
    h
      .trim()
      .toLowerCase()
      .replace(/[\s\-_]+/g, "");

  const headerMap = useMemo(() => {
    return {
      description: new Set([
        "description",
        "desc",
        "item",
        "itemdescription",
        "name",
        "service",
        "product",
        "details",
      ]),
      quantity: new Set([
        "quantity",
        "qty",
        "qnty",
        "count",
        "units",
        "unit",
        "hours",
      ]),
      price: new Set([
        "price",
        "rate",
        "unitprice",
        "unitcost",
        "cost",
        "amountperunit",
      ]),
    };
  }, []);

  const detectColumns = (fields: string[]) => {
    const normalized = fields.map((f) => ({ raw: f, key: normalizeHeader(f) }));

    const exact = (candidates: Set<string>) =>
      normalized.find((f) => candidates.has(f.key))?.raw;

    let description = exact(headerMap.description);
    let quantity = exact(headerMap.quantity);
    let price = exact(headerMap.price);

    // Fallback heuristic: try partial matches (e.g. "Item Description")
    const partial = (needle: string) =>
      normalized.find((f) => f.key.includes(needle))?.raw;

    description = description ?? partial("description") ?? partial("desc");
    quantity = quantity ?? partial("quantity") ?? partial("qty");
    price = price ?? partial("unitprice") ?? partial("price") ?? partial("rate");

    if (!description || !quantity || !price) return null;
    return { description, quantity, price };
  };

  const parseNumericCell = (value: unknown) => {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return safeNumber(value, 0);
    // Remove currency symbols/spaces, keep digits, dot, comma, minus
    const cleaned = value
      .trim()
      .replace(/[^\d,.\-]/g, "")
      .replace(/,/g, "");
    return safeNumber(cleaned, 0);
  };

  const importCsvFile = async (file: File) => {
    if (importing) return;
    setImporting(true);
    setImportNotice(null);

    try {
      const result = await new Promise<Papa.ParseResult<Record<string, unknown>>>(
        (resolve, reject) => {
          Papa.parse<Record<string, unknown>>(file, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (h) => h.trim(),
            complete: (res) => resolve(res),
            error: (err) => reject(err),
          });
        },
      );

      const fields = (result.meta.fields ?? []).filter(Boolean) as string[];
      const mapping = detectColumns(fields);
      if (!mapping) {
        throw new Error(
          t.csvMissingColumns,
        );
      }

      const imported = result.data
        .map((row) => {
          const description = String(row[mapping.description] ?? "").trim();
          const quantity = parseNumericCell(row[mapping.quantity]);
          const price = parseNumericCell(row[mapping.price]);
          return { description, quantity, price };
        })
        .filter((r) => r.description || r.quantity || r.price)
        .map((r) => ({
          id: createId(),
          description: r.description || t.importedItemFallback,
          quantity: Math.max(0, Math.floor(safeNumber(r.quantity, 0))),
          price: Math.max(0, safeNumber(r.price, 0)),
        }));

      if (imported.length === 0) {
        throw new Error(
          t.csvNoRows,
        );
      }

      setInvoice((prev) => ({ ...prev, items: [...prev.items, ...imported] }));
      setImportNotice({
        type: "success",
        message: t.importSuccess(imported.length),
      });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : t.importFail;
      setImportNotice({ type: "error", message });
    } finally {
      setImporting(false);
    }
  };

  const onPickCsv = () => fileInputRef.current?.click();

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    // allow re-uploading same file
    e.currentTarget.value = "";
    if (!file) return;
    await importCsvFile(file);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await importCsvFile(file);
  };

  const onPickQr = () => qrInputRef.current?.click();

  const onQrFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    e.currentTarget.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setQrNotice({ type: "error", message: t.imageOnlyError });
      return;
    }

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(new Error(t.qrUploadFail));
        reader.readAsDataURL(file);
      });
      if (!dataUrl) throw new Error(t.qrUploadFail);

      setInvoice((prev) => ({ ...prev, qrCodeDataUrl: dataUrl }));
      setQrNotice({ type: "success", message: t.qrUploadSuccess });
    } catch (err) {
      setQrNotice({
        type: "error",
        message: err instanceof Error ? err.message : t.qrUploadFail,
      });
    }
  };

  return (
    <Card className="print-hide">
      <CardHeader>
        <CardTitle>{t.editorTitle}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Language switcher */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-1">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setLanguage("cs")}
              className={
                language === "cs"
                  ? "rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200"
                  : "rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white/60"
              }
            >
              {t.languageCs}
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={
                language === "en"
                  ? "rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200"
                  : "rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white/60"
              }
            >
              {t.languageEn}
            </button>
          </div>
        </div>

        <Section title={t.settings} defaultOpen>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t.currency}>
              <Select
                value={invoice.currency}
                onChange={(e) =>
                  setField("currency", e.target.value as Currency)
                }
              >
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="GBP">GBP (British Pound)</option>
              </Select>
            </Field>
            <Field label={t.taxRate}>
              <Input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={invoice.taxRate}
                onChange={(e) =>
                  setField("taxRate", safeNumber(e.target.value, 0))
                }
              />
            </Field>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label={t.bankAccount}>
              <Input
                value={invoice.bankAccount}
                placeholder="123456789/0800"
                onChange={(e) => setField("bankAccount", e.target.value)}
              />
            </Field>
            <Field label={t.variableSymbol}>
              <Input
                value={invoice.variableSymbol}
                placeholder="202506"
                onChange={(e) => setField("variableSymbol", e.target.value)}
              />
            </Field>
            <Field label={t.paymentMethod}>
              <Input
                value={invoice.paymentMethod}
                placeholder="Bankovní převod"
                onChange={(e) => setField("paymentMethod", e.target.value)}
              />
            </Field>
            <Field label={t.qrUploadLabel}>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="h-10 whitespace-nowrap"
                  onClick={onPickQr}
                >
                  <ImageUp className="h-4 w-4" />
                  {t.uploadQr}
                </Button>
                <input
                  ref={qrInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onQrFileChange}
                />
                <div className="flex h-10 flex-1 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600">
                  {invoice.qrCodeDataUrl ? t.qrImageSet : t.qrNoImage}
                </div>
              </div>
            </Field>
          </div>

          {qrNotice ? (
            <div
              className={
                qrNotice.type === "success"
                  ? "mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
                  : "mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              }
            >
              {qrNotice.message}
            </div>
          ) : null}

          <div className="mt-3">
            <Field
              label={t.paymentNotesLabel}
              hint={t.paymentNotesHint}
            >
              <Textarea
                value={invoice.paymentNotes}
                placeholder={t.paymentNotesPlaceholder}
                onChange={(e) => setField("paymentNotes", e.target.value)}
              />
            </Field>
          </div>

          <div className="mt-3">
            <Field label={t.legalFooter}>
              <Textarea
                value={invoice.legalFooterText}
                placeholder={t.legalFooterPlaceholder}
                onChange={(e) => setField("legalFooterText", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title={t.myDetails} defaultOpen>
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t.name}>
                <Input
                  value={invoice.senderDetails.name}
                  onChange={(e) =>
                    setPartyField("senderDetails", "name", e.target.value)
                  }
                />
              </Field>
              <Field label={t.email}>
                <Input
                  type="email"
                  value={invoice.senderDetails.email}
                  onChange={(e) =>
                    setPartyField("senderDetails", "email", e.target.value)
                  }
                />
              </Field>
            </div>
            <Field label={t.address}>
              <Textarea
                value={invoice.senderDetails.address}
                onChange={(e) =>
                  setPartyField("senderDetails", "address", e.target.value)
                }
              />
            </Field>
          </div>
        </Section>

        <Section title={t.clientDetails} defaultOpen>
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t.name}>
                <Input
                  value={invoice.recipientDetails.name}
                  onChange={(e) =>
                    setPartyField("recipientDetails", "name", e.target.value)
                  }
                />
              </Field>
              <Field label={t.email}>
                <Input
                  type="email"
                  value={invoice.recipientDetails.email}
                  onChange={(e) =>
                    setPartyField("recipientDetails", "email", e.target.value)
                  }
                />
              </Field>
            </div>
            <Field label={t.address}>
              <Textarea
                value={invoice.recipientDetails.address}
                onChange={(e) =>
                  setPartyField("recipientDetails", "address", e.target.value)
                }
              />
            </Field>
          </div>
        </Section>

        <Section title={t.invoiceDetails} defaultOpen>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t.issueDate}>
              <Input
                type="date"
                value={invoice.invoiceDate}
                onChange={(e) => setField("invoiceDate", e.target.value)}
              />
            </Field>
            <Field label={t.dueDate}>
              <Input
                type="date"
                value={invoice.dueDate}
                onChange={(e) => setField("dueDate", e.target.value)}
              />
            </Field>
            <Field label={t.invoiceNumber}>
              <Input
                value={invoice.invoiceNumber}
                onChange={(e) => setField("invoiceNumber", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              {t.itemsSectionTitle}
            </h3>
            <span className="text-xs text-slate-500">
              {invoice.items.length}{" "}
              {invoice.items.length === 1
                ? t.itemCount_one
                : invoice.items.length >= 2 && invoice.items.length <= 4
                  ? t.itemCount_few
                  : t.itemCount_many}
            </span>
          </div>

          <div className="grid gap-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="secondary"
                onClick={onPickCsv}
                disabled={importing}
                className="h-10 justify-center"
              >
                <FileUp className="h-4 w-4" />
                {importing ? t.importing : t.importCsv}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={onFileChange}
              />

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"
              >
                {t.dragDropCsv}
              </div>
            </div>

            {importNotice ? (
              <div
                className={
                  importNotice.type === "success"
                    ? "rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
                    : "rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                }
              >
                {importNotice.message}
              </div>
            ) : null}
          </div>

          <div className="grid gap-2">
            {invoice.items.map((item) => (
              <div
                key={item.id}
                className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_96px_128px_40px] sm:items-end"
              >
                <Field label={t.itemDescription} className="sm:col-span-1">
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, { description: e.target.value })
                    }
                  />
                </Field>
                <Field label={t.itemQty}>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, {
                        quantity: Math.max(
                          0,
                          Math.floor(safeNumber(e.target.value, 0)),
                        ),
                      })
                    }
                  />
                </Field>
                <Field label={t.itemPrice}>
                  <Input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(item.id, {
                        price: Math.max(0, safeNumber(e.target.value, 0)),
                      })
                    }
                  />
                </Field>
                <div className="flex justify-end sm:justify-center">
                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label={t.deleteItem}
                    title={t.deleteItem}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="secondary"
            className="h-11 w-full justify-center"
            onClick={addItem}
          >
            <Plus className="h-4 w-4" />
            {t.addItem}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

