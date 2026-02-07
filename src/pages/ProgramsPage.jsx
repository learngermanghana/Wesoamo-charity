import SEO from "../components/SEO";
import Container from "../components/Container";
import Programs from "../components/Programs";

export default function ProgramsPage() {
  return (
    <>
      <SEO title="Programs" path="/programs" />
      <section className="pageHead">
        <Container>
          <h1>Programs</h1>
          <p className="muted">Our programs are designed to support children in treatment and strengthen families.</p>
        </Container>
      </section>
      <Programs />
    </>
  );
}
