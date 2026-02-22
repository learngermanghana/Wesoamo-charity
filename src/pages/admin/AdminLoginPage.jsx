import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import SEO from "../../components/SEO";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { signInAdminWithPassword } from "../../services/firebaseAuth";


function formatLoginError(message) {
  if (!message) return "Could not sign in.";

  if (message.includes("INVALID LOGIN CREDENTIALS")) {
    return "Invalid email or password.";
  }

  if (message.includes("TOO MANY ATTEMPTS TRY LATER")) {
    return "Too many login attempts. Please try again later.";
  }

  return message;
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAdmin, saveSession } = useAdminAuth();
  const navigate = useNavigate();

  if (isAdmin) {
    return <Navigate to="/admin/reports" replace />;
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const session = await signInAdminWithPassword(email.trim(), password);
      saveSession(session);
      navigate("/admin/reports");
    } catch (err) {
      setError(formatLoginError(err.message));
    } finally {
      setLoading(false);
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
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Enter admin panel"}
            </button>
          </form>
        </Container>
      </section>
    </>
  );
}
