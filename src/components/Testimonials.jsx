import Container from "./Container";
import { testimonials } from "../data/testimonials";

export default function Testimonials() {
  return (
    <section className="section section--soft">
      <Container>
        <div className="sectionHead">
          <h2>Real stories</h2>
          <p>Stories from children, parents, and supporters whose journeys reflect the impact of timely care and compassion.</p>
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
