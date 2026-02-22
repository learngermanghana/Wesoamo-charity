import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/Container";
import SEO from "../../components/SEO";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  createAdminRecord,
  deleteAdminRecord,
  getRecentAdminRecords,
  updateAdminRecord
} from "../../services/adminReports";

const initialForm = {
  date: new Date().toISOString().slice(0, 10),
  program: "direct-support",
  donationAmount: "",
  spendAmount: "",
  beneficiaryCount: "",
  activeCases: "",
  notes: ""
};

function normalizeNumericForm(payload) {
  return {
    ...payload,
    donationAmount: Number(payload.donationAmount || 0),
    spendAmount: Number(payload.spendAmount || 0),
    beneficiaryCount: Number(payload.beneficiaryCount || 0),
    activeCases: Number(payload.activeCases || 0),
    notes: (payload.notes || "").trim()
  };
}

export default function AdminDataEntryPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [editingRecordId, setEditingRecordId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { idToken, logout } = useAdminAuth();

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const loadRecords = async () => {
    setRecordsLoading(true);

    try {
      const response = await getRecentAdminRecords(20, idToken);
      setRecords(response?.rows || response?.records || []);
    } catch {
      setRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const resetForm = () => {
    setForm((prev) => ({ ...initialForm, date: prev.date, program: prev.program }));
    setEditingRecordId("");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = normalizeNumericForm(form);

      if (editingRecordId) {
        await updateAdminRecord(editingRecordId, payload, idToken);
        setSuccess("Record updated successfully.");
      } else {
        await createAdminRecord(payload, idToken);
        setSuccess("Record saved successfully.");
      }

      resetForm();
      await loadRecords();
    } catch (err) {
      setError(err.message || "Could not save record.");
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (row) => {
    setEditingRecordId(row.id || row.recordId || "");
    setForm({
      date: row.date || initialForm.date,
      program: row.program || "direct-support",
      donationAmount: String(row.donationAmount ?? row.totalDonations ?? ""),
      spendAmount: String(row.spendAmount ?? row.totalSpend ?? ""),
      beneficiaryCount: String(row.beneficiaryCount ?? row.beneficiaries ?? ""),
      activeCases: String(row.activeCases ?? ""),
      notes: row.notes || ""
    });
    setSuccess("");
    setError("");
  };

  const onDelete = async (row) => {
    const recordId = row.id || row.recordId;
    if (!recordId) {
      setError("This record cannot be deleted because it has no id.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await deleteAdminRecord(recordId, idToken);
      setSuccess("Record deleted.");
      await loadRecords();
    } catch (err) {
      setError(err.message || "Could not delete record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Admin Data Entry" description="Enter reporting data for the admin dashboard." path="/admin/data-entry" noindex />
      <section className="section">
        <Container className="adminReports">
          <div className="adminHeaderRow">
            <div>
              <h1>Data entry</h1>
              <p className="muted">Save donation, spend, and beneficiary records for reports (authenticated users).</p>
            </div>
            <button className="btn btn--outline" onClick={logout}>Log out</button>
          </div>

          <div className="adminActions">
            <Link className="btn btn--outline" to="/admin/reports">Go to reports</Link>
            <Link className="btn" to="/admin/data-entry">Data entry</Link>
          </div>

          <form className="adminCard adminEntryForm" onSubmit={onSubmit}>
            <div>
              <label htmlFor="entry-date">Date</label>
              <input id="entry-date" className="input" type="date" value={form.date} onChange={(e) => updateField("date", e.target.value)} required />
            </div>
            <div>
              <label htmlFor="entry-program">Program</label>
              <select id="entry-program" className="input" value={form.program} onChange={(e) => updateField("program", e.target.value)}>
                <option value="direct-support">Direct support</option>
                <option value="hospital-projects">Hospital projects</option>
                <option value="outreach">Outreach</option>
                <option value="counselling">Counselling</option>
              </select>
            </div>
            <div>
              <label htmlFor="entry-donation">Donation amount</label>
              <input id="entry-donation" className="input" type="number" min="0" step="0.01" value={form.donationAmount} onChange={(e) => updateField("donationAmount", e.target.value)} placeholder="0.00" required />
            </div>
            <div>
              <label htmlFor="entry-spend">Spend amount</label>
              <input id="entry-spend" className="input" type="number" min="0" step="0.01" value={form.spendAmount} onChange={(e) => updateField("spendAmount", e.target.value)} placeholder="0.00" required />
            </div>
            <div>
              <label htmlFor="entry-beneficiaries">Beneficiaries reached</label>
              <input id="entry-beneficiaries" className="input" type="number" min="0" step="1" value={form.beneficiaryCount} onChange={(e) => updateField("beneficiaryCount", e.target.value)} placeholder="0" required />
            </div>
            <div>
              <label htmlFor="entry-active">Active cases</label>
              <input id="entry-active" className="input" type="number" min="0" step="1" value={form.activeCases} onChange={(e) => updateField("activeCases", e.target.value)} placeholder="0" required />
            </div>
            <div className="adminEntryForm__notes">
              <label htmlFor="entry-notes">Notes</label>
              <textarea id="entry-notes" className="input" rows="4" value={form.notes} onChange={(e) => updateField("notes", e.target.value)} placeholder="Optional context for this record" />
            </div>
            <div className="adminActions">
              <button className="btn btn--primary" type="submit" disabled={loading}>{loading ? "Saving..." : editingRecordId ? "Update record" : "Save record"}</button>
              {editingRecordId && (
                <button className="btn btn--outline" type="button" onClick={resetForm} disabled={loading}>Cancel edit</button>
              )}
            </div>
          </form>

          {error && <div className="errorText">{error}</div>}
          {success && <div className="successText">{success}</div>}

          <div className="adminCard">
            <h2>Recent records</h2>
            {recordsLoading ? (
              <p className="muted">Loading recent records...</p>
            ) : records.length === 0 ? (
              <p className="muted">No records found yet.</p>
            ) : (
              <div className="adminTableWrap">
                <table className="adminTable">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Program</th>
                      <th>Donation</th>
                      <th>Spend</th>
                      <th>Beneficiaries</th>
                      <th>Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((row) => (
                      <tr key={row.id || row.recordId || `${row.date}-${row.program}`}>
                        <td>{row.date || "-"}</td>
                        <td>{row.program || "-"}</td>
                        <td>{row.donationAmount ?? row.totalDonations ?? 0}</td>
                        <td>{row.spendAmount ?? row.totalSpend ?? 0}</td>
                        <td>{row.beneficiaryCount ?? row.beneficiaries ?? 0}</td>
                        <td>{row.activeCases ?? 0}</td>
                        <td>
                          <div className="adminActions">
                            <button className="btn btn--outline btn--small" type="button" onClick={() => onEdit(row)} disabled={loading}>Edit</button>
                            <button className="btn btn--small" type="button" onClick={() => onDelete(row)} disabled={loading}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
