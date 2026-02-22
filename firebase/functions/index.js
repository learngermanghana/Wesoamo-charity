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

async function assertAdmin(request) {
  const header = request.headers.authorization || "";
  const idToken = header.replace("Bearer ", "").trim();
  if (!idToken) {
    throw new Error("Missing bearer token");
  }

  const decoded = await admin.auth().verifyIdToken(idToken);
  if (!(decoded.admin || decoded.role === "admin")) {
    throw new Error("Forbidden");
  }

  return decoded;
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
  try {
    await assertAdmin(request);
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
  try {
    await assertAdmin(request);
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
  try {
    await assertAdmin(request);
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
    await assertAdmin(request);
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
