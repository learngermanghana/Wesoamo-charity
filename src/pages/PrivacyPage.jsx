import SEO from "../components/SEO";
import Container from "../components/Container";
import { org } from "../data/org";

export default function PrivacyPage() {
  return (
    <>
      <SEO title="Privacy Policy" description="How Wesoamo Child Cancer Foundation handles personal information." path="/privacy" />
      <section className="pageHead"><Container><h1>Privacy Policy</h1><p className="muted">Effective date: May 17, 2026</p></Container></section>
      <section className="section"><Container><div className="card card--wide">
        <p className="muted">{org.name} collects the information you provide on donation, volunteer, and support forms to process requests, coordinate care, and communicate updates.</p>
        <ul>
          <li>We collect contact details and form responses you submit.</li>
          <li>Form data is processed through Sedifex integrations used by our team.</li>
          <li>We use your information only for support operations, follow-up, and transparency reporting.</li>
          <li>We do not sell personal information.</li>
          <li>You can request updates or deletion requests by emailing {org.email}.</li>
        </ul>
      </div></Container></section>
    </>
  );
}
