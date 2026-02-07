import Container from "./Container";
import { programs } from "../data/programs";

export default function Programs() {
  return (
    <section className="section section--soft">
      <Container>
        <div className="sectionHead">
          <h2>Our programs</h2>
          <p>We support children and families through practical help, emotional care, and hospital-based projects.</p>
        </div>

        <div className="grid2">
          {programs.map((p) => (
            <div key={p.title} className="card card--program">
              <h3>{p.title}</h3>
              <p className="muted">{p.blurb}</p>
              <ul className="bullets">
                {p.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
