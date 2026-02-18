const homepageImageFiles = [
  "WhatsApp Image 2026-02-18 at 16.31.42 (1).jpeg",
  "WhatsApp Image 2026-02-18 at 16.31.42.jpeg",
  "WhatsApp Image 2026-02-18 at 16.31.43 (1).jpeg",
  "WhatsApp Image 2026-02-18 at 16.31.43 (2).jpeg",
  "WhatsApp Image 2026-02-18 at 16.31.43 (3).jpeg",
  "WhatsApp Image 2026-02-18 at 16.31.43.jpeg",
  "WhatsApp Image 2026-02-18 at 16.31.44 (1).jpeg",
  "WhatsApp Image 2026-02-18 at 16.31.44.jpeg"
];

function captionFromFilename(filename) {
  return filename
    .replace(/^WhatsApp Image\s*/i, "")
    .replace(/\.[^/.]+$/, "")
    .trim();
}

export const homepageGallery = homepageImageFiles.map((filename) => ({
  src: `/images/homepage/${encodeURIComponent(filename)}`,
  alt: "Wesoamo outreach moment",
  caption: captionFromFilename(filename)
}));
