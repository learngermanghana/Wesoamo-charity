import { useState } from "react";
import SEO from "../components/SEO";
import Hero from "../components/Hero";
import HomeFocus from "../components/HomeFocus";
import Impact from "../components/Impact";
import AboutBlock from "../components/AboutBlock";
import Programs from "../components/Programs";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import HomeBlogHighlight from "../components/HomeBlogHighlight";
import FeaturedVideos from "../components/FeaturedVideos";
import Container from "../components/Container";
import InternalLinksBlock from "../components/InternalLinksBlock";

import { faq } from "../data/faq";
import { contactLinks, org } from "../data/org";

export default function Home() {
  const [showMore, setShowMore] = useState(false);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    url: org.baseUrl,
    description: org.mission,
    logo: contactLinks.brand.logoUrl || `${org.baseUrl}${org.logoPath}`,
    email: contactLinks.contact.email || org.email,
    telephone: contactLinks.contact.phone || org.phoneE164,
    areaServed: org.region,
    sameAs: [contactLinks.social.facebook, contactLinks.social.instagram, contactLinks.social.tiktok, contactLinks.social.youtube, contactLinks.social.linkedin].filter(Boolean)
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
      <Impact />

      <section className="section section--soft">
        <Container>
          <div className="btnRow" style={{ justifyContent: "center" }}>
            <button type="button" className="btn btn--outline" onClick={() => setShowMore((prev) => !prev)}>
              {showMore ? "Show less" : "View more"}
            </button>
          </div>
        </Container>
      </section>

      {showMore && (
        <>
          <AboutBlock />
          <Programs />
          <HomeBlogHighlight />
          <FeaturedVideos
            title="Watch our story"
            subtitle="Highlights from TV interviews and community awareness features."
            sectionClassName="section"
          />
          <Testimonials />

          <section className="section" id="frequently-asked-questions">
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
            subtitle="Use these internal links to move between support assessments, practical ways to help, and inspiring stories."
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
                href: "/inspiring-stories",
                label: "Inspiring stories",
                description: "Read stories, interviews, and awareness updates from our team."
              }
            ]}
          />

          <Contact />
        </>
      )}
    </>
  );
}
