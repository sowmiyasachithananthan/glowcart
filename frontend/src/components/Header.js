import React from "react";
import { Link, NavLink } from "react-router-dom";

function Header({ cartCount, wishlistCount }) {
  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="GlowCart" className="logo-img" />
      </Link>
      <nav className="nav">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/collection/skincare">Skincare</NavLink>
        <NavLink to="/collection/hair-care">Hair Care</NavLink>
        <NavLink to="/collection/lip-care">Lip Care</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/faq">FAQ</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>
      <div className="header-actions">
        <Link to="/wishlist">❤️ {wishlistCount}</Link>
        <Link to="/cart">🛒 {cartCount}</Link>
      </div>
    </header>
  );
}

export default Header;
