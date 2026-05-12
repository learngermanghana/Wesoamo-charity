import SEO from "../components/SEO";
import Container from "../components/Container";
import GalleryGrid from "../components/GalleryGrid";
import { homepageGallery } from "../data/homepageGallery";
import { playroomGallery } from "../data/playroomGallery";
import { org } from "../data/org";

export default function GalleryPage() {
  return (
    <>
      <SEO
        title="Gallery"
        description="Photos from awareness outreaches, hospital support visits, counselling support, and community volunteering."
        path="/photos"
      />

      <section className="pageHead">
        <Container>
          <h1>Gallery</h1>
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

          <div className="btnRow" style={{ marginTop: ".65rem" }}>
            {org.photoAlbums.map((album) => (
              <a key={album.href} className="btn btn--outline" href={album.href} target="_blank" rel="noreferrer">
                {album.label}
              </a>
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="sectionHead">
            <h2>Photos from our work</h2>
            <p>Moments from awareness outreaches, hospital support visits, counselling, and community volunteering.</p>
          </div>
          <GalleryGrid items={homepageGallery} />

          <div className="sectionHead" style={{ marginTop: "2rem" }}>
            <h2>Playroom moments</h2>
            <p>Six snapshots from our child-friendly playroom where children in treatment can play, learn, and feel supported.</p>
          </div>
          <GalleryGrid items={playroomGallery} />

          <p className="tiny" style={{ marginTop: ".9rem" }}>
            Tip: Click any photo to open it full-size, then use <strong>←</strong> and <strong>→</strong> keys to browse.
          </p>
        </Container>
      </section>
    </>
  );
}
