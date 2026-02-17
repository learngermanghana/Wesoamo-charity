import SEO from "../components/SEO";
import Container from "../components/Container";
import { org } from "../data/org";

export default function GetInvolvedPage() {
  const waDonate =
    "https://wa.me/" +
    org.whatsapp +
    "?text=" +
    encodeURIComponent(
      "Hello " + org.name + ", I want to donate. Please share donation details / options."
    );

  const waVolunteer =
    "https://wa.me/" +
    org.whatsapp +
    "?text=" +
    encodeURIComponent(
      "Hello " + org.name + ", I want to volunteer. Please share how to join and the next steps."
    );

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
            <h2>Donate</h2>
            <p className="muted">
              Donations help with welfare needs, urgent support, counselling activities, and hospital child
              welfare projects.
            </p>

            <div className="note">
              <strong>Need donation options?</strong> WhatsApp us for MoMo / other available channels.
            </div>

            <div className="btnRow" style={{ marginTop: ".8rem" }}>
              <a className="btn btn--primary" href={waDonate} target="_blank" rel="noreferrer">
                Donate via WhatsApp
              </a>
              <a className="btn btn--outline" href={org.facebook} target="_blank" rel="noreferrer">
                Message on Facebook
              </a>
            </div>
          </div>

          <div id="volunteer" className="card card--wide" style={{ marginTop: "1rem" }}>
            <h2>Volunteer</h2>
            <p className="muted">
              Volunteers help with awareness outreach, fundraising, hospital projects, administration, and communications.
            </p>

            <div className="note">
              <strong>Volunteer areas:</strong> outreach • fundraising • hospital projects • admin • media
            </div>

            <div className="btnRow" style={{ marginTop: ".8rem" }}>
              <a className="btn btn--primary" href={waVolunteer} target="_blank" rel="noreferrer">
                Volunteer via WhatsApp
              </a>
              <a className="btn btn--outline" href={"tel:" + org.phoneE164}>
                Call us
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
