import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import SEO from "../../components/SEO";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { sendPasswordResetEmail, signInAdminWithPassword } from "../../services/firebaseAuth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const { isAdmin, saveSession } = useAdminAuth();
  const navigate = useNavigate();

  if (isAdmin) {
    return <Navigate to="/admin/reports" replace />;
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResetMessage("");
    setLoading(true);

    try {
      const session = await signInAdminWithPassword(email.trim(), password);
      saveSession(session);
      navigate("/admin/reports");
    } catch (err) {
      setError(err.message || "Could not sign in.");
    } finally {
      setLoading(false);
    }
  };


  const onPasswordReset = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Enter your email first to reset your password.");
      setResetMessage("");
      return;
    }

    setError("");
    setResetMessage("");
    setIsResetting(true);

    try {
      await sendPasswordResetEmail(trimmedEmail);
      setResetMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(err.message || "Could not send password reset email.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login" description="Secure admin access for reporting." path="/admin/login" noindex />
      <section className="section">
        <Container className="adminAuth">
          <h1>Admin login</h1>
          <p className="muted">Sign in with your Firebase admin account email and password.</p>

          <form className="adminCard" onSubmit={onSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && <div className="errorText">{error}</div>}
            {resetMessage && <div className="successText">{resetMessage}</div>}
            <div className="adminActions">
              <button className="btn btn--primary" type="submit" disabled={loading || isResetting}>
                {loading ? "Signing in..." : "Enter admin panel"}
              </button>
              <button
                className="btn btn--outline"
                type="button"
                onClick={onPasswordReset}
                disabled={loading || isResetting}
              >
                {isResetting ? "Sending reset..." : "Forgot password"}
              </button>
            </div>
          </form>
        </Container>
      </section>
    </>
  );
}
