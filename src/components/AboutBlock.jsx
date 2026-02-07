import Container from "./Container";
import { org } from "../data/org";
import { Link } from "react-router-dom";

export default function AboutBlock() {
  return (
    <section className="section">
      <Container>
        <div className="twoCol">
          <div>
            <h2>About {org.name}</h2>
            <p className="muted">
              Childhood cancer affects health, school, finances, and emotional wellbeing. We exist to ensure children
              in treatment receive dignity and support, and parents are not left alone.
            </p>
            <p className="muted">
              Our work centers on awareness, welfare and financial support, counselling for parents (especially in
              difficult or terminal cases), survivor follow-up, and hospital child welfare projects.
            </p>

            <div className="btnRow">
              <Link className="btn btn--primary" to="/about">Learn more</Link>
              <Link className="btn btn--outline" to="/get-involved#donate">Donate to support</Link>
            </div>
          </div>

          <div className="card card--promise">
            <div className="promiseTitle">Our promise</div>
            <ul className="bullets">
              <li>Compassionate, child-first support</li>
              <li>Respect for privacy and dignity</li>
              <li>Transparent updates on projects</li>
              <li>Collaboration with communities and partners</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
