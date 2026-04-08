import React from "react";

function FAQPage() {
  const faqs = [
    { q: "How long does shipping take?", a: "Orders are processed within 24 hours and delivered in 3-7 business days." },
    { q: "Do you offer Cash on Delivery?", a: "Yes, COD is available for eligible pin codes at checkout." },
    { q: "Are your products suitable for sensitive skin?", a: "Most formulas are gentle; always patch test before full use." },
    { q: "Can I return a product?", a: "Unopened products can be returned within 7 days from delivery." },
    { q: "How can I track my order?", a: "You will receive updates via email and can contact support for live status." },
    { q: "Are products cruelty-free?", a: "Yes, we follow cruelty-free and conscious sourcing standards." },
    { q: "Can I edit my order after placing it?", a: "Please contact support quickly and we will try to help before dispatch." },
  ];
  return (
    <div className="container">
      <p className="section-tag">Support</p>
      <h1 className="section-title">Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((item) => (
          <details key={item.q} className="faq-item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export default FAQPage;
