import { useEffect, useMemo, useState } from "react";
import SEO from "../components/SEO";
import Container from "../components/Container";
import { org } from "../data/org";
import { fundUse as fallbackFundUse, transparencyMeta as fallbackMeta, accountability } from "../data/transparency";
import { getPublicTransparencySnapshot } from "../services/adminReports";

function BreakdownCard({ percent, title, items }) {
  return (
    <div className="tCard">
      <div className="tCard__top">
        <div className="tBadge">{percent}%</div>
        <div className="tCard__title">{title}</div>
      </div>
      <ul className="tList">
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

export default function TransparencyPage() {
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    getPublicTransparencySnapshot().then((data) => {
      if (data?.fundUse?.length) {
        setSnapshot(data);
      }
    });
  }, []);

  const fundUse = useMemo(() => snapshot?.fundUse || fallbackFundUse, [snapshot]);
  const transparencyMeta = useMemo(
    () => snapshot?.transparencyMeta || fallbackMeta,
    [snapshot]
  );

  const wa = `https://wa.me/${org.whatsapp}?text=${encodeURIComponent(
    "Hello " + org.name + ", I would like to support. Please share local donation options and details."
  )}`;

  return (
    <>
      <SEO
        title="Donation Transparency"
        description="See how donations support children battling cancer: welfare support, hospital child projects, awareness outreach, counselling and survivor follow-up."
        path="/transparency"
      />

      <section className="pageHead">
        <Container>
          <h1>Donation transparency</h1>
          <p className="muted">
            We value trust. Here is a clear view of how donations are used to support children battling cancer and their families in {org.region}.
          </p>

          <div className="btnRow" style={{ marginTop: ".9rem" }}>
            <a className="btn btn--primary" href={org.donateUrl} target="_blank" rel="noreferrer">
              Donate on GoFundMe
            </a>
            <a className="btn btn--outline" href={wa} target="_blank" rel="noreferrer">
              Donate locally via WhatsApp
            </a>
          </div>

          <div className="tNote">
            <strong>Last updated:</strong> {transparencyMeta.lastUpdated} • {transparencyMeta.note}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="sectionHead">
            <h2>How funds are used</h2>
            <p>Simple breakdown cards — designed for clarity.</p>
          </div>

          <div className="tGrid">
            {fundUse.map((c) => (
              <BreakdownCard key={c.title} percent={c.percent} title={c.title} items={c.items} />
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="sectionHead">
            <h2>Accountability & care</h2>
            <p>How we protect integrity while serving families with dignity.</p>
          </div>

          <div className="tGrid tGrid--mini">
            {accountability.map((a) => (
              <div key={a.title} className="tMini">
                <div className="tMini__title">{a.title}</div>
                <div className="tMini__text">{a.text}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
