import SEO from "../components/SEO";
import Container from "../components/Container";
import { faq } from "../data/faq";

export default function FaqPage() {
  return (
    <>
      <SEO title="FAQs" description="Frequently asked questions about donations, volunteering, and support requests." path="/faq" />
      <section className="pageHead">
        <Container>
          <h1>Frequently asked questions</h1>
          <p className="muted">Quick answers about donating, volunteering, and support services.</p>
        </Container>
      </section>
      <section className="section">
        <Container>
          <div className="grid2">
            {faq.map((item) => (
              <article key={item.q} className="card">
                <h3>{item.q}</h3>
                <p className="muted">{item.a}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
