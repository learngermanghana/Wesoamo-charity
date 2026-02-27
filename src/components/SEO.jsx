import { useEffect } from "react";
import { org } from "../data/org";

function absUrl(path = "/") {
  const base = org.baseUrl || "";
  return base.endsWith("/") ? base.slice(0, -1) + path : base + path;
}

function absImage(imgPath = "/og.svg") {
  return imgPath.startsWith("http") ? imgPath : absUrl(imgPath);
}

function pageTitle(title) {
  return title ? `${title} | ${org.name}` : org.name;
}

function setMetaTag(selector, attributes) {
  let el = document.head.querySelector(selector);

  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
}

function setCanonical(url) {
  let el = document.head.querySelector('link[rel="canonical"]');

  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }

  el.setAttribute("href", url);
}

function clearStructuredData() {
  document.head.querySelectorAll('script[data-seo-schema="true"]').forEach((el) => el.remove());
}

function addStructuredData(items) {
  items.forEach((item) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo-schema", "true");
    script.textContent = JSON.stringify(item);
    document.head.appendChild(script);
  });
}

export default function SEO({
  title,
  description,
  path = "/",
  image = "/og.svg",
  noindex = false,
  type = "website",
  structuredData
}) {
  useEffect(() => {
    const t = pageTitle(title);
    const d = description || org.mission;
    const url = absUrl(path);
    const img = absImage(image);

    document.title = t;
    setCanonical(url);

    setMetaTag('meta[name="description"]', { name: "description", content: d });

    setMetaTag('meta[property="og:type"]', { property: "og:type", content: type });
    setMetaTag('meta[property="og:site_name"]', { property: "og:site_name", content: org.name });
    setMetaTag('meta[property="og:title"]', { property: "og:title", content: t });
    setMetaTag('meta[property="og:description"]', { property: "og:description", content: d });
    setMetaTag('meta[property="og:url"]', { property: "og:url", content: url });
    setMetaTag('meta[property="og:image"]', { property: "og:image", content: img });

    setMetaTag('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    setMetaTag('meta[name="twitter:title"]', { name: "twitter:title", content: t });
    setMetaTag('meta[name="twitter:description"]', { name: "twitter:description", content: d });
    setMetaTag('meta[name="twitter:image"]', { name: "twitter:image", content: img });
    setMetaTag('meta[name="twitter:url"]', { name: "twitter:url", content: url });

    if (noindex) {
      setMetaTag('meta[name="robots"]', { name: "robots", content: "noindex,follow" });
    } else {
      const robots = document.head.querySelector('meta[name="robots"]');
      if (robots) {
        robots.remove();
      }
    }

    clearStructuredData();
    const schemas = Array.isArray(structuredData)
      ? structuredData.filter(Boolean)
      : structuredData
        ? [structuredData]
        : [];

    if (schemas.length) {
      addStructuredData(schemas);
    }

    return () => {
      clearStructuredData();
    };
  }, [title, description, path, image, noindex, type, structuredData]);

  return null;
}
