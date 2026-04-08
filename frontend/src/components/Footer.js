import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>GlowCart</h3>
          <p className="muted">Luxury beauty rituals for skin, hair, and lips.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h4>Social</h4>
          <div className="footer-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
          </div>
        </div>
      </div>
      <p className="copyright">© {new Date().getFullYear()} GlowCart. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
