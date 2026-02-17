const modules = import.meta.glob("../assets/gallery/**/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default"
});

function prettyName(path) {
  const file = path.split("/").pop() || "";
  const base = file.replace(/\.[^/.]+$/, "");
  return base.replace(/[-_]+/g, " ").trim();
}

export const gallery = Object.entries(modules)
  .map(([path, url]) => {
    const label = prettyName(path);
    return {
      src: url,
      alt: label || "Gallery photo",
      caption: label || "Wesoamo photo"
    };
  })
  .sort((a, b) => a.caption.localeCompare(b.caption, undefined, { numeric: true, sensitivity: "base" }));
