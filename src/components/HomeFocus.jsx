import Container from "./Container";
import { Link } from "react-router-dom";

const focus = [
  {
    title: "Create Awareness",
    text: "Help more families recognize early signs and seek timely medical care.",
    cta: "Support awareness →",
    to: "/programs"
  },
  {
    title: "Support Treatment Journeys",
    text: "Contribute to welfare and urgent needs for children in treatment.",
    cta: "Donate to welfare →",
    to: "/get-involved#donate"
  },
  {
    title: "Stand with Parents",
    text: "Provide counselling and emotional support for parents facing difficult diagnoses.",
    cta: "Support counselling →",
    to: "/get-involved#donate"
  }
];

export default function HomeFocus() {
  return (
    <section className="section">
      <Container>
        <div className="sectionHead">
          <h2>How you can help today</h2>
          <p>Small actions create big comfort—choose a way to support children and families.</p>
        </div>

        <div className="grid3">
          {focus.map((f) => (
            <div key={f.title} className="card">
              <h3>{f.title}</h3>
              <p className="muted">{f.text}</p>
              <Link className="textLink" to={f.to}>{f.cta}</Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
