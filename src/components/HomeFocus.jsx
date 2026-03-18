import Container from "./Container";
import { Link } from "react-router-dom";

const focus = [
  {
    title: "Create Awareness",
    text: "Help more families recognize early signs and seek timely medical care.",
    cta: "Donate →",
    to: "/get-involved#donate"
  },
  {
    title: "Support Treatment Journeys",
    text: "Adopt a child's treatment by helping to pay for surgery, chemotherapy, or radiation, and contribute to welfare needs throughout care.",
    cta: "Donate →",
    to: "/get-involved#donate"
  },
  {
    title: "Stand with Parents",
    text: "Provide counselling and emotional support for parents facing difficult diagnoses, caring for a child on palliative care, or grieving the loss of a child.",
    cta: "Donate →",
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
