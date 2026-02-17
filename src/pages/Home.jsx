import SEO from "../components/SEO";
import Hero from "../components/Hero";
import HomeFocus from "../components/HomeFocus";
import AboutBlock from "../components/AboutBlock";
import Programs from "../components/Programs";
import Impact from "../components/Impact";
import HomeGalleryPreview from "../components/HomeGalleryPreview";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import HomeBlogHighlight from "../components/HomeBlogHighlight";
import FeaturedVideos from "../components/FeaturedVideos";

import { gallery } from "../data/galleryAuto";

export default function Home() {
  return (
    <>
      <SEO
        title="Childhood Cancer Support in Ghana"
        description="Wesoamo Child Cancer Foundation creates awareness, supports children in treatment, and provides counselling and survivor follow-up in Ghana."
        path="/"
      />
      <Hero />
      <HomeFocus />
      <AboutBlock />
      <Programs />
      <Impact />
      <HomeBlogHighlight />
      <FeaturedVideos
        title="Watch our story"
        subtitle="Highlights from TV interviews and community awareness features."
        sectionClassName="section"
      />
      <HomeGalleryPreview items={gallery} />
      <Testimonials />
      <Contact />
    </>
  );
}
