export type Language = "cs" | "en";

export type Translations = {
  appTitle: string;
  appSubtitle: string;

  languageCs: string;
  languageEn: string;

  editorTitle: string;
  settings: string;
  myDetails: string;
  clientDetails: string;
  invoiceDetails: string;

  currency: string;
  taxRate: string;

  bankAccount: string;
  variableSymbol: string;
  paymentMethod: string;
  qrUploadLabel: string;
  uploadQr: string;
  qrImageSet: string;
  qrNoImage: string;
  qrUploadSuccess: string;
  qrUploadFail: string;
  imageOnlyError: string;

  paymentNotesLabel: string;
  paymentNotesHint: string;
  paymentNotesPlaceholder: string;

  legalFooter: string;
  legalFooterPlaceholder: string;

  name: string;
  email: string;
  address: string;

  issueDate: string;
  dueDate: string;
  invoiceNumber: string;

  itemsSectionTitle: string;
  itemCount_one: string;
  itemCount_few: string;
  itemCount_many: string;

  importCsv: string;
  importing: string;
  dragDropCsv: string;
  csvMissingColumns: string;
  csvNoRows: string;
  importedItemFallback: string;
  importSuccess: (n: number) => string;
  importFail: string;

  itemDescription: string;
  itemQty: string;
  itemPrice: string;
  addItem: string;
  deleteItem: string;

  print: string;

  invoiceTitle: string;
  supplier: string;
  subscriber: string;
  qrPlaceholder: string;
  titleBarPrefix: string;

  metaBank: string;
  metaVs: string;
  metaPaymentMethod: string;

  tableItem: string;
  tableQty: string;
  tableUnitPrice: string;
  tableTotal: string;

  subtotal: string;
  tax: string;
  totalDue: string;

  notes: string;
};

