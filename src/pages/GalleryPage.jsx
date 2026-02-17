import SEO from "../components/SEO";
import Container from "../components/Container";
import GalleryGrid from "../components/GalleryGrid";
import { gallery } from "../data/galleryAuto";
import { org } from "../data/org";

export default function GalleryPage() {
  return (
    <>
      <SEO
        title="Photos"
        description="Photos from awareness outreaches, hospital support visits, counselling support, and community volunteering."
        path="/photos"
      />

      <section className="pageHead">
        <Container>
          <h1>Photos</h1>
          <p className="muted">
            A glimpse of our work — awareness, welfare support, counselling, survivor follow-up, and hospital child welfare projects.
          </p>

          <div className="btnRow" style={{ marginTop: ".9rem" }}>
            <a className="btn btn--primary" href={org.donateUrl} target="_blank" rel="noreferrer">
              Donate on GoFundMe
            </a>
            <a className="btn btn--outline" href={org.facebook} target="_blank" rel="noreferrer">
              Follow on Facebook
            </a>
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <GalleryGrid items={gallery} />
          <p className="tiny" style={{ marginTop: ".9rem" }}>
            Tip: Click any photo to open it full-size, then use <strong>←</strong> and <strong>→</strong> keys to browse.
          </p>
        </Container>
      </section>
    </>
  );
}
