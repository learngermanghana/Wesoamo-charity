# Wesoamo Foundation Site

This repository contains the public website and a Firebase-backed admin reporting flow.

## Admin reporting (Firebase)

The admin reporting flow now includes:

1. Donations summary report
2. Program spend / fund-use report
3. Beneficiary activity report
4. Protected admin route (`/admin/reports`)
5. CSV/PDF export actions
6. Public transparency page fed from backend snapshot when available

### Frontend routes

- `/admin/login`: signs in with Firebase Authentication email/password for an admin user.
- `/admin/reports`: protected reporting dashboard.

### Required frontend environment variables

Set these in `.env`:

```bash
VITE_FIREBASE_API_KEY=your-web-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_REGION=us-central1
VITE_FIREBASE_FUNCTIONS_BASE_URL=https://us-central1-your-project-id.cloudfunctions.net
VITE_FIREBASE_REPORTS_SUMMARY_PATH=/reportsSummary
VITE_FIREBASE_REPORTS_FUND_USE_PATH=/reportsFundUse
VITE_FIREBASE_REPORTS_BENEFICIARIES_PATH=/reportsBeneficiaries
VITE_FIREBASE_REPORTS_EXPORT_PATH=/reportsExport
VITE_FIREBASE_TRANSPARENCY_PATH=/publicTransparencySnapshot
```

### Firebase backend

Cloud Function handlers are scaffolded in `firebase/functions/index.js`.

Deploy from a Firebase Functions project:

```bash
cd firebase/functions
npm install
firebase deploy --only functions
```

### Local development

```bash
npm install
npm run dev
```
