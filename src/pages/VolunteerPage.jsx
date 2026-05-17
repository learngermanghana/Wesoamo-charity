import { useState } from "react";
import SEO from "../components/SEO";
import Container from "../components/Container";
import { org } from "../data/org";

const sedifexStoreId = import.meta.env.VITE_SEDIFEX_STORE_ID?.trim() ?? "";

function clean(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

export default function VolunteerPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const canSend = fullName.trim() && (phone.trim() || email.trim()) && location.trim() && skills.trim() && availability.trim();

  async function submitVolunteer(e) {
    e.preventDefault();
    if (!canSend || isSubmitting) return;

    if (!sedifexStoreId) {
      setSubmitState("error");
      setFeedback("Setup needed: add VITE_SEDIFEX_STORE_ID in Vercel.");
      return;
    }

    setIsSubmitting(true);
    setSubmitState("idle");
    setFeedback("");

    try {
      const payload = {
        storeId: sedifexStoreId,
        name: clean(fullName, 140),
        fullName: clean(fullName, 140),
        phone: clean(phone, 80),
        email: clean(email, 180).toLowerCase(),
        location: clean(location, 180),
        skills: clean(skills, 250),
        availability: clean(availability, 180),
        notes: clean(notes, 1000),
        source: "wesoamo-charity-website",
        sourcePage: "/volunteer",
        sourceChannel: "wesoamo-charity-website",
        pageType: "volunteer"
      };

      const res = await fetch("/api/volunteer-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.error || data?.ok === false) throw new Error(data?.error || "Volunteer signup failed");

      window.location.href = "/volunteer-success";
    } catch (error) {
      setSubmitState("error");
      setFeedback(error instanceof Error ? error.message : "Unable to submit volunteer application right now.");
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
                <div className="callout__title">Connected to Sedifex</div>
                <div className="callout__text">Volunteer applications are saved directly in Sedifex for review and follow-up.</div>
                <div className="callout__hint">We’ll reply as soon as possible with next steps.</div>
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
                  <span>Phone / WhatsApp</span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0555945515" />
                </label>

                <label className="field">
                  <span>Email</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
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

              {feedback ? (
                <p className="tiny" style={{ marginTop: ".8rem", color: submitState === "success" ? "#0b7a3f" : "#9f1239" }}>
                  {feedback}
                </p>
              ) : null}

              <button className="btn" type="submit" disabled={!canSend || isSubmitting} style={{ width: "100%" }}>
                {isSubmitting ? "Submitting..." : "Submit volunteer application to Sedifex"}
              </button>

              <p className="tiny" style={{ marginTop: ".8rem" }}>
                By submitting, you agree to be contacted by {org.name} using the details provided. At least phone or email is required.
              </p>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}