import Container from "./Container";
import { Link } from "react-router-dom";
import { org } from "../data/org";

export default function HomeGalleryPreview({
  items = [],
  title = "Photos from our work",
  subtitle = "Moments from awareness outreaches, hospital support visits, counselling, and community volunteering.",
  showAlbumLinks = true,
  showDonateButton = true
}) {
  const preview = (items || []).slice(0, 6);

  if (!preview.length) return null;

  return (
    <section className="section">
      <Container>
        <div className="sectionHead">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <div className="galleryGrid">
          {preview.map((it) => (
            <div key={it.src} className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div className="galleryMedia" style={{ height: 200 }}>
                <img
                  src={it.src}
                  alt={it.alt || "Wesoamo photo"}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  loading="lazy"
                />
              </div>

              {it.caption && (
                <div
                  style={{
                    padding: ".85rem 1rem 1rem",
                    color: "rgba(15,23,42,.78)",
                    fontWeight: 850,
                    lineHeight: 1.6
                  }}
                >
                  {it.caption}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="btnRow" style={{ marginTop: "1rem" }}>
          <Link className="btn btn--outline" to="/photos">View all photos</Link>
          {showAlbumLinks && (
            <>
              <a className="btn btn--outline" href={org.photoAlbums[0].href} target="_blank" rel="noreferrer">
                Open Google Drive album
              </a>
              <a className="btn btn--outline" href={org.photoAlbums[1].href} target="_blank" rel="noreferrer">
                Open Google Photos album
              </a>
            </>
          )}
          {showDonateButton && (
            <a className="btn btn--primary" href={org.donateUrl} target="_blank" rel="noreferrer">
              Donate on GoFundMe
            </a>
          )}
        </div>
      </Container>
    </section>
  );
}
