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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState("idle");

  const volunteerIntakeUrl =
    import.meta.env.VITE_SEDIFEX_VOLUNTEER_INTAKE_URL?.trim() ||
    "https://us-central1-sedifex-web.cloudfunctions.net/volunteerIntake";

  const volunteerIntakeUrl =
    import.meta.env.VITE_SEDIFEX_VOLUNTEER_INTAKE_URL?.trim() ||
    "https://us-central1-sedifex-web.cloudfunctions.net/volunteerIntake";

  const canSend = fullName.trim() && phone.trim() && location.trim() && skills.trim() && availability.trim();

  async function submitVolunteer(e) {
    e.preventDefault();
    if (!canSend) return;

    setIsSubmitting(true);
    setSubmitState("idle");

    try {
      const payload = {
        name: fullName.trim(),
        phone: phone.trim(),
        location: location.trim(),
        skills: skills.trim(),
        availability: availability.trim(),
        notes: notes.trim(),
        source: "wesoamochildcancer.com/volunteer",
      };

      const res = await fetch(volunteerIntakeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Volunteer signup failed");

      setSubmitState("success");
      setFullName("");
      setPhone("");
      setLocation("");
      setSkills("");
      setAvailability("");
      setNotes("");
    } catch {
      setSubmitState("error");
      window.open(waLink, "_blank", "noopener,noreferrer");
    } finally {
      setIsSubmitting(false);
    }
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
                <div className="callout__text">Submit this form to send directly to Sedifex</div>
                <div className="callout__hint">
                  We’ll reply as soon as possible with next steps.
                </div>
              </div>
            </div>

            <form className="card card--form" onSubmit={submitVolunteer}>
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

              <button className="btn" type="submit" disabled={!canSend || isSubmitting} style={{ width: "100%" }}>
                {isSubmitting ? "Submitting..." : "Sign up as volunteer"}
              </button>

              {submitState === "success" ? (
                <p className="tiny" style={{ marginTop: ".8rem", color: "#0b7a3f" }}>
                  Success! Your volunteer signup has been sent. Our team will contact you with next steps.
                </p>
              ) : null}

              {submitState === "error" ? (
                <p className="tiny" style={{ marginTop: ".8rem", color: "#9f1239" }}>
                  We could not submit directly to Sedifex right now. We opened WhatsApp as backup so your application can still be delivered.
                </p>
              ) : null}

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
