import React, { useState } from "react";

function ContactPage({ apiBase }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const submitContact = (e) => {
    e.preventDefault();
    fetch(`${apiBase}/contact-submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        setStatus("Thanks for reaching out. Our team will contact you soon.");
        setForm({ name: "", email: "", message: "" });
      })
      .catch(() => setStatus("Unable to submit message right now."));
  };

  return (
    <div className="container">
      <p className="section-tag">Get In Touch</p>
      <h1 className="section-title">Contact GlowCart</h1>
      <div className="contact-layout">
        <form className="form luxury-card" onSubmit={submitContact}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <textarea rows="5" placeholder="Your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          <button className="contact-submit" type="submit">Send Message</button>
          {status && <p className="muted">{status}</p>}
        </form>
        <div className="luxury-card">
          <h3>Store Location</h3>
          <p>GlowCart Experience Studio, Chennai</p>
          <iframe
            title="GlowCart map"
            src="https://maps.google.com/maps?q=Chennai&t=&z=12&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="280"
            style={{ border: 0, borderRadius: "10px" }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
