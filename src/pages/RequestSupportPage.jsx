import { useState } from "react";
import SEO from "../components/SEO";
import Container from "../components/Container";
import InternalLinksBlock from "../components/InternalLinksBlock";
import { org } from "../data/org";

const sedifexStoreId = import.meta.env.VITE_SEDIFEX_STORE_ID?.trim() ?? "";

function clean(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

export default function RequestSupportPage() {
  const [caregiverName, setCaregiverName] = useState("");
  const [phone, setPhone] = useState("");
  const [childAge, setChildAge] = useState("");
  const [hospital, setHospital] = useState("");
  const [location, setLocation] = useState("");
  const [supportType, setSupportType] = useState("Welfare / Financial Support");
  const [urgent, setUrgent] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const canSend =
    caregiverName.trim() && phone.trim() && childAge.toString().trim() && hospital.trim() && location.trim();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Childhood Cancer Family Support Service",
    provider: {
      "@type": "Organization",
      name: org.name,
      url: org.baseUrl
    },
    serviceType: "Family support and counselling for childhood cancer",
    areaServed: org.region,
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${org.baseUrl}/request-support`,
      availableLanguage: "en"
    },
    description: "Private request pathway for welfare, counselling, and survivor follow-up support for families."
  };

  async function submitSupportRequest(e) {
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
        name: clean(caregiverName, 140),
        caregiverName: clean(caregiverName, 140),
        phone: clean(phone, 80),
        childAge: clean(childAge, 40),
        hospital: clean(hospital, 180),
        clinic: clean(hospital, 180),
        location: clean(location, 180),
        supportType: clean(supportType, 180),
        supportNeeded: clean(supportType, 180),
        urgent,
        priority: urgent ? "urgent" : "normal",
        urgency: urgent ? "urgent" : "normal",
        needSummary: clean(notes, 1000),
        notes: clean(notes, 1000),
        source: "wesoamo-charity-website",
        sourcePage: "/request-support",
        sourceChannel: "wesoamo-charity-website",
        pageType: "request_support"
      };

      const res = await fetch("/api/support-request-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.error || data?.ok === false) {
        throw new Error(data?.error || "Support request failed. Please try again.");
      }

      window.location.href = "/request-success";
    } catch (error) {
      setSubmitState("error");
      setFeedback(error instanceof Error ? error.message : "Unable to submit support request right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SEO
        title="Request Support"
        description="Private support request for parents/caregivers — welfare help, counselling, hospital child welfare projects, and survivor follow-up."
        path="/request-support"
        structuredData={serviceSchema}
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
                <div className="callout__title">Connected to Sedifex</div>
                <div className="callout__text">Support requests are saved directly in Sedifex for private review and follow-up.</div>
                <div className="callout__hint">
                  If this is a medical emergency, contact your hospital or emergency services immediately.
                </div>
              </div>
            </div>

            <form className="card card--form" onSubmit={submitSupportRequest}>
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

              {feedback ? (
                <p className="tiny" style={{ marginTop: ".8rem", color: submitState === "success" ? "#0b7a3f" : "#9f1239" }}>
                  {feedback}
                </p>
              ) : null}

              <button className="btn" type="submit" disabled={!canSend || isSubmitting} style={{ width: "100%" }}>
                {isSubmitting ? "Submitting..." : "Submit request to Sedifex"}
              </button>

              <p className="tiny" style={{ marginTop: ".8rem" }}>
                By submitting, you agree to be contacted by {org.name}. We treat requests with care and confidentiality.
              </p>
            </form>
          </div>
        </Container>
      </section>

      <InternalLinksBlock
        links={[
          {
            href: "/get-involved",
            label: "Support tools",
            description: "Use donation and volunteer options to support current family needs."
          },
          {
            href: "/inspiring-stories",
            label: "Related stories",
            description: "Read advocacy stories and awareness updates from the foundation."
          },
          {
            href: "/",
            label: "Homepage FAQ",
            description: "Review common questions about support, privacy, and next steps."
          }
        ]}
      />
    </>
  );
}