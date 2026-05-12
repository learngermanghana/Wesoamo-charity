const SEDIFEX_BASE_URL = import.meta.env.VITE_SEDIFEX_SITE_BASE_URL || "https://www.sedifex.com";
const SEDIFEX_STORE_ID = import.meta.env.VITE_SEDIFEX_STORE_ID || "";

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

function stripHtml(html = "") {
  if (typeof document === "undefined") {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || "").trim();
}

function normalizePost(post) {
  const excerpt = stripHtml(post.content || "").slice(0, 220);

  return {
    id: post.id || "",
    slug: post.slug || "",
    title: (post.title || "").trim(),
    link: post.linkUrl || "",
    pubDate: post.publishedAt || "",
    excerpt: excerpt.length >= 220 ? `${excerpt}…` : excerpt,
    image: post.imageUrl || ""
  };
}

function sortByDateDesc(a, b) {
  return new Date(b.pubDate) - new Date(a.pubDate);
}

function buildSedifexUrl(slug) {
  const url = new URL("/api/public-blog", SEDIFEX_BASE_URL);
  url.searchParams.set("storeId", SEDIFEX_STORE_ID);

  if (slug) {
    url.searchParams.set("slug", slug);
  }

  return url.toString();
}

export async function fetchBlogPosts({ slug } = {}) {
  if (!SEDIFEX_STORE_ID) {
    return FALLBACK_POSTS;
  }

  const response = await fetch(buildSedifexUrl(slug), {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Blog pull failed: ${response.status}`);
  }

  const payload = await response.json();
  const items = Array.isArray(payload?.items) ? payload.items : [];

  const posts = items
    .map(normalizePost)
    .filter((post) => post.title && post.link)
    .sort(sortByDateDesc);

  return posts.length ? posts : FALLBACK_POSTS;
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
