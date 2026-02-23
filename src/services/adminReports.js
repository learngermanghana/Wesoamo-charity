import { buildEndpoint, buildFunctionUrl, firebaseEndpoints } from "../config/firebase";

async function callEndpoint(path, payload = {}, idToken = "") {
  let response;

  try {
    response = await fetch(buildFunctionUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {})
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    throw new Error(`Network request failed: ${error instanceof Error ? error.message : "Unknown network error"}`);
  }

  if (!response.ok) {
    const message = await response.text();
    const fallbackMessage = `Request failed (${response.status} ${response.statusText || "Unknown status"})`;
    throw new Error(message || fallbackMessage);
  }

  return response.json();
}

export function getReportsSummary(filters, idToken) {
  return callEndpoint(firebaseEndpoints.reportsSummary, filters, idToken);
}

export function getFundUseReport(filters, idToken) {
  return callEndpoint(firebaseEndpoints.reportsFundUse, filters, idToken);
}

export function getBeneficiariesReport(filters, idToken) {
  return callEndpoint(firebaseEndpoints.reportsBeneficiaries, filters, idToken);
}

export function getExportFile(filters, format, idToken) {
  return callEndpoint(firebaseEndpoints.reportsExport, { ...filters, format }, idToken);
}

export function createAdminRecord(payload, idToken) {
  return callEndpoint(firebaseEndpoints.reportsCreateRecord, payload, idToken);
}

export async function getPublicTransparencySnapshot() {
  if (!firebaseEndpoints.transparencySnapshot) {
    return null;
  }

  try {
    const response = await fetch(buildEndpoint(firebaseEndpoints.transparencySnapshot), {
      method: "GET"
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}
