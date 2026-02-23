/**
 * Firebase Cloud Functions for Admin Reporting.
 *
 * Deploy with Firebase CLI in a dedicated functions project.
 */
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

async function assertAuthenticated(request) {
  const idToken = getBearerToken(request);
  if (!idToken) {
    throw new Error("Missing bearer token");
  }

  return admin.auth().verifyIdToken(idToken);
}

function getBearerToken(request) {
  const header = request.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.substring("Bearer ".length).trim();
}

function normalizeNumber(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getActor(decodedToken) {
  return {
    uid: decodedToken.uid || "unknown",
    email: decodedToken.email || "unknown"
  };
}

async function writeAuditLog({ actor, action, targetCollection, targetId, before = null, after = null, reason = "" }) {
  await db.collection("adminAuditLogs").add({
    action,
    targetCollection,
    targetId,
    before,
    after,
    reason,
    actor,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
}

function parseFilters(request) {
  const payload = request.method === "GET" ? request.query : request.body || {};
  return {
    from: payload.from,
    to: payload.to,
    program: payload.program || "all",
    format: payload.format || "csv"
  };
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
};

function sendCors(response) {
  Object.entries(cors).forEach(([k, v]) => response.set(k, v));
}

exports.reportsSummary = onRequest(async (request, response) => {
  sendCors(response);
  if (request.method === "OPTIONS") return response.status(204).send("");
  if (!["GET", "POST"].includes(request.method)) return response.status(405).send("Method Not Allowed");
  try {
    const { from, to } = parseFilters(request);

    const donations = await db.collection("donations")
      .where("date", ">=", from)
      .where("date", "<=", to)
      .get();
    const disbursements = await db.collection("disbursements")
      .where("date", ">=", from)
      .where("date", "<=", to)
      .get();
    const cases = await db.collection("beneficiaries").where("status", "==", "active").get();

    const totalDonations = donations.docs.reduce((sum, d) => sum + Number(d.data().amount || 0), 0);
    const totalSpend = disbursements.docs.reduce((sum, d) => sum + Number(d.data().amount || 0), 0);

    return response.json({ totalDonations, totalSpend, activeCases: cases.size });
  } catch (error) {
    logger.error(error);
    return response.status(403).send(error.message);
  }
});

exports.reportsFundUse = onRequest(async (request, response) => {
  sendCors(response);
  if (request.method === "OPTIONS") return response.status(204).send("");
  if (!["GET", "POST"].includes(request.method)) return response.status(405).send("Method Not Allowed");
  try {
    const { from, to, program } = parseFilters(request);

    let q = db.collection("disbursements")
      .where("date", ">=", from)
      .where("date", "<=", to);

    if (program !== "all") q = q.where("program", "==", program);

    const rows = await q.get();
    const grouped = new Map();
    let total = 0;

    rows.forEach((doc) => {
      const data = doc.data();
      const key = data.program || "unknown";
      const amount = Number(data.amount || 0);
      grouped.set(key, (grouped.get(key) || 0) + amount);
      total += amount;
    });

    const result = Array.from(grouped.entries()).map(([category, amount]) => ({
      category,
      amount,
      percent: total ? Math.round((amount / total) * 100) : 0
    }));

    return response.json({ rows: result });
  } catch (error) {
    logger.error(error);
    return response.status(403).send(error.message);
  }
});

exports.reportsBeneficiaries = onRequest(async (request, response) => {
  sendCors(response);
  if (request.method === "OPTIONS") return response.status(204).send("");
  if (!["GET", "POST"].includes(request.method)) return response.status(405).send("Method Not Allowed");
  try {
    const { from, to } = parseFilters(request);
    const records = await db.collection("beneficiaryActivities")
      .where("date", ">=", from)
      .where("date", "<=", to)
      .get();

    const stats = { "New cases": 0, "Follow-ups": 0, Counselling: 0 };
    records.forEach((doc) => {
      const type = doc.data().type;
      if (type === "new_case") stats["New cases"] += 1;
      if (type === "follow_up") stats["Follow-ups"] += 1;
      if (type === "counselling") stats.Counselling += 1;
    });

    return response.json({ rows: Object.entries(stats).map(([label, value]) => ({ label, value })) });
  } catch (error) {
    logger.error(error);
    return response.status(403).send(error.message);
  }
});

exports.reportsExport = onRequest(async (request, response) => {
  sendCors(response);
  if (request.method === "OPTIONS") return response.status(204).send("");
  try {
    await assertAuthenticated(request);
    const filters = parseFilters(request);
    const fundUse = await db.collection("disbursements")
      .where("date", ">=", filters.from)
      .where("date", "<=", filters.to)
      .get();

    const csvRows = ["category,amount,date"];
    fundUse.forEach((d) => {
      const row = d.data();
      csvRows.push(`${row.program || "unknown"},${row.amount || 0},${row.date || ""}`);
    });

    const csv = csvRows.join("\n");
    if (filters.format === "pdf") {
      return response.json({
        filename: "admin-report.pdf",
        mimeType: "application/pdf",
        content: `Report exported as text.\n\n${csv}`
      });
    }

    return response.json({
      filename: "admin-report.csv",
      mimeType: "text/csv",
      content: csv
    });
  } catch (error) {
    logger.error(error);
    return response.status(403).send(error.message);
  }
});

exports.publicTransparencySnapshot = onRequest(async (_request, response) => {
  sendCors(response);
  const latest = await db.collection("publicReports").doc("latestTransparency").get();
  if (!latest.exists) {
    return response.status(404).json({});
  }

  return response.json(latest.data());
});

exports.reportsCreateRecord = onRequest(async (request, response) => {
  sendCors(response);
  if (request.method === "OPTIONS") return response.status(204).send("");
  if (request.method === "GET") {
    return response.json({ message: "Use POST to create records" });
  }
  if (request.method !== "POST") return response.status(405).send("Method not allowed");

  try {
    const decoded = await assertAuthenticated(request);
    const actor = getActor(decoded);
    const payload = request.body || {};

    const date = normalizeString(payload.date);
    const program = normalizeString(payload.program) || "direct-support";
    const notes = normalizeString(payload.notes);
    const changeReason = normalizeString(payload.changeReason);
    const donationAmount = normalizeNumber(payload.donationAmount);
    const spendAmount = normalizeNumber(payload.spendAmount);
    const beneficiaryCount = normalizeNumber(payload.beneficiaryCount);
    const activeCases = normalizeNumber(payload.activeCases);

    if (!date) return response.status(400).send("Missing date");
    if (!changeReason) return response.status(400).send("Missing change reason");

    const now = admin.firestore.FieldValue.serverTimestamp();
    const batch = db.batch();

    const adminRecordRef = db.collection("adminRecords").doc();
    const adminRecordData = {
      date,
      program,
      donationAmount,
      spendAmount,
      beneficiaryCount,
      activeCases,
      notes,
      changeReason,
      createdBy: actor,
      createdAt: now,
      updatedBy: actor,
      updatedAt: now
    };
    batch.set(adminRecordRef, adminRecordData);

    const donationRef = db.collection("donations").doc();
    batch.set(donationRef, {
      date,
      program,
      amount: donationAmount,
      source: "admin-data-entry",
      adminRecordId: adminRecordRef.id,
      createdBy: actor,
      createdAt: now
    });

    const disbursementRef = db.collection("disbursements").doc();
    batch.set(disbursementRef, {
      date,
      program,
      amount: spendAmount,
      source: "admin-data-entry",
      adminRecordId: adminRecordRef.id,
      createdBy: actor,
      createdAt: now
    });

    const activityRef = db.collection("beneficiaryActivities").doc();
    batch.set(activityRef, {
      date,
      program,
      type: "follow_up",
      beneficiaryCount,
      activeCases,
      source: "admin-data-entry",
      adminRecordId: adminRecordRef.id,
      createdBy: actor,
      createdAt: now
    });

    await batch.commit();

    await writeAuditLog({
      actor,
      action: "create",
      targetCollection: "adminRecords",
      targetId: adminRecordRef.id,
      after: {
        ...adminRecordData,
        createdAt: "serverTimestamp",
        updatedAt: "serverTimestamp"
      },
      reason: changeReason
    });

    return response.json({ ok: true, id: adminRecordRef.id });
  } catch (error) {
    logger.error(error);
    return response.status(403).send(error.message);
  }
});
