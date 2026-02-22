import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import SEO from "../../components/SEO";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminLoginPage() {
  const [tokenInput, setTokenInput] = useState("");
  const [error, setError] = useState("");
  const { isAdmin, saveToken } = useAdminAuth();
  const navigate = useNavigate();

  if (isAdmin) {
    return <Navigate to="/admin/reports" replace />;
  }

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");

    try {
      saveToken(tokenInput.trim());
      navigate("/admin/reports");
    } catch {
      setError("Invalid Firebase ID token. Please use an admin account token.");
    }
  };

  return (
    <>
      <SEO title="Admin Login" description="Secure admin access for reporting." path="/admin/login" noindex />
      <section className="section">
        <Container className="adminAuth">
          <h1>Admin login</h1>
          <p className="muted">Paste a Firebase Auth ID token with admin claim to access reports.</p>

          <form className="adminCard" onSubmit={onSubmit}>
            <label htmlFor="idToken">Firebase ID token</label>
            <textarea
              id="idToken"
              className="input"
              rows={7}
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="eyJhbGciOiJSUzI1NiIsImtpZCI6..."
              required
            />
            {error && <div className="errorText">{error}</div>}
            <button className="btn btn--primary" type="submit">Enter admin panel</button>
          </form>
        </Container>
      </section>
    </>
  );
}
