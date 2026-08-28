# Sample Logger

A lightweight, responsive web app for logging laboratory samples. Every submission
is appended as a new row in a **Google Sheet** via a Google Apps Script Web App,
and the app is designed for **free, one-click deployment to GitHub Pages**.

Built with **React + Vite + Tailwind CSS**. No backend server to maintain — your
Google Sheet _is_ the database.

![tech](https://img.shields.io/badge/React-18-61dafb) ![tech](https://img.shields.io/badge/Vite-6-646cff) ![tech](https://img.shields.io/badge/Tailwind-3-38bdf8)

---

## Features

- 📋 Form for **Sample ID, Timestamp, Sample Type, Location/Source, Tested By, Status, Notes**
- ✅ Client-side **validation** blocks submission when required fields are missing
- 📊 Clean, responsive **table** of samples logged in the current session
- ☁️ **Google Sheets sync** on every submission (async `fetch` POST)
- ⏳ Full **UI state handling**: disabled button + spinner while sending, success/error banners
- 🚀 Pre-configured for **GitHub Pages** (relative `base` path + GitHub Actions workflow)

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

You need a Google Sheet plus an Apps Script Web App that receives POST requests
and appends rows.

### Step 1 — Create the sheet

1. Go to [sheets.new](https://sheets.new) to create a new Google Sheet.
2. Rename the first tab to **`Samples`** (bottom-left tab name).
3. Add a header row in **row 1** with these column names (order matters — it must
   match the script below):

   | A | B | C | D | E | F | G | H |
   |---|---|---|---|---|---|---|---|
   | Logged At | Sample ID | Timestamp | Sample Type | Location/Source | Tested By | Status | Notes |

### Step 2 — Add the Apps Script

1. In the sheet menu, go to **Extensions → Apps Script**.
2. Delete any existing code and paste the following:

```javascript
// Appends one row per POST request to the "Samples" sheet.
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

    sheet.appendRow([
      new Date(),            // Logged At (server timestamp)
      data.sampleId || '',
      data.timestamp || '',
      data.sampleType || '',
      data.location || '',
      data.testedBy || '',
      data.status || '',
      data.notes || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: lets you open the /exec URL in a browser to confirm it's live.
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
5. **Authorize access** when prompted (choose your account → *Advanced* →
   *Go to project (unsafe)* → *Allow*). This warning is expected for your own script.
6. Copy the **Web app URL**. It looks like:

   ```
   https://script.google.com/macros/s/AKfycb..................../exec
   ```

> **Updating the script later?** Use **Deploy → Manage deployments → Edit (pencil)
> → Version: New version → Deploy** so the same `/exec` URL keeps working.

---

## 2. App Configuration

Paste the Web App URL from above into **[`src/config.js`](src/config.js)**:

```javascript
export const GOOGLE_SHEETS_WEBHOOK_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL ||
  'https://script.google.com/macros/s/AKfycb..................../exec' // ← paste here
```

Or, to keep the URL out of source, set it via an environment variable
(see [`.env.example`](.env.example)):

```bash
# .env  (git-ignored)
VITE_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
```

You can also customize the dropdown options (`SAMPLE_TYPES`, `STATUS_OPTIONS`) in
the same file.

---

## 3. Local Development

**Prerequisites:** [Node.js](https://nodejs.org) 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (hot reload)
npm run dev
# → open the printed URL, usually http://localhost:5173

# 3. Build a production bundle
npm run build

# 4. Preview the production build locally
npm run preview
```

Fill out the form and submit — a new row should appear in your Google Sheet, and
the entry shows up in the session table with a success banner.

---

## 4. GitHub Pages Deployment

Two ways to publish. **Option A (GitHub Actions)** is the recommended 1-click path.

### Option A — GitHub Actions (recommended)

The repo already includes [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds and deploys on every push to `main`.

1. **Create a GitHub repo** and push this project:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Sample Logger"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. On GitHub, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. That's it. Push (or re-run the workflow from the **Actions** tab) and, once the
   job finishes, your site is live at:

   ```
   https://<your-username>.github.io/<your-repo>/
   ```

> The workflow needs Pages permissions, which are already declared in the YAML.
> The first run may take a minute or two.

> **Keeping the webhook secret?** Add it under **Settings → Secrets and variables →
> Actions → New repository secret** named `GOOGLE_SHEETS_WEBHOOK_URL`, then
> uncomment the `env:` block in the workflow's **Build** step.

### Option B — `gh-pages` branch (manual)

A `deploy` script using the [`gh-pages`](https://www.npmjs.com/package/gh-pages)
package is included in `package.json`:

```bash
npm install          # installs gh-pages (a devDependency)
npm run build
npm run deploy       # pushes ./dist to the gh-pages branch
```

Then set **Settings → Pages → Source** to **Deploy from a branch**, branch
**`gh-pages`**, folder **`/ (root)`**.

> **Base path:** [`vite.config.js`](vite.config.js) uses `base: './'` (relative
> paths), so the build works under `https://<user>.github.io/<repo>/` without
> knowing the repo name. If you deploy to a custom domain or the repo root, you can
> change it to `'/'`.

---

## Project Structure

```
sample-logger/
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions → GitHub Pages
├── public/                    # static assets (served as-is)
├── src/
│   ├── components/
│   │   ├── Alert.jsx          # success/error/info banner
│   │   ├── Spinner.jsx        # inline loading spinner
│   │   ├── SampleForm.jsx     # form + validation
│   │   └── SampleTable.jsx    # session data table
│   ├── App.jsx                # layout + fetch/submit logic
│   ├── config.js              # GOOGLE_SHEETS_WEBHOOK_URL + dropdown options
│   ├── main.jsx               # React entry point
│   └── index.css              # Tailwind directives
├── .env.example               # sample env var file
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Troubleshooting

| Symptom | Likely cause & fix |
|---|---|
| **"No Google Sheets webhook configured"** banner | `GOOGLE_SHEETS_WEBHOOK_URL` is empty. Paste your `/exec` URL into `src/config.js`. |
| Submission fails with a network/CORS error | Re-deploy the Apps Script with **Who has access: Anyone**. The app sends `text/plain` on purpose to avoid a CORS preflight — don't change it to `application/json`. |
| Rows not appearing in the sheet | Make sure the tab is named exactly **`Samples`** and the header order matches the script. |
| Changed the script but nothing updates | Redeploy via **Manage deployments → Edit → New version**, keeping the same URL. |
| Blank page / 404 assets on GitHub Pages | Confirm `base: './'` in `vite.config.js` and that Pages **Source** is set correctly (GitHub Actions _or_ `gh-pages` branch). |
| Site not updating after push | Check the **Actions** tab for a failed run; re-run if needed. |

---

## Notes

- The session table is **in-memory only** — refreshing the page clears it. The
  permanent record lives in your Google Sheet.
- No credentials are stored in the app; the Apps Script runs as _you_ and only
  appends rows.
- Inspired by the eReq sample-registration workflow in the PPD Preclarus
  Investigator Site Portal.
