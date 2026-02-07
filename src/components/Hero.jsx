import Container from "./Container";
import { Link } from "react-router-dom";
import { org } from "../data/org";
import { gallery } from "../data/galleryAuto";

export default function Hero() {
  const heroImg = gallery?.[0]; // first photo (use 00-hero.jpg to control)

  return (
    <section className="hero">
      <Container className="hero__inner">
        <div className="hero__copy">
          <div className="pill">Childhood cancer support • {org.region}</div>
          <h1>Hope, dignity, and support for children fighting cancer.</h1>
          <p className="lead">{org.mission}</p>

          <div className="hero__cta">
            <a className="btn btn--primary" href={org.donateUrl} target="_blank" rel="noreferrer">
              Donate
            </a>
            <Link className="btn btn--outline" to={org.secondaryCta.href}>
              Volunteer
            </Link>
          </div>

          <div className="hero__mini">
            <div className="miniCard">
              <div className="miniCard__k">Call / WhatsApp</div>
              <div className="miniCard__v">{org.phoneRaw}</div>
            </div>
            <div className="miniCard">
              <div className="miniCard__k">Focus</div>
              <div className="miniCard__v">Awareness • Welfare • Counselling</div>
            </div>
            <div className="miniCard">
              <div className="miniCard__k">Get involved</div>
              <div className="miniCard__v">Donate • Volunteer • Partner</div>
            </div>
          </div>
        </div>

        <div className="hero__art" aria-hidden="true">
          {/* Real photo (from gallery) */}
          {heroImg ? (
            <div className="heroPhoto">
              <img src={heroImg.src} alt={heroImg.alt || "Wesoamo photo"} />
              <div className="heroPhoto__overlay" />
            </div>
          ) : (
            <>
              <div className="heroBlob heroBlob--a" />
              <div className="heroBlob heroBlob--b" />
            </>
          )}

          {/* Overlay card */}
          <div className="heroCard">
            <div className="heroCard__title">What we do</div>
            <ul>
              <li>Awareness on childhood cancer</li>
              <li>Welfare & financial support</li>
              <li>Parent counselling & emotional support</li>
              <li>Survivor follow-up</li>
              <li>Hospital child welfare projects</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
