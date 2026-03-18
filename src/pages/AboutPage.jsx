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
                <li>Fund medical care by covering essential treatment for children battling cancer</li>
                <li>Ensure access by transporting patients to hospital for early diagnosis and life-saving care</li>
                <li>Support families with welfare assistance throughout the recovery journey</li>
                <li>Provide counselling and emotional support for parents and caregivers</li>
                <li>Strengthen hospital child welfare projects through education and play support</li>
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
