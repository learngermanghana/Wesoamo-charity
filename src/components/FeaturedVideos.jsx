import Container from "./Container";
import { featuredVideos, toYouTubeEmbedUrl } from "../data/mediaVideos";

export default function FeaturedVideos({
  title = "Featured videos",
  subtitle = "Watch these interviews and story features from YouTube.",
  sectionClassName = "section",
  limit
}) {
  const videos = typeof limit === "number" ? featuredVideos.slice(0, limit) : featuredVideos;

  return (
    <section className={sectionClassName}>
      <Container>
        <div className="sectionHead">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <div className="videoGrid">
          {videos.map((video) => (
            <article key={video.id} className="card card--video">
              <div className="videoFrameWrap">
                <iframe
                  className="videoFrame"
                  src={toYouTubeEmbedUrl(video.id)}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <h3>{video.title}</h3>
              <a className="textLink" href={video.url} target="_blank" rel="noreferrer">
                Watch on YouTube →
              </a>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
