const playroomPhotos = [
  {
    filename: "WhatsApp Image 2026-02-18 at 16.38.21.jpeg",
    alt: "Children using educational toys in the Wesoamo playroom",
    caption: "Children explore learning toys in the playroom"
  },
  {
    filename: "WhatsApp Image 2026-02-18 at 16.38.22 (1).jpeg",
    alt: "Volunteers preparing activity materials in the playroom",
    caption: "Volunteers prepare materials for play-based therapy"
  },
  {
    filename: "WhatsApp Image 2026-02-18 at 16.38.22 (2).jpeg",
    alt: "A child and caregiver participating in playroom activities",
    caption: "Children and caregivers join guided play sessions"
  },
  {
    filename: "WhatsApp Image 2026-02-18 at 16.38.22.jpeg",
    alt: "Playroom corner with activity tables and children engaging",
    caption: "A welcoming space for creative and social play"
  },
  {
    filename: "WhatsApp Image 2026-02-18 at 16.38.23.jpeg",
    alt: "Children interacting during an indoor playroom session",
    caption: "Play supports confidence, learning, and emotional recovery"
  },
  {
    filename: "homepage-updated-gallery.png",
    alt: "Collage of playroom moments from Wesoamo support activities",
    caption: "A collage highlighting the impact of the playroom"
  }
];

export const playroomGallery = playroomPhotos.map(({ filename, alt, caption }) => ({
  src: `/images/playroom/${encodeURIComponent(filename)}`,
  alt,
  caption
}));
