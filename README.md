# Wesoamo Foundation Site

This repository contains the public website and a Firebase-backed admin reporting flow.

## Admin reporting (Firebase)

The admin reporting flow now includes:

1. Donations summary report
2. Program spend / fund-use report
3. Beneficiary activity report
4. Protected admin route (`/admin/reports`)
5. CSV/PDF export actions
6. Admin data-entry write endpoint (`/reportsCreateRecord`)
7. Immutable admin audit log entries (`adminAuditLogs` collection)
8. Public transparency page fed from backend snapshot when available

### Frontend routes

- `/admin/login`: signs in with Firebase Authentication email/password for a staff user (testing mode).
- `/admin/reports`: protected reporting dashboard.

Admin access currently allows any successfully authenticated Firebase email/password user (testing mode). Audit logging is still enabled for data entry actions, and data-entry writes can be temporarily allowed without a verified token in testing deployments.

### Optional: grant admin custom claims (for stricter production access later)

When you are ready to enforce stricter role-based access, Firebase custom claims must be set with the Firebase Admin SDK (not from the Firebase Console user table directly).

1. Create/download a service account key from **Project Settings → Service accounts**.
2. Export it in your shell:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
   ```
3. Install function dependencies if needed:
   ```bash
   npm install --prefix firebase/functions
   ```
4. Set admin claims by email or UID:
   ```bash
   node firebase/functions/scripts/setAdminClaim.js --email you@example.com
   # or
   node firebase/functions/scripts/setAdminClaim.js --uid <firebase-uid>
   ```
5. Have the user sign out and sign back in so they receive a fresh ID token containing the new claims.

To remove admin claims:

```bash
node firebase/functions/scripts/setAdminClaim.js --email you@example.com --remove
```


### Testing-mode write flexibility

The `reportsCreateRecord` function supports a temporary testing flag:

```bash
ALLOW_UNAUTH_ADMIN_WRITES=true
```

- Default behavior is testing-friendly (`true` unless explicitly set to `false`).
- When enabled, data-entry writes continue even if an ID token is missing/expired, and records are tagged with a testing actor.
- Set `ALLOW_UNAUTH_ADMIN_WRITES=false` to enforce strict token verification later.

### Required frontend environment variables

Set these in `.env`:

```bash
VITE_FIREBASE_API_KEY=your-web-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_REGION=us-central1
VITE_FIREBASE_FUNCTIONS_BASE_URL=
VITE_FIREBASE_REPORTS_SUMMARY_PATH=https://reportssummary-478602495522.us-central1.run.app
VITE_FIREBASE_REPORTS_FUND_USE_PATH=https://reportsfunduse-478602495522.us-central1.run.app
VITE_FIREBASE_REPORTS_BENEFICIARIES_PATH=https://reportsbeneficiaries-478602495522.us-central1.run.app
VITE_FIREBASE_REPORTS_EXPORT_PATH=https://reportsexport-478602495522.us-central1.run.app
VITE_FIREBASE_REPORTS_CREATE_RECORD_PATH=/reportsCreateRecord
VITE_FIREBASE_TRANSPARENCY_PATH=https://publictransparencysnapshot-478602495522.us-central1.run.app
```

`VITE_FIREBASE_FUNCTIONS_BASE_URL` is optional when each endpoint variable is set to a full URL (Cloud Run v2). Keep it only as a fallback for legacy v1 `base + path` setups.

> **Note:** The listed Cloud Run services do not include `reportsCreateRecord`, so admin save/create actions will fail until that backend endpoint is deployed (or the frontend is changed to use a different endpoint).

### Firebase backend

Cloud Function handlers are scaffolded in `firebase/functions/index.js`.

The repo now includes a root `firebase.json` that points Firebase CLI to `firebase/functions` as the functions source.

Deploy from the repository root:

```bash
npm install --prefix firebase/functions
firebase deploy --only functions --project <your-project-id>
firebase functions:list --project <your-project-id>
```

### Local development

```bash
npm install
npm run dev
```