export const TRANSLATIONS = {
  cs: {
    appTitle: "Generátor faktur",
    appSubtitle:
      "Upravujte vlevo, náhled je vpravo. Tisk vytiskne pouze dokument.",

    languageCs: "🇨🇿 Česky",
    languageEn: "🇬🇧 English",

    editorTitle: "Editor faktury",
    settings: "Nastavení",
    myDetails: "Moje údaje",
    clientDetails: "Údaje odběratele",
    invoiceDetails: "Detaily faktury",

    currency: "Měna",
    taxRate: "DPH (%)",

    bankAccount: "Účet / kód banky",
    variableSymbol: "Variabilní symbol (VS)",
    paymentMethod: "Způsob platby",
    qrUploadLabel: "QR kód (nahrát obrázek)",
    uploadQr: "Nahrát QR",
    qrImageSet: "QR obrázek nastaven",
    qrNoImage: "Nebyl nahrán žádný obrázek",
    qrUploadSuccess: "QR kód byl nahrán.",
    qrUploadFail: "Nahrání QR kódu se nezdařilo.",
    imageOnlyError: "Nahrajte prosím obrázek.",

    paymentNotesLabel: "Platební instrukce / poznámka",
    paymentNotesHint: "Zobrazí se dole na faktuře a uloží se lokálně.",
    paymentNotesPlaceholder:
      "Banka: ČSOB\nÚčet: 123456789\nKód banky: 0300\nPozn.: uveďte VS",

    legalFooter: "Právní doložka (patička)",
    legalFooterPlaceholder: "Fyzická osoba zapsaná...",

    name: "Jméno / Název",
    email: "E-mail",
    address: "Adresa",

    issueDate: "Datum vystavení",
    dueDate: "Datum splatnosti",
    invoiceNumber: "Číslo faktury",

    itemsSectionTitle: "Položky",
    itemCount_one: "položka",
    itemCount_few: "položky",
    itemCount_many: "položek",

    importCsv: "Import CSV",
    importing: "Importuji…",
    dragDropCsv:
      "Přetáhněte sem CSV. Očekávané sloupce: Description, Quantity/Qty, Price/Rate.",
    csvMissingColumns:
      "CSV musí mít sloupce Description, Qty/Quantity a Price/Rate.",
    csvNoRows:
      "Nenašly se žádné použitelné řádky. Zkontrolujte data pod hlavičkami.",
    importedItemFallback: "Importovaná položka",
    importSuccess: (n: number) => `Importováno ${n} položek!`,
    importFail: "Import CSV se nezdařil.",

    itemDescription: "Položka",
    itemQty: "Množství",
    itemPrice: "Cena",
    addItem: "Přidat položku",
    deleteItem: "Smazat položku",

    print: "Stáhnout / Tisk",

    invoiceTitle: "FAKTURA",
    supplier: "DODAVATEL",
    subscriber: "ODBĚRATEL",
    qrPlaceholder: "QR Platba",

    titleBarPrefix: "Faktura",

    metaBank: "Účet / kód banky",
    metaVs: "Variabilní symbol (VS)",
    metaPaymentMethod: "Způsob platby",

    tableItem: "Položka",
    tableQty: "Množství",
    tableUnitPrice: "Cena / jednotka",
    tableTotal: "Celkem",

    subtotal: "Mezisoučet",
    tax: "DPH",
    totalDue: "Celkem k úhradě",

    notes: "Poznámka",
  },
  en: {
    appTitle: "Invoice Generator",
    appSubtitle:
      "Edit on the left, preview on the right. Print outputs only the document.",

    languageCs: "🇨🇿 Česky",
    languageEn: "🇬🇧 English",

    editorTitle: "Invoice editor",
    settings: "Settings",
    myDetails: "My Details",
    clientDetails: "Client Details",
    invoiceDetails: "Invoice Details",

    currency: "Currency",
    taxRate: "Tax rate (%)",

    bankAccount: "Bank account (number / code)",
    variableSymbol: "Variable symbol (VS)",
    paymentMethod: "Payment method",
    qrUploadLabel: "QR Code (upload image)",
    uploadQr: "Upload QR",
    qrImageSet: "QR image set",
    qrNoImage: "No image uploaded",
    qrUploadSuccess: "QR code uploaded.",
    qrUploadFail: "Failed to upload QR code.",
    imageOnlyError: "Please upload an image file.",

    paymentNotesLabel: "Payment Instructions / Notes",
    paymentNotesHint: "Shown at the bottom of the invoice and saved locally.",
    paymentNotesPlaceholder:
      "Bank Name: Chase\nAccount: 123456789\nRouting: 987654321",

    legalFooter: "Legal footer text",
    legalFooterPlaceholder: "Sole proprietor registered...",

    name: "Name",
    email: "Email",
    address: "Address",

    issueDate: "Issue Date",
    dueDate: "Due Date",
    invoiceNumber: "Invoice #",

    itemsSectionTitle: "Items",
    itemCount_one: "item",
    itemCount_few: "items",
    itemCount_many: "items",

    importCsv: "Import CSV",
    importing: "Importing...",
    dragDropCsv:
      "Drag & drop CSV here. Expected columns: Description, Quantity/Qty, Price/Rate.",
    csvMissingColumns:
      "CSV must have Description, Qty/Quantity, and Price/Rate columns.",
    csvNoRows:
      "No usable rows found. Ensure the CSV has data rows under the headers.",
    importedItemFallback: "Imported item",
    importSuccess: (n: number) => `Imported ${n} item${n === 1 ? "" : "s"}!`,
    importFail: "Failed to import CSV.",

    itemDescription: "Item name",
    itemQty: "Quantity",
    itemPrice: "Price",
    addItem: "Add item",
    deleteItem: "Delete item",

    print: "Download / Print",

    invoiceTitle: "INVOICE",
    supplier: "SUPPLIER",
    subscriber: "SUBSCRIBER",
    qrPlaceholder: "QR Payment",

    titleBarPrefix: "Invoice",

    metaBank: "Bank account & code",
    metaVs: "Variable symbol (VS)",
    metaPaymentMethod: "Payment method",

    tableItem: "Item name",
    tableQty: "Quantity",
    tableUnitPrice: "Price / unit",
    tableTotal: "Total",

    subtotal: "Subtotal",
    tax: "Tax",
    totalDue: "Amount due",

    notes: "Notes",
  },
} as const satisfies Record<Language, Translations>;

export function getLocale(language: Language) {
  return language === "cs" ? "cs-CZ" : "en-GB";
}

export function formatDateByLanguage(language: Language, date: string) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;

  const locale = getLocale(language);
  if (language === "cs") {
    // 25. 01. 2026
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  }

  // Jan 25, 2026
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

