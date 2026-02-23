import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/Container";
import SEO from "../../components/SEO";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { createAdminRecord } from "../../services/adminReports";

const initialForm = {
  date: new Date().toISOString().slice(0, 10),
  program: "direct-support",
  donationAmount: "",
  spendAmount: "",
  beneficiaryCount: "",
  activeCases: "",
  notes: "",
  changeReason: ""
};

export default function AdminDataEntryPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { idToken, logout } = useAdminAuth();

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        date: form.date,
        program: form.program,
        donationAmount: Number(form.donationAmount || 0),
        spendAmount: Number(form.spendAmount || 0),
        beneficiaryCount: Number(form.beneficiaryCount || 0),
        activeCases: Number(form.activeCases || 0),
        notes: form.notes.trim(),
        changeReason: form.changeReason.trim()
      };

      await createAdminRecord(payload, idToken);
      setSuccess("Record saved successfully.");
      setForm((prev) => ({ ...initialForm, date: prev.date, program: prev.program }));
    } catch (err) {
      setError(err.message || "Could not save record.");
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
              <label htmlFor="entry-reason">Reason for change</label>
              <input id="entry-reason" className="input" type="text" value={form.changeReason} onChange={(e) => updateField("changeReason", e.target.value)} placeholder="Why this record is being added" required />
            </div>
            <div className="adminEntryForm__notes">
              <label htmlFor="entry-notes">Notes</label>
              <textarea id="entry-notes" className="input" rows="4" value={form.notes} onChange={(e) => updateField("notes", e.target.value)} placeholder="Optional context for this record" />
            </div>
            <div className="adminActions">
              <button className="btn btn--primary" type="submit" disabled={loading}>{loading ? "Saving..." : "Save record"}</button>
            </div>
          </form>

          {error && <div className="errorText">{error}</div>}
          {success && <div className="successText">{success}</div>}
        </Container>
      </section>
    </>
  );
}
