import { useEffect, useState } from "react";
import SEO from "../components/SEO";
import Container from "../components/Container";
import { fetchBlogPosts, formatPostDate } from "../data/blogFeed";
import { featuredVideos, toYouTubeEmbedUrl } from "../data/mediaVideos";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchBlogPosts()
      .then((items) => {
        if (!active) {
          return;
        }

        setPosts(items);
        setError("");
      })
      .catch((err) => {
        if (!active) {
          return;
        }

        setError(err.message || "Unable to load posts.");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <SEO
        title="Blog"
        description="Read the latest updates, stories, and advocacy content from Wesoamo Child Cancer Foundation."
        path="/blog"
      />

      <section className="pageHead">
        <Container>
          <h1>Blog</h1>
          <p className="muted">Latest stories and video features from Wesoamo Child Cancer Foundation.</p>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="sectionHead">
            <h2>Featured videos</h2>
            <p>Watch these interviews and story features from YouTube.</p>
          </div>

          <div className="videoGrid">
            {featuredVideos.map((video) => (
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

      <section className="section section--soft">
        <Container>
          <div className="sectionHead">
            <h2>Blog posts</h2>
            <p>Latest posts from https://blog.wesoamochildcancer.com/feed.xml.</p>
          </div>

          {loading && <p className="muted">Loading blog posts...</p>}

          {!loading && error && (
            <div className="note">
              <strong>We could not load posts right now.</strong>
              <p className="tiny">{error} Showing fallback updates instead.</p>
            </div>
          )}

          {!loading && !error && (
            <div className="blogGrid">
              {posts.map((post) => (
                <article key={post.link} className="card card--blog">
                  <div className="blogPostMeta">{formatPostDate(post.pubDate) || "Latest update"}</div>
                  <h3>{post.title}</h3>
                  <p className="muted">{post.excerpt}</p>
                  <a className="textLink" href={post.link} target="_blank" rel="noreferrer">
                    Read post →
                  </a>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
