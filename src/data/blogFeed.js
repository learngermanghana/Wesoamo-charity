const FEED_URLS = [
  "https://www.wesoamochildcancer.com/blog/feed/",
  "https://blog.wesoamochildcancer.com/feed.xml",
  "https://www.wesoamochildcancer.com/blog/feed.xml"
];

const FALLBACK_POSTS = [
  {
    title: "THE WESOAMO STORY GH",
    link: "https://www.youtube.com/watch?v=fF6YiDZBAz0",
    pubDate: "",
    excerpt: "Watch our story and advocacy journey on YouTube.",
    image: ""
  },
  {
    title: "Special Tribute to the late Nicole Wesoamo Pwamang | The Standpoint",
    link: "https://www.youtube.com/watch?v=RN3w3uYlGWI",
    pubDate: "",
    excerpt: "A heartfelt tribute shared on The Standpoint.",
    image: ""
  },
  {
    title: "A Date With Cancer | The Standpoint",
    link: "https://www.youtube.com/watch?v=X8QNizm_6eg",
    pubDate: "",
    excerpt: "A conversation about cancer awareness and support.",
    image: ""
  }
];

function readNodeText(parent, selector) {
  const node = parent.querySelector(selector);
  return node?.textContent?.trim() || "";
}

function stripHtml(html = "") {
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || "").trim();
}

function toAbsoluteUrl(url, baseUrl = "") {
  if (!url) {
    return "";
  }

  try {
    return new URL(url, baseUrl || "https://www.wesoamochildcancer.com").toString();
  } catch {
    return "";
  }
}

function extractImageFromHtml(html = "", baseUrl = "") {
  if (!html) {
    return "";
  }

  const div = document.createElement("div");
  div.innerHTML = html;
  const imageUrl = div.querySelector("img")?.getAttribute("src") || "";

  return toAbsoluteUrl(imageUrl, baseUrl);
}

function normalizePost(post) {
  const excerpt = stripHtml(post.excerpt || post.description || "").slice(0, 220);

  return {
    title: (post.title || "").trim(),
    link: (post.link || "").trim(),
    pubDate: post.pubDate || post.isoDate || "",
    excerpt: excerpt.length >= 220 ? `${excerpt}…` : excerpt,
    image: toAbsoluteUrl(post.image, post.link)
  };
}

function sortByDateDesc(a, b) {
  return new Date(b.pubDate) - new Date(a.pubDate);
}

function parseRssFeed(xmlText) {
  const xml = new DOMParser().parseFromString(xmlText, "application/xml");

  if (xml.querySelector("parsererror")) {
    throw new Error("Could not parse RSS feed.");
  }

  const itemPosts = Array.from(xml.querySelectorAll("item"))
    .map((item) => {
      const link = readNodeText(item, "link");
      const description = readNodeText(item, "description");
      const contentEncoded = readNodeText(item, "content\\:encoded");
      const enclosureImage = item.querySelector("enclosure")?.getAttribute("url") || "";
      const mediaThumbnail = item.querySelector("media\\:thumbnail")?.getAttribute("url") || "";
      const mediaContent = item.querySelector("media\\:content")?.getAttribute("url") || "";

      const image =
        enclosureImage ||
        mediaThumbnail ||
        mediaContent ||
        extractImageFromHtml(contentEncoded || description, link);

      return normalizePost({
        title: readNodeText(item, "title"),
        link,
        pubDate: readNodeText(item, "pubDate"),
        description,
        image
      });
    })
    .filter((post) => post.title && post.link);

  if (itemPosts.length) {
    return itemPosts.sort(sortByDateDesc);
  }

  const atomPosts = Array.from(xml.querySelectorAll("entry"))
    .map((entry) => {
      const linkNode = entry.querySelector("link[rel='alternate']") || entry.querySelector("link");
      const link = linkNode?.getAttribute("href") || "";
      const summary = readNodeText(entry, "summary") || readNodeText(entry, "content");

      return normalizePost({
        title: readNodeText(entry, "title"),
        link,
        pubDate: readNodeText(entry, "published") || readNodeText(entry, "updated"),
        description: summary,
        image: extractImageFromHtml(summary, link)
      });
    })
    .filter((post) => post.title && post.link)
    .sort(sortByDateDesc);

  return atomPosts;
}

function parseRss2JsonFeed(jsonText) {
  const payload = JSON.parse(jsonText);
  const items = Array.isArray(payload?.items) ? payload.items : [];

  return items
    .map((item) =>
      normalizePost({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: item.description || item.contentSnippet || item.content,
        image: item.thumbnail || extractImageFromHtml(item.content || item.description, item.link)
      })
    )
    .filter((post) => post.title && post.link)
    .sort(sortByDateDesc);
}

function buildEndpoints() {
  const direct = FEED_URLS.map((url) => ({ url, parser: parseRssFeed }));

  const allOrigins = FEED_URLS.map((url) => ({
    url: `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    parser: parseRssFeed
  }));

  const rss2json = FEED_URLS.map((url) => ({
    url: `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`,
    parser: parseRss2JsonFeed
  }));

  return [...direct, ...allOrigins, ...rss2json];
}

export async function fetchBlogPosts() {
  const endpoints = buildEndpoints();

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        headers: {
          Accept: "application/rss+xml, application/xml, text/xml, application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Feed request failed with ${response.status}`);
      }

      const payloadText = await response.text();
      const posts = endpoint.parser(payloadText);

      if (posts.length) {
        return posts;
      }
    } catch {
      // try the next endpoint
    }
  }

  return FALLBACK_POSTS;
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
