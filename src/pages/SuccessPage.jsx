import SEO from "../components/SEO";
import Container from "../components/Container";

const copy = {
  donation: {
    title: "Donation received",
    heading: "Thank you for supporting Wesoamo Child Cancer Foundation.",
    message:
      "Your donor and donation record has been sent to Sedifex. If you completed payment, the payment confirmation will be matched after checkout verification.",
    primaryHref: "/get-involved",
    primaryLabel: "Donate again",
  },
  request: {
    title: "Support request sent",
    heading: "Your request has been received.",
    message:
      "Your support request has been saved in Sedifex for Wesoamo Child Cancer Foundation to review and follow up.",
    primaryHref: "/request-support",
    primaryLabel: "Submit another request",
  },
  volunteer: {
    title: "Volunteer application sent",
    heading: "Thank you for volunteering with us.",
    message:
      "Your volunteer application has been saved in Sedifex. The Wesoamo team will review it and contact you with next steps.",
    primaryHref: "/volunteer",
    primaryLabel: "Submit another application",
  },
};

export default function SuccessPage({ kind = "donation" }) {
  const page = copy[kind] || copy.donation;

  return (
    <>
      <SEO title={page.title} path={kind === "donation" ? "/donation-success" : `/${kind}-success`} />
      <section className="pageHead">
        <Container>
          <h1>{page.heading}</h1>
          <p className="muted">{page.message}</p>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="card" style={{ maxWidth: 760, margin: "0 auto" }}>
            <h3 className="card__title">Saved for follow-up</h3>
            <p className="muted">
              Sedifex keeps the record organised so the foundation can track follow-up, reporting, and communication.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".8rem", marginTop: "1.2rem" }}>
              <a className="btn" href={page.primaryHref}>{page.primaryLabel}</a>
              <a className="btn btn--ghost" href="/">Return home</a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
