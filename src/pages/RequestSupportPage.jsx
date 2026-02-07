import { useMemo, useState } from "react";
import SEO from "../components/SEO";
import Container from "../components/Container";
import { org } from "../data/org";

export default function RequestSupportPage() {
  const [caregiverName, setCaregiverName] = useState("");
  const [phone, setPhone] = useState("");
  const [childAge, setChildAge] = useState("");
  const [hospital, setHospital] = useState("");
  const [location, setLocation] = useState("");
  const [supportType, setSupportType] = useState("Welfare / Financial Support");
  const [urgent, setUrgent] = useState(false);
  const [notes, setNotes] = useState("");

  const waLink = useMemo(() => {
    const text =
      `REQUEST SUPPORT - ${org.name}\n\n` +
      `Caregiver name: ${caregiverName}\n` +
      `Phone: ${phone}\n` +
      `Child age: ${childAge}\n` +
      `Hospital / Clinic: ${hospital}\n` +
      `Location: ${location}\n` +
      `Support needed: ${supportType}\n` +
      `Urgent: ${urgent ? "YES" : "No"}\n\n` +
      `Notes (please keep it brief):\n${notes || "-"}\n\n` +
      `Submitted via website.`;
    return `https://wa.me/${org.whatsapp}?text=${encodeURIComponent(text)}`;
  }, [caregiverName, phone, childAge, hospital, location, supportType, urgent, notes]);

  const canSend =
    caregiverName.trim() && phone.trim() && childAge.toString().trim() && hospital.trim() && location.trim();

  function sendWhatsApp(e) {
    e.preventDefault();
    if (!canSend) return;
    window.open(waLink, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <SEO
        title="Request Support"
        description="Private support request for parents/caregivers — welfare help, counselling, hospital child welfare projects, and survivor follow-up."
        path="/request-support"
      />

      <section className="pageHead">
        <Container>
          <h1>Request support</h1>
          <p className="muted">
            If you are a parent/caregiver of a child battling cancer, you can reach out privately. We will do our best to guide and support you.
          </p>

          <div className="tNote" style={{ marginTop: ".9rem" }}>
            <strong>Privacy note:</strong> Please don’t share medical records or very sensitive details in this form.
            We’ll ask for more information privately if needed.
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="twoCol twoCol--contact">
            <div className="infoBox">
              <h3>Types of support</h3>
              <ul>
                <li>Financial & welfare support (case-by-case)</li>
                <li>Emotional support and counselling for parents</li>
                <li>Survivor follow-up support</li>
                <li>Hospital child welfare projects (library/playroom support)</li>
                <li>Childhood cancer awareness guidance and referrals</li>
              </ul>

              <div className="callout" style={{ marginTop: "1rem" }}>
                <div className="callout__title">Need quick help?</div>
                <div className="callout__text">Send a private message via WhatsApp</div>
                <div className="callout__hint">
                  If this is a medical emergency, contact your hospital or emergency services immediately.
                </div>
              </div>
            </div>

            <form className="card card--form" onSubmit={sendWhatsApp}>
              <h3 className="card__title">Support request form</h3>

              <div className="formGrid">
                <label className="field">
                  <span>Caregiver name *</span>
                  <input value={caregiverName} onChange={(e) => setCaregiverName(e.target.value)} placeholder="Your name" required />
                </label>

                <label className="field">
                  <span>Phone / WhatsApp *</span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0555945515" required />
                </label>

                <label className="field">
                  <span>Child age *</span>
                  <input value={childAge} onChange={(e) => setChildAge(e.target.value)} placeholder="e.g. 6" required />
                </label>

                <label className="field">
                  <span>Hospital / Clinic *</span>
                  <input value={hospital} onChange={(e) => setHospital(e.target.value)} placeholder="Where the child is receiving care" required />
                </label>

                <label className="field field--wide">
                  <span>Location *</span>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City / Town" required />
                </label>

                <label className="field field--wide">
                  <span>Support needed *</span>
                  <select value={supportType} onChange={(e) => setSupportType(e.target.value)}>
                    <option>Welfare / Financial Support</option>
                    <option>Counselling / Emotional Support</option>
                    <option>Survivor Follow-up</option>
                    <option>Hospital Child Welfare Project Support</option>
                    <option>Awareness / Guidance / Referral</option>
                  </select>
                </label>

                <label className="field field--wide" style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
                  <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} style={{ width: 18, height: 18 }} />
                  <span style={{ fontWeight: 800, color: "rgba(15,23,42,.76)" }}>Mark as urgent</span>
                </label>

                <label className="field field--wide">
                  <span>Brief notes (optional)</span>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="5" placeholder="Briefly explain what support you need..." />
                </label>
              </div>

              <button className="btn" type="submit" disabled={!canSend} style={{ width: "100%" }}>
                Send privately via WhatsApp
              </button>

              <p className="tiny" style={{ marginTop: ".8rem" }}>
                By submitting, you agree to be contacted by {org.name}. We treat requests with care and confidentiality.
              </p>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}
