import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "./Container";
import { org } from "../data/org";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Get Involved", to: "/get-involved" },
  { label: "Photos", to: "/photos" },
  { label: "Blog", to: "/blog" },
  { label: "Transparency", to: "/transparency" },
  { label: "Volunteer", to: "/volunteer" },
  { label: "Request Support", to: "/request-support" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => setOpen(false), [loc.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={"nav " + (scrolled ? "nav--scrolled" : "")}>
      <Container className="nav__inner">
        <Link className="brand" to="/">
          <span className="brand__mark">W</span>
          <span className="brand__text">
            <span className="brand__name">{org.name}</span>
            <span className="brand__sub">Childhood cancer support • {org.region}</span>
          </span>
        </Link>

        <nav className="nav__links">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to}>{l.label}</Link>
          ))}
          <a className="btn btn--small" href={org.donateUrl} target="_blank" rel="noreferrer">
            Donate
          </a>
        </nav>

        <button
          className="nav__toggle"
          aria-label="Open menu"
          aria-expanded={open ? "true" : "false"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="hamburger" />
        </button>
      </Container>

      {open && (
        <div className="nav__mobile">
          <Container className="nav__mobileInner">
            {navLinks.map((l) => (
              <Link key={l.to} className="nav__mobileLink" to={l.to}>
                {l.label}
              </Link>
            ))}
            <a className="btn" href={org.donateUrl} target="_blank" rel="noreferrer">Donate</a>
          </Container>
        </div>
      )}
    </header>
  );
}
