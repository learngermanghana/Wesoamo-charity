import { useEffect, useState } from "react";
import SEO from "../components/SEO";
import Container from "../components/Container";
import FeaturedVideos from "../components/FeaturedVideos";
import InternalLinksBlock from "../components/InternalLinksBlock";
import { fetchBlogPosts, formatPostDate } from "../data/blogFeed";
import { org } from "../data/org";

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

  const articleSchema = posts.slice(0, 6).map((post) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.pubDate || undefined,
    url: post.link,
    image: post.image || undefined,
    author: {
      "@type": "Organization",
      name: org.name
    },
    publisher: {
      "@type": "Organization",
      name: org.name,
      url: org.baseUrl
    },
    mainEntityOfPage: post.link
  }));

  return (
    <>
      <SEO
        title="Blog"
        description="Read the latest updates, stories, and advocacy content from Wesoamo Child Cancer Foundation."
        path="/blog"
        structuredData={articleSchema}
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
            <p>Latest posts from https://www.wesoamochildcancer.com/blog/feed/.</p>
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
                  {post.image && (
                    <a href={post.link} target="_blank" rel="noreferrer" className="blogThumbLink" aria-label={`Read ${post.title}`}>
                      <img className="blogThumb" src={post.image} alt={post.title} loading="lazy" decoding="async" />
                    </a>
                  )}
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

      <InternalLinksBlock
        links={[
          {
            href: "/request-support",
            label: "Support assessment",
            description: "Families can request direct support and counselling through our intake page."
          },
          {
            href: "/get-involved",
            label: "Support tools",
            description: "Turn stories into action through donations, volunteering, or partnerships."
          },
          {
            href: "/",
            label: "Foundation overview",
            description: "Return to the homepage for programs, impact highlights, and FAQs."
          }
        ]}
      />
    </>
  );
}
