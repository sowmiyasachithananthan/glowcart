import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function CollectionPage({ apiBase, title, category, addToCart, toggleWishlist, inWishlist }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const normalize = (value) => String(value || "").toLowerCase().replace(/[\s-]/g, "");
    const wanted = normalize(category);

    async function loadWithRetry(attempt = 0) {
      try {
        const res = await fetch(`${apiBase}/products`);
        if (!res.ok) throw new Error("Products fetch failed");
        const all = await res.json();
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
        if (active) {
          setProducts(filtered);
          setLoading(false);
        }
      } catch (_) {
        if (!active) return;
        if (attempt < 2) {
          setTimeout(() => loadWithRetry(attempt + 1), 2500);
          return;
        }
        setProducts([]);
        setLoading(false);
      }
    }

    setLoading(true);
    loadWithRetry();
    return () => {
      active = false;
    };
  }, [apiBase, category]);

  return (
    <section className="container">
      <p className="section-tag">Curated Edit</p>
      <h1 className="section-title">{title}</h1>
      {loading ? <p className="muted">Loading products...</p> : null}
      {!loading && products.length === 0 ? <p className="muted">No products found in this category yet.</p> : null}
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
