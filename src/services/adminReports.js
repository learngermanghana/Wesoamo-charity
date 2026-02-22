import { buildFunctionUrl, firebaseEndpoints } from "../config/firebase";

async function callEndpoint(path, payload = {}, idToken = "") {
  const response = await fetch(buildFunctionUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {})
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to fetch admin report data");
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

export function getRecentAdminRecords(limit = 20, idToken) {
  return callEndpoint(firebaseEndpoints.reportsRecentRecords, { limit }, idToken);
}

export function updateAdminRecord(recordId, payload, idToken) {
  return callEndpoint(firebaseEndpoints.reportsUpdateRecord, { recordId, ...payload }, idToken);
}

export function deleteAdminRecord(recordId, idToken) {
  return callEndpoint(firebaseEndpoints.reportsDeleteRecord, { recordId }, idToken);
}

export async function getPublicTransparencySnapshot() {
  if (!firebaseEndpoints.base) {
    return null;
  }

  try {
    const response = await fetch(buildFunctionUrl(firebaseEndpoints.transparencySnapshot), {
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
