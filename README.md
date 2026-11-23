# 🌱 The 60-Second Eco-Audit Web Application
### *Spot it. Prioritise it. Solve it.*

A purpose-built, high-impact web application designed to transform school, campus, and community eco-audits into rapid, engaging 60-second micro-interventions. Directly inspired by the official **"THE 60-SECOND ECO-AUDIT"** methodology.

---

## ✨ Features & Highlights

### 🍃 Distraction-Free Participant Experience (`/`)
- **Herbarium Warm Linen & Dried Sage Aesthetic**: Organic, calming palette (`#fdfbf7` linen canvas, `#4a6741` sage accents, soft botanical borders).
- **Sequential 4-Stage Protocol**:
  1. **Phase 1: Spot It (Observation)** — 60-second focused observation timer to spot active energy, water, or resource waste.
  2. **Phase 2: Prioritise It** — Select the highest-leverage issue with structured reasoning.
  3. **Phase 3: Solve It** — Formulate a concrete, practical first action with an actionable timeline horizon (< 24 hrs, 1–2 days, 1 week, 1 month).
  4. **Phase 4: Action Pledge & Eco-Champion Certificate** — Personalized digital certificate with celebratory confetti.
- **Bilingual by Design**: Seamless real-time switching between **🇺🇿 O'zbekcha** and **🇬🇧 English**.
- **Instant QR Code Prefilling**: When scanning location QR codes, the venue category and specific spot are auto-filled without requiring any manual typing.

### 🛡️ Facilitator Station & Control Center (`/admin`)
- **Live Remote Network Synchronization**: Submissions from any smartphone on Wi-Fi or across the internet stream live to the admin table via `/api/submissions` with automatic 4-second polling.
- **Specific Venue & Spot QR Generator**: Facilitators can select or create custom venue zones (Classroom, Cafeteria, Science Lab, Restrooms, Library, Grounds) and print spot-specific QR stickers (e.g. *Radiator Valve #3*, *Sink #2*).
- **In-App Question & Instruction Editor**: Customize questions, prompts, and guidance for all 4 phases in both Uzbek and English with instant live preview.
- **Facilitator Answer Key**: Master reference guide for official waste categories, environmental impacts, and practical fixes.
- **Stand Poster Generator**: Printable A4 stand posters with QR codes for campus eco-stations.
- **Export to CSV & Webhook Integrations**: Instant spreadsheet download with participant names, specific spots, priorities, and action pledges. Also supports Google Sheets webhooks and Formspree/Web3Forms email dispatch.

---

## 🚀 One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshack-dev-j%2Feco-audit-app)

This repository is pre-configured for instant deployment on [Vercel](https://vercel.com):

1. Click the **Deploy** button above or go to [vercel.com/new](https://vercel.com/new).
2. Select and import **`shack-dev-j/eco-audit-app`**.
3. Leave default settings (Framework Preset: **Vite**, Build Command: `vite build`, Output Directory: `dist`).
4. Configure these server-side environment variables, then click **Deploy**.

| Variable | Value |
| --- | --- |
| `GIST_ID` | ID of the private (secret) Gist used for shared submissions. Use the existing Gist ID to keep stored responses. |
| `GIST_TOKEN` | GitHub token with permission to edit that Gist. |
| `ADMIN_CLEAR_KEY` | A secret you choose and enter when confirming Clear on the deployed admin page. |

The deployment reads and writes `submissions.json` in the configured Gist. For a new Gist, initialize that file with `[]`. On a LAN, all devices should open the same Vite server. That server uses its own `data/submissions.json`.

Vercel will build the frontend into `dist/` and automatically deploy `/api/submissions` as a serverless endpoint.
Any new commit pushed to the `main` branch will automatically trigger a production redeployment.

---

## 💻 Local Development & LAN Testing

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Dev Server with Network Access
```bash
npm run dev -- --host 0.0.0.0 --port 5173
```
- Open participant survey on desktop: `http://localhost:5173/`
- Open on mobile phones over local Wi-Fi: `http://<YOUR_LAN_IP>:5173/`
- Open Facilitator Station: `http://localhost:5173/admin`

### 3. Run Automated Tests
```bash
npm test
```
All 64 Vitest automated test suites verify accessibility, approval gates, QR prefill, bilingual switching, and remote synchronization.

### 4. Build for Production
```bash
npm run build
```

---

## 📂 Project Architecture

```
├── api/
│   └── submissions.js           # Vercel Serverless Function for shared remote sync
├── data/
│   └── submissions.json         # Local dev storage for remote submissions
├── src/
│   ├── components/              # Bespoke UI cards, modals, certificates & QR generators
│   │   ├── AdminQrCampaignGenerator.jsx  # QR spot stickers generator
│   │   ├── AdminQuestionEditor.jsx       # Bilingual prompt editor
│   │   ├── BespokeActionCard.jsx
│   │   ├── PledgeCertificate.jsx
│   │   └── StandPosterModal.jsx
│   ├── pages/
│   │   ├── AdminPage.jsx        # Facilitator Station (/admin) with live sync
│   │   └── UserSurveyPage.jsx   # Participant survey (locked Warm Linen Herbarium theme)
│   ├── services/
│   │   ├── localization.js      # Full Uzbek & English bilingual dictionaries
│   │   ├── questionSettingsService.js # Dynamic question configuration
│   │   ├── soundEffects.js      # Nature soundscapes & ambient audio
│   │   └── submissionService.js # Multi-tier remote API + localStorage sync
│   └── test/                    # 64 Vitest unit & integration test suites
├── vercel.json                  # SPA routing configuration with /api exclusion
└── vite.config.js               # Dev server with embedded /api/submissions middleware
```

---

## 📄 License
MIT License. Built with ❤️ for schools, campuses, and communities striving for environmental stewardship.
