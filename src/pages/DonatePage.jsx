import { useState } from "react";
import SEO from "../components/SEO";
import Container from "../components/Container";
import { org } from "../data/org";

export default function DonatePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState("idle");

  const canSubmit = name.trim() && email.trim() && Number(amount) > 0;

  async function submitDonation(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setSubmitState("idle");

    try {
      const res = await fetch("/api/donor-portal-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: name.trim(),
          donorEmail: email.trim(),
          donorPhone: phone.trim(),
          amount: Number(amount),
          currency: "GHS",
          note: message.trim(),
          source: "wesoamochildcancer.com/donate",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Donation submit failed");

      if (data?.paymentUrl) {
        window.location.assign(data.paymentUrl);
        return;
      }

      setSubmitState("success");
      setName("");
      setEmail("");
      setPhone("");
      setAmount("");
      setMessage("");
    } catch {
      setSubmitState("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SEO title="Donate" description="Donate to Wesoamo Child Cancer Foundation using the Sedifex donor page integration." path="/donate" />
      <section className="pageHead">
        <Container>
          <h1>Donate</h1>
          <p className="muted">Complete this donor form to sync your donation to Sedifex for proper tracking and follow-up.</p>
        </Container>
      </section>
      <section className="section">
        <Container>
          <form className="card card--form" onSubmit={submitDonation}>
            <h3 className="card__title">Donor details</h3>
            <div className="formGrid">
              <label className="field"><span>Full name *</span><input required value={name} onChange={(e) => setName(e.target.value)} /></label>
              <label className="field"><span>Email *</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              <label className="field"><span>Phone</span><input value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
              <label className="field"><span>Amount (GHS) *</span><input type="number" min="1" required value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
              <label className="field field--wide"><span>Message (optional)</span><textarea rows="4" value={message} onChange={(e) => setMessage(e.target.value)} /></label>
            </div>
            <button className="btn" type="submit" disabled={!canSubmit || isSubmitting} style={{ width: "100%" }}>{isSubmitting ? "Submitting..." : "Proceed to payment"}</button>
            {submitState === "success" ? <p className="tiny" style={{ marginTop: ".8rem", color: "#0b7a3f" }}>Thank you, {name || "friend"}. Your donation intent has been securely recorded in Sedifex. This helps us plan treatment support, transport, and family care with accountability.</p> : null}
            {submitState === "error" ? <p className="tiny" style={{ marginTop: ".8rem", color: "#9f1239" }}>Could not submit donation right now. Please try again.</p> : null}
            <p className="tiny" style={{ marginTop: ".8rem" }}>You agree to be contacted by {org.name} about this donation.</p>
          </form>
        </Container>
      </section>
    </>
  );
}
