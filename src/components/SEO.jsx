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

export default function SEO({ title, description, path = "/", image = "/og.svg" }) {
  const t = pageTitle(title);
  const d = description || org.mission;
  const url = absUrl(path);
  const img = absImage(image);

  return (
    <>
      <title>{t}</title>
      <meta name="description" content={d} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={org.name} />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
      <meta name="twitter:image" content={img} />
    </>
  );
}
