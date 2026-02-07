import Container from "./Container";
import { impact } from "../data/impact";

export default function Impact() {
  return (
    <section className="section">
      <Container>
        <div className="sectionHead">
          <h2>Impact you can feel</h2>
          <p>These are starter placeholders—replace with verified numbers as you track activities.</p>
        </div>

        <div className="stats">
          {impact.map((s) => (
            <div key={s.label} className="stat">
              <div className="stat__v">{s.value}</div>
              <div className="stat__k">{s.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
