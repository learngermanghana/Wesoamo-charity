import { useEffect, useState } from "react";
import SEO from "../components/SEO";
import Container from "../components/Container";
import FeaturedVideos from "../components/FeaturedVideos";
import { fetchBlogPosts, formatPostDate } from "../data/blogFeed";

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

      <FeaturedVideos />

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
