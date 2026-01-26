import type { Invoice } from "@/lib/invoice";
import { formatCurrency } from "@/lib/invoice";
import type { Language } from "@/lib/i18n";
import { TRANSLATIONS, formatDateByLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function InvoicePreview({
  invoice,
  subtotal,
  taxAmount,
  total,
  language,
  className,
}: {
  invoice: Invoice;
  subtotal: number;
  taxAmount: number;
  total: number;
  language: Language;
  className?: string;
}) {
  const label = "text-xs font-bold text-gray-500 uppercase tracking-wide";
  const t = TRANSLATIONS[language];

  return (
    <div className={cn("mx-auto w-full max-w-[900px]", className)}>
      <div
        id="invoice-preview"
        className={cn(
          "invoice-paper",
          "mx-auto w-full bg-white text-slate-900 shadow-sm ring-1 ring-slate-200",
          "aspect-[210/297] min-h-[720px]",
        )}
      >
        <div className="flex h-full flex-col p-8 font-sans sm:p-10">
          <div className="flex h-full flex-col gap-8">
            {/* Header section */}
            <div className="grid grid-cols-[140px_1fr] gap-6 items-start">
              <div className="h-[140px] w-[140px] overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                {invoice.qrCodeDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={invoice.qrCodeDataUrl}
                    alt={t.qrPlaceholder}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
                    {t.qrPlaceholder}
                  </div>
                )}
              </div>

              <div className="text-sm text-slate-900">
                <div className={label}>{t.supplier}</div>
                <div className="mt-2 leading-6 text-slate-700">
                  <div className="text-base font-semibold text-slate-900">
                    {invoice.senderDetails.name}
                  </div>
                  <div className="whitespace-pre-line">
                    {invoice.senderDetails.address}
                  </div>
                  <div>{invoice.senderDetails.email}</div>
                </div>
              </div>
            </div>

            {/* Title bar */}
            <div className="border-y border-gray-200 py-4">
              <div className="text-3xl font-black tracking-tight text-slate-900">
                {t.titleBarPrefix} {invoice.invoiceNumber}
              </div>
            </div>

            {/* Mid section */}
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="text-sm text-slate-900">
                <div className={label}>{t.subscriber}</div>
                <div className="mt-2 leading-6 text-slate-700">
                  <div className="text-base font-semibold text-slate-900">
                    {invoice.recipientDetails.name}
                  </div>
                  <div className="whitespace-pre-line">
                    {invoice.recipientDetails.address}
                  </div>
                  <div>{invoice.recipientDetails.email}</div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4 text-sm">
                <dl className="grid gap-3">
                  <div className="grid grid-cols-[1fr_auto] items-baseline gap-4">
                    <dt className={label}>{t.issueDate}</dt>
                    <dd className="font-semibold text-slate-900">
                      {formatDateByLanguage(language, invoice.invoiceDate)}
                    </dd>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] items-baseline gap-4">
                    <dt className={label}>{t.dueDate}</dt>
                    <dd className="font-semibold text-slate-900">
                      {formatDateByLanguage(language, invoice.dueDate)}
                    </dd>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] items-baseline gap-4">
                    <dt className={label}>{t.metaBank}</dt>
                    <dd className="font-semibold text-slate-900">
                      {invoice.bankAccount || "—"}
                    </dd>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] items-baseline gap-4">
                    <dt className={label}>{t.metaVs}</dt>
                    <dd className="font-semibold text-slate-900">
                      {invoice.variableSymbol || "—"}
                    </dd>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] items-baseline gap-4">
                    <dt className={label}>{t.metaPaymentMethod}</dt>
                    <dd className="font-semibold text-slate-900">
                      {invoice.paymentMethod || "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Items table */}
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className={cn("px-4 py-3", label)}>{t.tableItem}</th>
                    <th className={cn("px-4 py-3 text-right", label)}>{t.tableQty}</th>
                    <th className={cn("px-4 py-3 text-right", label)}>
                      {t.tableUnitPrice}
                    </th>
                    <th className={cn("px-4 py-3 text-right", label)}>{t.tableTotal}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.items.map((item) => {
                    const lineTotal = item.quantity * item.price;
                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">
                            {item.description || "—"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-700">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-700">
                          {formatCurrency(item.price, invoice.currency)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">
                          {formatCurrency(lineTotal, invoice.currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer area (bottom) */}
            <div className="mt-auto grid gap-4">
              <div className="ml-auto w-full max-w-sm rounded-xl border border-gray-200 p-4">
                <dl className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-gray-600">{t.subtotal}</dt>
                    <dd className="font-semibold text-slate-900">
                      {formatCurrency(subtotal, invoice.currency)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-gray-600">
                      {t.tax} ({invoice.taxRate}%)
                    </dt>
                    <dd className="font-semibold text-slate-900">
                      {formatCurrency(taxAmount, invoice.currency)}
                    </dd>
                  </div>
                  <div className="mt-2 border-t border-gray-200 pt-2">
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-900">{t.totalDue}</dt>
                      <dd className="text-lg font-black text-slate-900">
                        {formatCurrency(total, invoice.currency)}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>

              {invoice.paymentNotes?.trim() ? (
                <div className="text-sm text-gray-600">
                  <div className={label}>{t.notes}</div>
                  <div className="mt-2 whitespace-pre-line">
                    {invoice.paymentNotes}
                  </div>
                </div>
              ) : null}

              <div className="border-t border-gray-200 pt-3 text-xs text-gray-500">
                {invoice.legalFooterText || " "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

