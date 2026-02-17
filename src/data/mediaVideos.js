export const featuredVideos = [
  {
    id: "fF6YiDZBAz0",
    title: "THE WESOAMO STORY GH",
    url: "https://www.youtube.com/watch?v=fF6YiDZBAz0"
  },
  {
    id: "RN3w3uYlGWI",
    title: "Special Tribute to the late Nicole Wesoamo Pwamang | The Standpoint",
    url: "https://www.youtube.com/watch?v=RN3w3uYlGWI"
  },
  {
    id: "X8QNizm_6eg",
    title: "A Date With Cancer | The Standpoint",
    url: "https://www.youtube.com/watch?v=X8QNizm_6eg"
  }
];

export function toYouTubeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}`;
}
