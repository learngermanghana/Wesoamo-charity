import { Link } from "react-router-dom";
import Container from "./Container";
import { org } from "../data/org";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container className="footer__inner">
        <div>
          <div className="footer__brand">{org.name}</div>
          <div className="footer__sub">
            Childhood cancer support • {org.region}
          </div>
          <div className="footer__tiny">© {year} {org.name}. All rights reserved.</div>
        </div>

        <div className="footer__links">
          <a href={org.donateUrl} target="_blank" rel="noreferrer">Donate</a>
          <Link to="/transparency">Transparency</Link>
          <Link to="/volunteer">Volunteer</Link>
          <Link to="/request-support">Request Support</Link>
          <Link to="/photos">Photos</Link>
        </div>
      </Container>
    </footer>
  );
}
