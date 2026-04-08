import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function CollectionPage({ apiBase, title, category, addToCart, toggleWishlist, inWishlist }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${apiBase}/products`)
      .then((r) => r.json())
      .then((all) => {
        const normalize = (value) => String(value || "").toLowerCase().replace(/[\s-]/g, "");
        const wanted = normalize(category);
        let filtered = all.filter((p) => normalize(p.category) === wanted);
        if (wanted === "skincare") {
          const skincareNames = new Set(
            [
              "Vitamin C Serum",
              "Aloe Vera Gel",
              "Face Wash",
              "Sunscreen",
              "Suncreen",
              "Sunscreen SPF 50",
              "Moisturizing Cream",
              "Night Cream",
            ].map((n) => n.toLowerCase())
          );
          filtered = all.filter(
            (p) => normalize(p.category) === wanted || skincareNames.has(String(p.name || "").toLowerCase())
          );
        }
        setProducts(filtered);
      })
      .catch(() => setProducts([]));
  }, [apiBase, category]);

  return (
    <section className="container">
      <p className="section-tag">Curated Edit</p>
      <h1 className="section-title">{title}</h1>
      {products.length === 0 ? <p className="muted">No products found in this category yet.</p> : null}
      <div className="grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            isWishlisted={inWishlist(product._id)}
          />
        ))}
      </div>
    </section>
  );
}

export default CollectionPage;
