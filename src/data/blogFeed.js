const FEED_URL = "https://blog.wesoamochildcancer.com/feed.xml";
const FEED_PROXY_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(FEED_URL)}`;

function readNodeText(parent, selector) {
  const node = parent.querySelector(selector);
  return node?.textContent?.trim() || "";
}

function stripHtml(html = "") {
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || "").trim();
}

function parseRssFeed(xmlText) {
  const xml = new DOMParser().parseFromString(xmlText, "application/xml");

  if (xml.querySelector("parsererror")) {
    throw new Error("Could not parse RSS feed.");
  }

  const posts = Array.from(xml.querySelectorAll("item"))
    .map((item) => {
      const title = readNodeText(item, "title");
      const link = readNodeText(item, "link");
      const pubDate = readNodeText(item, "pubDate");
      const rawDescription = readNodeText(item, "description");

      const excerpt = stripHtml(rawDescription).slice(0, 220);

      return {
        title,
        link,
        pubDate,
        excerpt: excerpt.length >= 220 ? `${excerpt}…` : excerpt
      };
    })
    .filter((post) => post.title && post.link)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  return posts;
}

export async function fetchBlogPosts() {
  const endpoints = [FEED_URL, FEED_PROXY_URL];

  for (const url of endpoints) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Feed request failed with ${response.status}`);
      }

      const xmlText = await response.text();
      const posts = parseRssFeed(xmlText);

      if (posts.length) {
        return posts;
      }
    } catch {
      // try the next endpoint
    }
  }

  throw new Error("Unable to load blog posts right now.");
}

export function formatPostDate(dateInput) {
  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GH", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}
