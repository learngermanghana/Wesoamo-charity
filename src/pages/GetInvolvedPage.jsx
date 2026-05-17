import SEO from "../components/SEO";
import Container from "../components/Container";
import { org } from "../data/org";

export default function GetInvolvedPage() {
  return (
    <>
      <SEO title="Get Involved" path="/get-involved" />
      <section className="pageHead">
        <Container>
          <h1>Get involved</h1>
          <p className="muted">
            Donate, volunteer, or partner to support children battling cancer in {org.region}.
          </p>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div id="donate" className="card card--wide">
            <h2>Donate with Sedifex</h2>
            <p className="muted">
              Use the full donor page to enter your details, choose amount, and complete payment securely. Donations help fund treatment, transportation for early diagnosis, welfare needs, emergency assistance, and counselling support for families.
            </p>

            <div className="note">
              <strong>Preferred option:</strong> Open the donor page below and complete your donation form directly.
            </div>

            <div className="btnRow" style={{ marginTop: ".8rem" }}>
              <a className="btn btn--primary" href={org.donateUrl} target="_blank" rel="noreferrer">
                Open donor page
              </a>
              <a className="btn btn--outline" href={org.volunteerFormUrl}>
                Go to volunteer form
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
