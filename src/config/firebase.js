export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  region: import.meta.env.VITE_FIREBASE_REGION || "us-central1"
};

export const firebaseEndpoints = {
  base: import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL || "",
  reportsSummary: import.meta.env.VITE_FIREBASE_REPORTS_SUMMARY_PATH || "/reportsSummary",
  reportsFundUse: import.meta.env.VITE_FIREBASE_REPORTS_FUND_USE_PATH || "/reportsFundUse",
  reportsBeneficiaries: import.meta.env.VITE_FIREBASE_REPORTS_BENEFICIARIES_PATH || "/reportsBeneficiaries",
  reportsExport: import.meta.env.VITE_FIREBASE_REPORTS_EXPORT_PATH || "/reportsExport",
  reportsCreateRecord: import.meta.env.VITE_FIREBASE_REPORTS_CREATE_RECORD_PATH || "/reportsCreateRecord",
  transparencySnapshot: import.meta.env.VITE_FIREBASE_TRANSPARENCY_PATH || "/publicTransparencySnapshot"
};

export function buildEndpoint(pathOrUrl) {
  if (!pathOrUrl) {
    throw new Error("Missing endpoint env var");
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  if (!firebaseEndpoints.base) {
    throw new Error("Missing VITE_FIREBASE_FUNCTIONS_BASE_URL");
  }

  return `${firebaseEndpoints.base}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function buildFunctionUrl(pathOrUrl) {
  return buildEndpoint(pathOrUrl);
}

export function buildFirebaseAuthUrl(path) {
  if (!firebaseConfig.apiKey) {
    throw new Error("Missing VITE_FIREBASE_API_KEY");
  }

  return `https://identitytoolkit.googleapis.com/v1/${path}?key=${firebaseConfig.apiKey}`;
}
