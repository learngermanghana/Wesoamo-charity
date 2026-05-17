import SEO from "../components/SEO";
import Container from "../components/Container";

export default function TermsPage() {
  return (
    <>
      <SEO title="Terms of Use" description="Terms for using Wesoamo Child Cancer Foundation website and forms." path="/terms" />
      <section className="pageHead"><Container><h1>Terms of Use</h1><p className="muted">Effective date: May 17, 2026</p></Container></section>
      <section className="section"><Container><div className="card card--wide">
        <ul>
          <li>Use this website for lawful and respectful purposes only.</li>
          <li>Donation, volunteer, and support forms must contain accurate information.</li>
          <li>Submitting a form does not guarantee approval or financial support.</li>
          <li>Emergency medical situations should be handled through medical emergency services and hospitals.</li>
          <li>We may update these terms as operations and legal requirements evolve.</li>
        </ul>
      </div></Container></section>
    </>
  );
}
