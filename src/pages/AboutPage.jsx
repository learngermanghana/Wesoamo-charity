import SEO from "../components/SEO";
import Container from "../components/Container";
import { org } from "../data/org";
import FeaturedVideos from "../components/FeaturedVideos";

export default function AboutPage() {
  return (
    <>
      <SEO title="About" path="/about" />
      <section className="pageHead">
        <Container>
          <h1>About {org.name}</h1>
          <p className="muted">{org.mission}</p>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="grid2">
            <div className="card">
              <h3>Why we exist</h3>
              <p className="muted">
                Childhood cancer affects the child and the whole family. We work to ensure support reaches families
                in practical, emotional, and compassionate ways.
              </p>
            </div>
            <div className="card">
              <h3>What we focus on</h3>
              <ul className="bullets">
                <li>Awareness on childhood cancer</li>
                <li>Financial and welfare support</li>
                <li>Counselling for parents and caregivers</li>
                <li>Survivor follow-up support</li>
                <li>Hospital child welfare projects (education/play)</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <FeaturedVideos
        title="Watch our advocacy in action"
        subtitle="Stories and interviews sharing our mission to support children with cancer."
        sectionClassName="section section--soft"
      />
    </>
  );
}
