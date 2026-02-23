import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/Container";
import SEO from "../../components/SEO";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  getBeneficiariesReport,
  getExportFile,
  getFundUseReport,
  getReportsSummary
} from "../../services/adminReports";

const defaultFilters = {
  from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
  to: new Date().toISOString().slice(0, 10),
  program: "all"
};

function downloadFile({ filename, mimeType, content }) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function AdminReportsPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  const [fundUse, setFundUse] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const { idToken, logout } = useAdminAuth();

  const hasResults = useMemo(() => summary || fundUse.length || beneficiaries.length, [summary, fundUse, beneficiaries]);

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const loadReportData = async (activeFilters) => {
    setLoading(true);
    setError("");

    try {
      const [summaryData, fundUseData, beneficiariesData] = await Promise.all([
        getReportsSummary(activeFilters, idToken),
        getFundUseReport(activeFilters, idToken),
        getBeneficiariesReport(activeFilters, idToken)
      ]);

      setSummary(summaryData);
      setFundUse(fundUseData.rows || []);
      setBeneficiaries(beneficiariesData.rows || []);
    } catch (err) {
      setError(err.message || "Could not generate report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData(defaultFilters);
  }, []);

  const onGenerate = async () => {
    await loadReportData(filters);
  };

  const onExport = async (format) => {
    setLoading(true);
    setError("");

    try {
      const file = await getExportFile(filters, format, idToken);
      downloadFile({
        filename: file.filename || `admin-report.${format}`,
        mimeType: file.mimeType || (format === "pdf" ? "application/pdf" : "text/csv"),
        content: file.content || ""
      });
    } catch (err) {
      setError(err.message || `Could not export ${format.toUpperCase()} report.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Admin Reports" description="Generate and export admin reports." path="/admin/reports" noindex />
      <section className="section">
        <Container className="adminReports">
          <div className="adminHeaderRow">
            <div>
              <h1>Reports</h1>
              <p className="muted">Generate donation, fund-use, and beneficiary reports for authenticated users.</p>
            </div>
            <button className="btn btn--outline" onClick={logout}>Log out</button>
          </div>

          <div className="adminActions">
            <Link className="btn" to="/admin/reports">Reports</Link>
            <Link className="btn btn--outline" to="/admin/data-entry">Data entry</Link>
          </div>

          <div className="adminCard adminFilters">
            <div>
              <label htmlFor="from">From</label>
              <input id="from" className="input" type="date" value={filters.from} onChange={(e) => updateFilter("from", e.target.value)} />
            </div>
            <div>
              <label htmlFor="to">To</label>
              <input id="to" className="input" type="date" value={filters.to} onChange={(e) => updateFilter("to", e.target.value)} />
            </div>
            <div>
              <label htmlFor="program">Program</label>
              <select id="program" className="input" value={filters.program} onChange={(e) => updateFilter("program", e.target.value)}>
                <option value="all">All</option>
                <option value="direct-support">Direct support</option>
                <option value="hospital-projects">Hospital projects</option>
                <option value="outreach">Outreach</option>
                <option value="counselling">Counselling</option>
              </select>
            </div>
            <div className="adminActions">
              <button className="btn btn--primary" onClick={onGenerate} disabled={loading}>Generate</button>
              <button className="btn" onClick={() => onExport("csv")} disabled={loading || !hasResults}>Export CSV</button>
              <button className="btn btn--outline" onClick={() => onExport("pdf")} disabled={loading || !hasResults}>Export PDF</button>
            </div>
          </div>

          {error && <div className="errorText">{error}</div>}

          {!loading && !error && !hasResults && (
            <div className="adminCard">No report data yet for the selected filters. Try another date range, or add records from the Data entry page.</div>
          )}

          {summary && (
            <div className="adminGrid">
              <div className="adminCard"><strong>Total donations</strong><div>{summary.totalDonations || 0}</div></div>
              <div className="adminCard"><strong>Total spend</strong><div>{summary.totalSpend || 0}</div></div>
              <div className="adminCard"><strong>Active cases</strong><div>{summary.activeCases || 0}</div></div>
              <div className="adminCard"><strong>Beneficiaries</strong><div>{summary.beneficiaries || 0}</div></div>
            </div>
          )}

          {fundUse.length > 0 && (
            <div className="adminCard">
              <h2>Fund use breakdown</h2>
              <ul className="tList">
                {fundUse.map((row) => (
                  <li key={row.category}>{row.category}: {row.amount} ({row.percent}%)</li>
                ))}
              </ul>
            </div>
          )}

          {beneficiaries.length > 0 && (
            <div className="adminCard">
              <h2>Beneficiary activity</h2>
              <ul className="tList">
                {beneficiaries.map((row) => (
                  <li key={row.label}>{row.label}: {row.value}</li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
