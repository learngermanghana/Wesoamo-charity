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
import Container from "../components/Container";
import InternalLinksBlock from "../components/InternalLinksBlock";

import { homepageGallery } from "../data/homepageGallery";
import { playroomGallery } from "../data/playroomGallery";
import { faq } from "../data/faq";
import { org } from "../data/org";

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    url: org.baseUrl,
    description: org.mission,
    email: org.email,
    telephone: org.phoneE164,
    areaServed: org.region,
    sameAs: [org.facebook].filter(Boolean)
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a
      }
    }))
  };

  return (
    <>
      <SEO
        title="Childhood Cancer Support in Ghana"
        description="Wesoamo Child Cancer Foundation creates awareness, supports children in treatment, and provides counselling and survivor follow-up in Ghana."
        path="/"
        structuredData={[organizationSchema, faqSchema]}
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
      <HomeGalleryPreview items={homepageGallery} />
      <HomeGalleryPreview
        items={playroomGallery}
        title="Playroom moments"
        subtitle="Six snapshots from our child-friendly playroom where children in treatment can play, learn, and feel supported."
        showAlbumLinks={false}
      />
      <Testimonials />

      <section className="section">
        <Container>
          <div className="sectionHead">
            <h2>Frequently asked questions</h2>
            <p>Quick answers about donations, volunteering, and family support services.</p>
          </div>
          <div className="grid2">
            {faq.map((item) => (
              <article key={item.q} className="card">
                <h3>{item.q}</h3>
                <p className="muted">{item.a}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <InternalLinksBlock
        title="Looking for support, tools, or stories?"
        subtitle="Use these internal links to move between support assessments, practical ways to help, and blog updates."
        links={[
          {
            href: "/request-support",
            label: "Support assessment",
            description: "Share your situation privately and get connected to available child-cancer support."
          },
          {
            href: "/get-involved",
            label: "Support tools",
            description: "Find donation and volunteer options to take action quickly."
          },
          {
            href: "/blog",
            label: "Blog updates",
            description: "Read stories, interviews, and awareness updates from our team."
          }
        ]}
      />

      <Contact />
    </>
  );
}
