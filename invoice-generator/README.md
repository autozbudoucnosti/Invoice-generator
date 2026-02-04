# Modern Invoice Generator (Next.js)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A clean, responsive **invoice maker** built for freelancers. Edit your details and line items in real time, switch between Czech and English, and print or export a professional PDF—all in the browser.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🇨🇿 🇬🇧 **Dual language** | Full Czech/English support with a single toggle. Invoice labels and UI adapt to your choice. |
| 📄 **PDF Export / Print-ready** | One-click print or save as PDF. Print view hides the editor so only the invoice document is output. |
| ⚡️ **Real-time preview** | Split view: edit on the left, see the invoice update live on the right (A4-style layout). |
| 💾 **Local Storage** | Sender details, payment notes, bank info, and QR code are saved automatically so you don’t lose data. |
| 📋 **CSV Import** | Import line items from a CSV (Description, Quantity, Price). Smart column detection and drag-and-drop. |
| 🧾 **Czech-style layout** | Optional “Czech Professional” layout: DODAVATEL/ODBĚRATEL, variable symbol, bank account, legal footer. |
| 🖼️ **QR code** | Upload a QR payment image to display on the invoice. |

---

## 🛠 Tech Stack

- **[Next.js](https://nextjs.org/)** (App Router) — React framework
- **[TypeScript](https://www.typescriptlang.org/)** — Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** — Styling
- **[Lucide React](https://lucide-react.dev/)** — Icons
- **[PapaParse](https://www.papaparse.com/)** — CSV parsing
- **Deploy-ready** on [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**

### Install & run

```bash
# Clone the repo (or open the project folder)
cd invoice-generator

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Other scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <sub>Built with Next.js · Ready for freelancers and small teams</sub>
</p>
