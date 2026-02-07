import Container from "./Container";
import { testimonials } from "../data/testimonials";

export default function Testimonials() {
  return (
    <section className="section section--soft">
      <Container>
        <div className="sectionHead">
          <h2>Stories of strength</h2>
          <p>Replace with real stories (names/initials) when ready.</p>
        </div>

        <div className="grid3">
          {testimonials.map((t) => (
            <div className="card" key={t.name}>
              <p className="quote">“{t.quote}”</p>
              <div className="quoteBy">— {t.name}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
