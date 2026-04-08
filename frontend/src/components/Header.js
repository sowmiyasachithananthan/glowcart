import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Header({ cartCount, wishlistCount }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="GlowCart" className="logo-img" />
      </Link>

      <button
        type="button"
        className="menu-toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        ☰
      </button>

      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
        <NavLink to="/collection/skincare" onClick={closeMenu}>Skincare</NavLink>
        <NavLink to="/collection/hair-care" onClick={closeMenu}>Hair Care</NavLink>
        <NavLink to="/collection/lip-care" onClick={closeMenu}>Lip Care</NavLink>
        <NavLink to="/about" onClick={closeMenu}>About</NavLink>
        <NavLink to="/faq" onClick={closeMenu}>FAQ</NavLink>
        <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
      </nav>

      <div className={`header-actions ${menuOpen ? "open" : ""}`}>
        <Link to="/wishlist" onClick={closeMenu}>❤️ {wishlistCount}</Link>
        <Link to="/cart" onClick={closeMenu}>🛒 {cartCount}</Link>
      </div>
    </header>
  );
}

export default Header;
