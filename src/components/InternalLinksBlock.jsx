import { Link } from "react-router-dom";
import Container from "./Container";

export default function InternalLinksBlock({
  title = "Explore related resources",
  subtitle = "Move between support requests, practical help options, and our latest stories.",
  links = []
}) {
  if (!links.length) {
    return null;
  }

  return (
    <section className="section section--soft">
      <Container>
        <div className="sectionHead">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <div className="grid3">
          {links.map((item) => (
            <article key={item.href} className="card">
              <h3>{item.label}</h3>
              <p className="muted">{item.description}</p>
              <Link className="textLink" to={item.href}>
                Visit page →
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
