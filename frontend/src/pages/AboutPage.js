import React from "react";

function AboutPage() {
  return (
    <div className="container">
      <p className="section-tag">Our Story</p>
      <h1 className="section-title">About GlowCart</h1>
      <section className="about-layout">
        <div className="luxury-card">
          <h3>Designed Around Daily Rituals</h3>
          <p>
            GlowCart was built to simplify premium beauty shopping with curated formulas,
            transparent ingredients, and elevated customer experience.
          </p>
          <p className="muted">From skincare essentials to hair and lip care, each edit is quality-first.</p>
        </div>
        <div className="about-image-wrap">
          <img src="https://images.unsplash.com/photo-1498842812179-c81beecf902c?auto=format&fit=crop&w=1200&q=80" alt="GlowCart beauty studio" />
        </div>
      </section>
      <section className="split no-pad">
        <div className="luxury-card"><h3>Mission</h3><p>Make luxury beauty accessible, thoughtful, and results-driven.</p></div>
        <div className="luxury-card"><h3>Promise</h3><p>High standards in product quality, service, and delivery experience.</p></div>
      </section>
    </div>
  );
}

export default AboutPage;
