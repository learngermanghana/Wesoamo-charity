import SEO from "../components/SEO";
import Container from "../components/Container";
import Contact from "../components/Contact";

export default function ContactPage() {
  return (
    <>
      <SEO title="Contact" path="/contact" />
      <section className="pageHead">
        <Container>
          <h1>Contact</h1>
          <p className="muted">Message us to donate, volunteer, partner, or request support.</p>
        </Container>
      </section>
      <Contact />
    </>
  );
}
