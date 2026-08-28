# Sample Logger — Preclarus eReq Flow

A responsive web app that reproduces the **Electronic Requisition (eReq) sample-logging
flow** from the PPD Preclarus Investigator Site Portal (Central Lab Manual, FORM-05150).
It walks the user through the same sequence shown in the manual screenshots —
register a subject, pick a visit, enter demographics, scan samples — and on submit
appends the requisition to a **Google Sheet** via a Google Apps Script Web App.

Built with **React + Vite + Tailwind CSS**. No backend server to maintain — your
Google Sheet _is_ the database. Designed for **free, one-click deployment to
GitHub Pages** via `npm run deploy`.

![tech](https://img.shields.io/badge/React-18-61dafb) ![tech](https://img.shields.io/badge/Vite-6-646cff) ![tech](https://img.shields.io/badge/Tailwind-3-38bdf8)

---

## The User Flow

The interface is a **4-step wizard** inside the purple *PPD Preclarus · Investigator
Site Portal* chrome, mirroring the manual:

| Step | Screen | What happens |
|------|--------|--------------|
| **1** | **Register a New Subject** | Select the Protocol ID (`ITF - Site: 9001`), click **＋ New Subject**, and fill the **Create New Subject: Details** modal — Subject ID (8 chars), Year of Birth (YYYY), Gender. Required fields show a **red** border; "will result in a Query" fields show an **orange** border, exactly as the manual describes. |
| **2** | **Select Protocol, Subject, and Visit** | Protocol and Subject are carried forward (read-only); pick a **Visit** (`1 Screening (D -60 to -31)`, `2 Baseline`, `3 (Wk 1)`, …). |
| **3** | **Demographic and Clinical Information** | Subject banner is read-only; enter **Is Pregnancy Test Required?**, **Weight**, and unit. |
| **4** | **Enter Sample Collection Details** | Set **Collection Date & Time**, then **Enter / Scan Barcode** — each barcode populates against the next sample in the panel table (`24Hr Creatinine Clearance`, `Chemistry`, `Urinalysis`, …). A live **"_X_ of _N_ samples scanned"** counter updates, each row shows a **Scanned/Unscan** status, and **Save / Submit** posts everything to Google Sheets. |
| ✓ | **Visit Saved** | Confirmation panel echoing the manual's "Visit information has been saved successfully", with a summary and **New Visit** to start over. |

A numbered **stepper** (echoing the manual's yellow circles) tracks progress and lets
you jump back. Only **scanned** samples are submitted — one **row per sample**.

---

## Table of Contents

1. [Google Sheets Setup](#1-google-sheets-setup)
2. [App Configuration](#2-app-configuration)
3. [Local Development](#3-local-development)
4. [GitHub Pages Deployment](#4-github-pages-deployment)
5. [Project Structure](#project-structure)
6. [Troubleshooting](#troubleshooting)

---

## 1. Google Sheets Setup

You need a Google Sheet plus an Apps Script Web App that receives the requisition
and appends **one row per scanned sample**.

### Step 1 — Create the sheet

1. Go to [sheets.new](https://sheets.new) to create a new Google Sheet.
2. Rename the first tab to **`Samples`** (bottom-left tab name).
3. Add a header row in **row 1** (order matters — it must match the script):

   | A | B | C | D | E | F | G | H | I | J | K |
   |---|---|---|---|---|---|---|---|---|---|---|
   | Logged At | Protocol | Subject ID | Year of Birth | Gender | Visit | Pregnancy Test Required | Weight | Sample Name | Barcode | Collection Date |

### Step 2 — Add the Apps Script

1. In the sheet menu, go to **Extensions → Apps Script**.
2. Delete any existing code and paste the following:

```javascript
// Appends one row per scanned sample in the submitted requisition.
function doPost(e) {
  try {
    // The app sends the body as text/plain JSON to avoid a CORS preflight.
    var data = JSON.parse(e.postData.contents);

    var sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName('Samples');

    if (!sheet) {
      throw new Error('Sheet "Samples" not found. Rename your tab to "Samples".');
    }

    var loggedAt = new Date();
    var samples = data.samples || [];

    // One row per sample so each specimen is individually trackable.
    samples.forEach(function (s) {
      sheet.appendRow([
        loggedAt,                        // Logged At (server timestamp)
        data.protocol || '',
        data.subjectId || '',
        data.yearOfBirth || '',
        data.gender || '',
        data.visit || '',
        data.pregnancyTestRequired || '',
        (data.weight || '') + (data.weightUnit ? ' ' + data.weightUnit : ''),
        s.name || '',
        s.barcode || '',
        s.collectionDate || ''
      ]);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', rows: samples.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: open the /exec URL in a browser to confirm it's live.
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok', message: 'Sample Logger endpoint is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click the **Save** icon (💾).

### Step 3 — Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Configure:
   - **Description:** `Sample Logger endpoint` (anything)
   - **Execute as:** **Me** (your account)
   - **Who has access:** **Anyone** ← _important, so the public page can post_
4. Click **Deploy**.
5. **Authorize access** when prompted (your account → *Advanced* → *Go to project
   (unsafe)* → *Allow*). This warning is expected for your own script.
6. Copy the **Web app URL**:

   ```
   https://script.google.com/macros/s/AKfycb..................../exec
   ```

> **Updating the script later?** Use **Deploy → Manage deployments → Edit (pencil)
> → Version: New version → Deploy** so the same `/exec` URL keeps working.

---

## 2. App Configuration

Paste the Web App URL into **[`src/config.js`](src/config.js)**:

```javascript
export const GOOGLE_SHEETS_WEBHOOK_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL ||
  'https://script.google.com/macros/s/AKfycb..................../exec' // ← paste here
```

Or keep it out of source with an env var (see [`.env.example`](.env.example)):

```bash
# .env  (git-ignored)
VITE_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
```

The same file also lets you customize the domain lists to match your study:
`PROTOCOLS`, `VISITS`, `GENDERS`, `WEIGHT_UNITS`, and the **`SAMPLE_NAMES`** panel.

---

## 3. Local Development

**Prerequisites:** [Node.js](https://nodejs.org) 18+ and npm.

```bash
npm install       # install dependencies
npm run dev       # start dev server (hot reload) → http://localhost:5173
npm run build     # production build into ./dist
npm run preview   # preview the production build locally
```

Walk the wizard, scan a few barcodes on step 4, and click **Save / Submit** — the
scanned samples should appear as new rows in your Google Sheet, and the app advances
to the **Visit Saved** screen.

> **npm cache permission error?** If `npm install` fails with `EACCES` on
> `~/.npm`, run `sudo chown -R $(id -u):$(id -g) "$HOME/.npm"` once, then retry.

---

## 4. GitHub Pages Deployment

### Option A — `npm run deploy` (gh-pages branch)

The [`gh-pages`](https://www.npmjs.com/package/gh-pages) package and a `deploy`
script are pre-configured in `package.json`:

```bash
git init
git add .
git commit -m "Initial commit: Sample Logger eReq"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main

npm run build
npm run deploy        # pushes ./dist to the gh-pages branch
```

Then on GitHub go to **Settings → Pages → Source → Deploy from a branch**, choose
branch **`gh-pages`**, folder **`/ (root)`**. Your site goes live at:

```
https://<your-username>.github.io/<your-repo>/
```

> **Base path:** [`vite.config.js`](vite.config.js) uses `base: './'` (relative
> asset paths), so the build works under `…github.io/<repo>/` no matter the repo
> name — no edits needed.

### Option B — GitHub Actions (automatic on push)

A workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds
and deploys on every push to `main`. To use it, set **Settings → Pages → Source**
to **GitHub Actions**. (To keep the webhook URL secret, add a repo secret
`GOOGLE_SHEETS_WEBHOOK_URL` and uncomment the `env:` block in the workflow.)

---

## Project Structure

```
sample-logger/
├── .github/workflows/deploy.yml   # optional GitHub Actions → Pages
├── src/
│   ├── components/
│   │   ├── PortalChrome.jsx        # purple PPD Preclarus header + nav + sub-tabs
│   │   ├── Stepper.jsx             # numbered progress rail
│   │   ├── CreateSubjectModal.jsx  # "Create New Subject: Details" modal
│   │   ├── ui.jsx                  # Field / buttons / Callout / requirement legend
│   │   ├── Alert.jsx               # success/error/info banner
│   │   └── Spinner.jsx             # inline loading spinner
│   ├── steps/
│   │   ├── Step1Registration.jsx   # protocol + new subject
│   │   ├── Step2Visit.jsx          # protocol / subject / visit
│   │   ├── Step3Demographic.jsx    # clinical info
│   │   ├── Step4Samples.jsx        # collection date + barcode scan + sample table
│   │   └── VisitSaved.jsx          # confirmation
│   ├── App.jsx                     # wizard state machine + fetch/submit
│   ├── config.js                   # GOOGLE_SHEETS_WEBHOOK_URL + domain lists
│   ├── main.jsx
│   └── index.css                   # Tailwind directives
├── index.html
├── package.json                    # includes `deploy` (gh-pages) script
├── tailwind.config.js              # Preclarus purple/green/amber palette
├── postcss.config.js
├── vite.config.js                  # base: './'
└── README.md
```

---

## Troubleshooting

| Symptom | Likely cause & fix |
|---|---|
| **"No Google Sheets webhook configured"** banner | `GOOGLE_SHEETS_WEBHOOK_URL` is empty. Paste your `/exec` URL into `src/config.js`. |
| Submit fails with a network/CORS error | Re-deploy the Apps Script with **Who has access: Anyone**. The app sends `text/plain` on purpose to skip the CORS preflight — don't switch it to `application/json`. |
| No rows appear in the sheet | Tab must be named exactly **`Samples`**; header order must match the script. Also confirm at least one sample was **Scanned** (only scanned rows are submitted). |
| Changed the script but nothing updates | Redeploy via **Manage deployments → Edit → New version**, keeping the same URL. |
| Blank page / 404 assets on GitHub Pages | Confirm `base: './'` in `vite.config.js` and that Pages **Source** matches your method (gh-pages branch _or_ Actions). |
| `npm install` fails with `EACCES` | `sudo chown -R $(id -u):$(id -g) "$HOME/.npm"`, then retry. |

---

## Notes

- Requisition state lives in memory during the session; the permanent record is in
  your Google Sheet. **New Visit** resets the wizard.
- No credentials are stored in the app — the Apps Script runs as _you_ and only
  appends rows.
- UI, terminology, and the sample panel are modeled on the PPD Preclarus eReq
  workflow (Central Lab Manual, FORM-05150 v5.0) for demonstration purposes.
```
