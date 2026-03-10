import Container from "./Container";
import { impact } from "../data/impact";

export default function Impact() {
  return (
    <section className="section">
      <Container>
        <div className="sectionHead">
          <h2>Serving with compassion across Ghana</h2>
          <p>
            We are always ready to support those in need across hospitals in Ghana. Our impact is
            countless, and we continue to serve while we work to track verified data.
          </p>
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
