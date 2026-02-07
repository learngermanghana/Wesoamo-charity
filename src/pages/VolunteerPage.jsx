import { useMemo, useState } from "react";
import SEO from "../components/SEO";
import Container from "../components/Container";
import { org } from "../data/org";

export default function VolunteerPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState("");
  const [notes, setNotes] = useState("");

  const waLink = useMemo(() => {
    const text =
      `VOLUNTEER APPLICATION - ${org.name}\n\n` +
      `Full name: ${fullName}\n` +
      `Phone: ${phone}\n` +
      `Location: ${location}\n` +
      `Skills: ${skills}\n` +
      `Availability: ${availability}\n\n` +
      `Extra notes:\n${notes || "-"}\n\n` +
      `Submitted via website.`;
    return `https://wa.me/${org.whatsapp}?text=${encodeURIComponent(text)}`;
  }, [fullName, phone, location, skills, availability, notes]);

  const canSend = fullName.trim() && phone.trim() && location.trim() && skills.trim() && availability.trim();

  function sendWhatsApp(e) {
    e.preventDefault();
    if (!canSend) return;
    window.open(waLink, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <SEO
        title="Volunteer"
        description="Apply to volunteer with Wesoamo Child Cancer Foundation — outreach, fundraising, hospital projects, admin, and media support."
        path="/volunteer"
      />

      <section className="pageHead">
        <Container>
          <h1>Volunteer with us</h1>
          <p className="muted">
            Your time and skills can make a real difference for children battling cancer and their families in {org.region}.
          </p>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="twoCol twoCol--contact">
            <div className="infoBox">
              <h3>Where volunteers help</h3>
              <ul>
                <li>Awareness outreach & community education</li>
                <li>Fundraising & donor support</li>
                <li>Hospital child welfare projects</li>
                <li>Administration & coordination</li>
                <li>Photography / video / social media</li>
              </ul>

              <div className="callout" style={{ marginTop: "1rem" }}>
                <div className="callout__title">Fastest response</div>
                <div className="callout__text">Send your application via WhatsApp</div>
                <div className="callout__hint">
                  We’ll reply as soon as possible with next steps.
                </div>
              </div>
            </div>

            <form className="card card--form" onSubmit={sendWhatsApp}>
              <h3 className="card__title">Volunteer application</h3>

              <div className="formGrid">
                <label className="field">
                  <span>Full name *</span>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required />
                </label>

                <label className="field">
                  <span>Phone / WhatsApp *</span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0555945515" required />
                </label>

                <label className="field">
                  <span>Location *</span>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City / Town" required />
                </label>

                <label className="field">
                  <span>Skills *</span>
                  <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. Outreach, fundraising, media, admin..." required />
                </label>

                <label className="field field--wide">
                  <span>Availability *</span>
                  <input value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="e.g. Weekends, 2 days/week, evenings..." required />
                </label>

                <label className="field field--wide">
                  <span>Extra notes (optional)</span>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="5" placeholder="Anything else you'd like us to know?" />
                </label>
              </div>

              <button className="btn" type="submit" disabled={!canSend} style={{ width: "100%" }}>
                Send via WhatsApp
              </button>

              <p className="tiny" style={{ marginTop: ".8rem" }}>
                By submitting, you agree to be contacted by {org.name} using the details provided.
              </p>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}
