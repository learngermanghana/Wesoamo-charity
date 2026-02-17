import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "./Container";
import { fetchBlogPosts, formatPostDate } from "../data/blogFeed";

export default function HomeBlogHighlight() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let active = true;

    fetchBlogPosts()
      .then((items) => {
        if (active) {
          setPosts(items.slice(0, 3));
        }
      })
      .catch(() => {
        if (active) {
          setPosts([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (!posts.length) {
    return null;
  }

  const [latestPost, ...morePosts] = posts;

  return (
    <section className="section section--soft">
      <Container>
        <div className="sectionHead">
          <h2>Latest from our blog</h2>
          <p>
            Real stories, updates, and advocacy insights from our child cancer support journey.
          </p>
        </div>

        <div className="blogHighlightGrid">
          <article className="card card--blogHighlight">
            <div className="blogPostMeta">{formatPostDate(latestPost.pubDate) || "Latest update"}</div>
            <h3>{latestPost.title}</h3>
            <p className="muted">{latestPost.excerpt}</p>
            <div className="btnRow" style={{ marginTop: ".8rem" }}>
              <a className="btn btn--primary" href={latestPost.link} target="_blank" rel="noreferrer">
                Read latest post
              </a>
              <Link className="btn btn--outline" to="/blog">
                View all posts
              </Link>
            </div>
          </article>

          <div className="card card--blogList">
            <h3>Highlights</h3>
            <ul className="blogMiniList">
              {morePosts.map((post) => (
                <li key={post.link}>
                  <a href={post.link} target="_blank" rel="noreferrer">
                    <span>{post.title}</span>
                    <small>{formatPostDate(post.pubDate)}</small>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
