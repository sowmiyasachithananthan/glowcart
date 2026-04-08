import React, { useState } from "react";
import { Link } from "react-router-dom";

function resolveImageSrc(src) {
  if (!src) return "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) return src;
  if (src.startsWith("/")) return src;
  return `/images/${src}`;
}

function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted }) {
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishText, setWishText] = useState("");

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="product-card"
    >
      <Link to={`/product/${product._id}`}>
        <img
          src={resolveImageSrc(hover ? (product.images?.[1] || product.images?.[0]) : product.images?.[0])}
          alt={product.name}
          className="product-image"
          onError={(e) => { e.currentTarget.src = resolveImageSrc(""); }}
        />
      </Link>

      <h3>{product.name}</h3>

      <div className="price-row">
        <span className="price">₹{product.price}</span>
        <span className="strike">₹{product.originalPrice}</span>
      </div>

      <p className="discount">{discount}% OFF</p>

      <div className="card-actions">
        <button onClick={() => {
          onAddToCart(product);
          setAdded(true);
          setTimeout(() => setAdded(false), 1200);
        }}>{added ? "Added" : "Add to Cart"}</button>
        <button onClick={() => {
          onToggleWishlist(product);
          setWishText(isWishlisted ? "Removed" : "Wishlisted");
          setTimeout(() => setWishText(""), 1200);
        }}>{wishText || (isWishlisted ? "♥ Wishlisted" : "♡ Wishlist")}</button>
      </div>
    </div>
  );
}

export default ProductCard;