import { Link } from "react-router-dom";
import { contactLinks, org } from "../data/org";

export default function FloatingActions() {
  const wa = `https://wa.me/${contactLinks.contact.whatsapp || org.whatsapp}?text=${encodeURIComponent(
    "Hello " + org.name + ", I want to get involved. Please share how to donate/volunteer."
  )}`;

  return (
    <div className="floatWrap">
      <a
        className="floatBtn floatBtn--donate"
        href={org.donateUrl}
        target="_blank"
        rel="noreferrer"
      >
        Donate (GoFundMe)
      </a>

      <Link className="floatBtn" to={org.secondaryCta.href}>
        Volunteer
      </Link>

      <a className="floatBtn" href={wa} target="_blank" rel="noreferrer">
        WhatsApp
      </a>
    </div>
  );
}
