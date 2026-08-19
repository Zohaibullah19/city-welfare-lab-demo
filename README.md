# City Welfare Medical Laboratory — LIMS Demo

A demo Laboratory Management System built for **City Welfare Medical Laboratory**
(City Medical Center Peshawar) to preview the full patient → tests → results → report
workflow before development of the production system begins.

This is a **demo**, not the final product. It runs entirely in the browser using
`localStorage` — there is no backend, database server, or internet connection required
after installation.

---

## 1. Project Structure

```
city-welfare-lab-demo/
├── public/
│   └── logo/
│       ├── logo.svg              ← clean vector recreation of the logo (used in-app)
│       └── logo-extracted.png    ← cropped photo of the real logo from your form
├── src/
│   ├── components/                Sidebar, TopHeader, Modal, StatusBadge, etc.
│   ├── pages/                     Dashboard, Patients, Orders, Catalog, Results, Reports, Settings, Print views
│   ├── layouts/MainLayout.jsx     Sidebar + header shell
│   ├── context/                   Toast notifications + shared app-data refresh
│   ├── services/storage.js        ⭐ the ONLY file that touches localStorage
│   ├── config/labInfo.js          ⭐ lab name / address / technologists (defaults)
│   ├── data/tests.js              ⭐ seed test catalog, transcribed from your price list
│   ├── utils/format.js            Currency / date formatting helpers
│   ├── App.jsx                    Routes
│   └── main.jsx                   Entry point
├── package.json
├── vite.config.js
└── README.md
```

---

## 2. Installation & Running

Requires [Node.js](https://nodejs.org) 18+ installed.

```bash
cd city-welfare-lab-demo
npm install
npm run dev
```

Then open:

```
http://localhost:5173
```

No database setup, no `.env` file, no cloud account needed.

---

## 3. Testing the Complete Workflow

1. Open the app — the **Dashboard** loads with 3 pre-seeded demo patients so it doesn't look empty.
2. Click **＋ Register Patient** in the sidebar (or top of Dashboard).
3. Fill in name, age, gender, phone, address, referred by → **Save & Select Tests**.
4. On the patient page, search and **+ Add** tests from the catalog — prices are added automatically.
5. Adjust **Discount** / **Paid Amount** if needed — Subtotal, Total, Remaining, and Payment Status update live.
6. Click **Save Order & Print Test Request** — this opens the printable A4 test request.
7. Click **🖶 Print Test Request** (or go to **Test Orders** / the patient page later and click **Print Request**).
8. Go to **Results** in the sidebar (or click **Enter Results** from the order) → type in Result / Unit / Reference Range / Status for each test.
9. Click **Generate Report →** — this opens the final A4 laboratory report.
10. Click **🖶 Print Report**.

Every step above is fully functional — nothing is a placeholder.

---

## 4. How to Print

Both print pages (`/print/request/:orderId` and `/print/report/:orderId`) use a dedicated
`@media print` stylesheet in `src/index.css`:

- Sidebar, header, and all app buttons are hidden when printing.
- Only the white A4 sheet (`.a4-sheet`) is shown, sized and margined for A4 paper.
- Use your browser's **Print → Save as PDF** (or a real printer) — Ctrl/Cmd+P also works
  directly on those pages.

---

## 5. How to Replace the Logo

**Option A — from the Settings page (easiest):**
Go to **Settings → Laboratory Information → Upload Logo** and pick an image file. It's
saved into `localStorage` as a data URL and used everywhere immediately (sidebar, header,
both print documents).

**Option B — replace the file directly:**
Put your high-resolution logo file into `public/logo/` (PNG with transparent background
recommended) and update `logoPath` in `src/config/labInfo.js`:

```js
logoPath: '/logo/your-new-logo.png',
```

The current `public/logo/logo.svg` is a **vector recreation** of the crescent + "WML"
mark visible in your reference form (the source photo wasn't high enough resolution to
extract cleanly as a crisp logo). `public/logo/logo-extracted.png` is the actual cropped
photo from your form, included for reference/comparison. Swap in the real master logo
file from the client as soon as it's available.

---

## 6. How to Change Laboratory Name / Address / Technologists

Two ways:

1. **In the app:** go to **Settings** → edit Laboratory Name, Subtitle, Address, Phone,
   or the two Technologist blocks → **Save Settings**. Changes apply everywhere instantly.
2. **In code (sets the default before any Settings are saved):** edit
   `src/config/labInfo.js`.

---

## 7. How to Change Test Names / Prices

Two ways:

1. **In the app:** go to **Test Catalog** → **Edit** any row to change its name, category,
   or price, or **+ Add Test** for a new one, or **Disable** to hide a discontinued test
   from selection without deleting it.
2. **In code (defines the initial seed data):** edit `src/data/tests.js`. Note that once
   the app has run once, the catalog lives in `localStorage` and takes priority over this
   file — use **Settings → Clear Demo Data** to reset back to the seed file's values.

---

## 8. Test Entries That Need Your Verification

Prices were legible with confidence for effectively the whole handwritten list. A few
**test-name abbreviations** were ambiguous and are flagged with a small **VERIFY** tag
in the Test Catalog page in the app:

| # | As written | Price | What needs confirming |
|---|---|---|---|
| 1 | **SBR D/IND** | Rs. 1,000 | Please confirm the full test name (e.g. Serum Bilirubin Direct/Indirect). |
| 2 | **SBR** | Rs. 500 | Listed directly below #1 — please confirm this is a genuinely distinct test (e.g. Total Bilirubin), not a duplicate entry. |
| 3 | **NNP** | Rs. 500 | Abbreviation was hard to read clearly — could be "NNP" or "NPP". Please confirm the intended test. |
| 4 | **TFTs** | Rs. 3,000 | Listed separately from **TSH** (Rs. 1,500) — please confirm a full Thyroid Function Tests panel is intentionally offered alongside the standalone TSH test. |

All other test names and prices (ABGs, Electrolytes, Lipid Profile, LFTs, RFTs, Calcium,
Uric Acid, RBS, Cardiac Profile, Lipase, Amylase, Urine R/E, ESR, Blood Smear, HBsAg, HCV,
HIV, PT/INR, APTT, Vitamin D, Anti‑CCP, FSH, Prolactin, AMH, Semen Analysis, Blood/Stool
H. Pylori, Blood Group, Blood Group + Cross Match) were transcribed directly from the
handwritten list with no guessing.

**Note on reference ranges:** the app deliberately does **not** pre-fill any medical
reference ranges — these must be entered by laboratory staff per-test, since ranges vary
by analyzer/method and are a clinical decision outside the scope of this demo.

---

## 9. Upgrade Path to Production

The demo was structured so the frontend does not need to be rebuilt when you move to a
real backend:

- All data access goes through `src/services/storage.js`. Replace the function bodies
  there with `fetch()` calls to a Node.js + SQLite (or other) API — every page already
  calls functions like `getPatients()`, `saveOrder()`, etc., and doesn't know or care
  whether the data comes from `localStorage` or a server.
- Add authentication by wrapping `<App />` with a login check; the "Laboratory
  Administrator" user shown in the header is currently hard-coded for the demo.
- Everything else — routing, components, print layouts, design system — carries over
  unchanged.

---

## 10. Demo Data

Three sample patients (Muhammad Ali, Fatima Bibi, Ahmad Khan) are seeded automatically on
first launch so the Dashboard isn't empty. They're marked with a **DEMO** tag in the
Patients list. Use **Settings → Clear Demo Data** to wipe everything (with a confirmation
prompt) and reseed fresh sample data.
