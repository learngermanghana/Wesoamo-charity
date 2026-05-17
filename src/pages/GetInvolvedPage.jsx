import { useMemo, useState } from "react";
import SEO from "../components/SEO";
import Container from "../components/Container";

const presetAmounts = [25, 50, 100, 200, 500];
const sedifexStoreId = import.meta.env.VITE_SEDIFEX_STORE_ID?.trim() ?? "";

type DonationResponse = {
  ok?: boolean;
  payment?: { authorizationUrl?: string | null } | null;
  error?: string;
};

function clean(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function money(value) {
  return `GHS ${value.toLocaleString("en-GH", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  })}`;
}

export default function GetInvolvedPage() {
  const [donorName, setDonorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("100");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const amountNumber = useMemo(() => Number(amount), [amount]);
  const canSubmit =
    Boolean(donorName.trim()) &&
    Boolean(email.trim() || phone.trim()) &&
    Number.isFinite(amountNumber) &&
    amountNumber > 0;

  async function handleDonate(event) {
    event.preventDefault();
    setFeedback("");

    if (!canSubmit) {
      setStatus("error");
      setFeedback("Please enter your name, email or phone, and a valid donation amount.");
      return;
    }

    if (!sedifexStoreId) {
      setStatus("error");
      setFeedback("Setup needed: add VITE_SEDIFEX_STORE_ID in Vercel.");
      return;
    }

    try {
      setStatus("submitting");
      const successUrl = `${window.location.origin}/donation-success`;
      const response = await fetch("/api/donor-portal-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: sedifexStoreId,
          pageId: "get-involved",
          pageType: "donation",
          sourceChannel: "wesoamo-charity-website",
          donor: {
            name: clean(donorName, 140),
            email: clean(email, 180).toLowerCase(),
            phone: clean(phone, 80)
          },
          amount: amountNumber,
          donation: {
            amount: amountNumber,
            currency: "GHS",
            type: "custom_amount",
            message: clean(message, 1000),
            anonymous
          },
          currency: "GHS",
          initializePayment: true,
          returnUrl: successUrl,
          redirectUrl: successUrl,
          metadata: {
            source: "wesoamo-charity-website",
            sourcePage: "/get-involved",
            anonymous,
            message: clean(message, 1000),
            donationAmount: amountNumber,
            successUrl
          }
        })
      });

      const data = (await response.json().catch(() => ({}))) as DonationResponse;
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to start donation payment. Please try again.");
      }

      if (data.payment?.authorizationUrl) {
        window.location.href = data.payment.authorizationUrl;
        return;
      }

      window.location.href = "/donation-success";
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Unable to submit donation right now.");
    }
  }

  return (
    <>
      <SEO title="Donate" path="/get-involved" />
      <section className="pageHead">
        <Container>
          <h1>Donate to Wesoamo Foundation</h1>
          <p className="muted">
            Fill your donor details, enter the amount you want to give, and continue to secure payment.
            Your donor and donation record are saved in Sedifex.
          </p>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="twoCol twoCol--contact">
            <div className="infoBox">
              <h3>Your donation helps with</h3>
              <ul>
                <li>Welfare and financial support for families</li>
                <li>Childhood cancer awareness work</li>
                <li>Parent counselling and emotional support</li>
                <li>Survivor follow-up and hospital welfare projects</li>
              </ul>

              <div className="callout" style={{ marginTop: "1rem" }}>
                <div className="callout__title">Connected to Sedifex</div>
                <div className="callout__text">Donor records and donation payments are organised for follow-up and transparency.</div>
              </div>
            </div>

            <form className="card card--form" onSubmit={handleDonate}>
              <h3 className="card__title">Donor form</h3>

              <div className="formGrid">
                <label className="field">
                  <span>Full name *</span>
                  <input value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Your name" required />
                </label>

                <label className="field">
                  <span>Email</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
                </label>

                <label className="field">
                  <span>Phone</span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+233 20 000 0000" />
                </label>

                <label className="field">
                  <span>Donation amount (GHS) *</span>
                  <input type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </label>

                <div className="field field--wide presetRow" aria-label="Preset donation amounts">
                  {presetAmounts.map((value) => (
                    <button key={value} type="button" className="btn btn--small" onClick={() => setAmount(String(value))}>
                      {money(value)}
                    </button>
                  ))}
                </div>

                <label className="field field--wide">
                  <span>Message or dedication</span>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="4" placeholder="Add a short note" />
                </label>

                <label className="field field--wide" style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
                  <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} style={{ width: 18, height: 18 }} />
                  <span style={{ fontWeight: 800, color: "rgba(15,23,42,.76)" }}>Keep my donation anonymous in public updates</span>
                </label>
              </div>

              {feedback ? <p className={`note ${status === "error" ? "errorText" : "successText"}`}>{feedback}</p> : null}

              <button className="btn" type="submit" disabled={status === "submitting" || !canSubmit} style={{ width: "100%" }}>
                {status === "submitting" ? "Starting checkout…" : `Donate ${Number.isFinite(amountNumber) && amountNumber > 0 ? money(amountNumber) : ""}`}
              </button>

              <p className="tiny" style={{ marginTop: ".8rem" }}>
                At least one contact field, email or phone, is required.
              </p>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}
