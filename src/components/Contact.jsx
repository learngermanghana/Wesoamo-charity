import { useMemo, useState } from "react";
import Container from "./Container";
import { org } from "../data/org";

export default function Contact() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Donor");
  const [message, setMessage] = useState("");

  const waLink = useMemo(() => {
    const msg =
      `Hello ${org.name},\n\n` +
      `Name: ${name}\n` +
      `I am contacting as: ${role}\n\n` +
      `Message:\n${message}\n\n` +
      `Please share next steps.`;
    return `https://wa.me/${org.whatsapp}?text=${encodeURIComponent(msg)}`;
  }, [name, role, message]);

  function submit(e) {
    e.preventDefault();
    window.open(waLink, "_blank", "noreferrer");
  }

  return (
    <section className="section">
      <Container>
        <div className="sectionHead">
          <h2>Contact & get involved</h2>
          <p>Donate, volunteer, partner, or request support. We respond as quickly as possible.</p>
        </div>

        <div className="twoCol">
          <div className="card">
            <h3>Reach us</h3>
            <div className="kv"><span>Phone</span><a href={"tel:" + org.phoneE164}>{org.phoneRaw}</a></div>
            <div className="kv"><span>Email</span><a href={"mailto:" + org.email}>{org.email}</a></div>
            <div className="kv"><span>Facebook</span><a href={org.facebook} target="_blank" rel="noreferrer">Visit our page</a></div>

            <div className="btnRow" style={{ marginTop: ".8rem" }}>
              <a className="btn btn--primary" href={waLink} target="_blank" rel="noreferrer">WhatsApp us</a>
              <a className="btn btn--outline" href={org.facebook} target="_blank" rel="noreferrer">Message on Facebook</a>
            </div>
          </div>

          <form className="card" onSubmit={submit}>
            <h3>Send a message (WhatsApp)</h3>

            <label className="field">
              <span>Your name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" />
            </label>

            <label className="field">
              <span>You are a</span>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option>Donor</option>
                <option>Volunteer</option>
                <option>Partner</option>
                <option>Parent/Caregiver</option>
                <option>Community member</option>
              </select>
            </label>

            <label className="field">
              <span>Message</span>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows="6" placeholder="How can we help?" />
            </label>

            <button className="btn btn--primary" type="submit">Send to WhatsApp</button>
            <p className="tiny">This opens WhatsApp with your message prepared.</p>
          </form>
        </div>
      </Container>
    </section>
  );
}
