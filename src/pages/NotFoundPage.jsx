import { Link, useLocation } from "react-router-dom";
import SEO from "../components/SEO";
import Container from "../components/Container";

export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you are looking for could not be found."
        path={pathname}
        noindex
      />

      <section className="pageHead">
        <Container>
          <h1>404 — Page not found</h1>
          <p className="muted">
            Sorry, we could not find that page. It may have moved, or the link might be incorrect.
          </p>

          <div className="btnRow" style={{ marginTop: "1rem" }}>
            <Link className="btn btn--primary" to="/">
              Back to Home
            </Link>
            <Link className="btn btn--outline" to="/get-involved">
              Get Involved
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
