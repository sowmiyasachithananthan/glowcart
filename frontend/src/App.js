import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import AccountPage from "./pages/AccountPage";
import SkincarePage from "./pages/SkincarePage";
import HairCarePage from "./pages/HairCarePage";
import LipCarePage from "./pages/LipCarePage";
import "./App.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5000/api";
const ShopContext = createContext(null);

function resolveImageSrc(src) {
  const staticBase =
    typeof window !== "undefined" && window.location.hostname.includes("github.io")
      ? `/${window.location.pathname.split("/").filter(Boolean)[0] || ""}`
      : (process.env.PUBLIC_URL || "");
  const publicBase = staticBase.replace(/\/$/, "");
  const cleanSrc = String(src || "").trim();
  if (!src) return "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80";
  if (cleanSrc.startsWith("http://") || cleanSrc.startsWith("https://") || cleanSrc.startsWith("data:")) return cleanSrc;
  if (cleanSrc.startsWith("/")) return `${publicBase}${cleanSrc}`;
  if (cleanSrc.startsWith("images/")) return `${publicBase}/${cleanSrc}`;
  return `${publicBase}/images/${cleanSrc}`;
}

function useShop() {
  return useContext(ShopContext);
}

function PageBanner() {
  const location = useLocation();
  const bannerMap = {
    "/": { title: "Luxury Beauty, Every Day", subtitle: "Discover premium rituals for skin, hair, and lips.", cta: "Shop Collection", to: "/collection/skincare", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80" },
    "/about": { title: "About GlowCart", subtitle: "A premium beauty destination built around quality and trust.", cta: "Explore Products", to: "/collection/skincare", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80" },
    "/collection/skincare": { title: "Skincare Collection", subtitle: "Targeted formulas for hydration, glow, and repair.", cta: "View Skincare", to: "/collection/skincare", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1600&q=80" },
    "/collection/hair-care": { title: "Hair Care Collection", subtitle: "Nourish roots and lengths with salon-inspired care.", cta: "View Hair Care", to: "/collection/hair-care", image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1600&q=80" },
    "/collection/lip-care": { title: "Lip Care Collection", subtitle: "Soft, healthy lips with daily repair essentials.", cta: "View Lip Care", to: "/collection/lip-care", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1600&q=80" },
    "/faq": { title: "Help Center", subtitle: "Find quick answers about shipping, returns, and orders.", cta: "Contact Us", to: "/contact", image: "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=1600&q=80" },
    "/contact": { title: "Contact GlowCart", subtitle: "We are here to support your beauty journey.", cta: "Send a Message", to: "/contact", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80" },
    "/cart": { title: "Your Shopping Cart", subtitle: "Review items before checkout.", cta: "Proceed to Checkout", to: "/checkout", image: "https://images.unsplash.com/photo-1465406325903-9d93ee82f613?auto=format&fit=crop&w=1600&q=80" },
    "/wishlist": { title: "Your Wishlist", subtitle: "Save your favorites and shop them anytime.", cta: "Browse Collections", to: "/", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80" },
    "/checkout": { title: "Checkout", subtitle: "Secure Cash on Delivery order placement.", cta: "Review Cart", to: "/cart", image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1600&q=80" },
    "/privacy": { title: "Privacy Policy", subtitle: "How your information is protected and handled.", cta: "Back Home", to: "/", image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1600&q=80" },
    "/terms": { title: "Terms & Conditions", subtitle: "Read order, shipping, and service terms.", cta: "Back Home", to: "/", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80" },
    "/admin": { title: "Admin Panel", subtitle: "Manage products, orders, and status updates.", cta: "Dashboard", to: "/admin", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80" },
  };

  const isProduct = location.pathname.startsWith("/product/");
  const data = isProduct
    ? { title: "Product Details", subtitle: "Detailed information, pricing, and quick actions.", cta: "Browse More", to: "/", image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1600&q=80" }
    : bannerMap[location.pathname] || { title: "GlowCart", subtitle: "Premium beauty shopping experience.", cta: "Go Home", to: "/", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80" };
  const showCta = data.to !== location.pathname;

  return (
    <section className={`page-banner ${location.pathname === "/" ? "home-banner" : ""}`} style={{ "--banner-image": `url(${data.image})` }}>
      <div className="page-banner-inner">
        <p className="section-tag">GlowCart</p>
        <h2>{data.title}</h2>
        <p>{data.subtitle}</p>
        {showCta ? <Link className="banner-link" to={data.to}>{data.cta}</Link> : null}
      </div>
    </section>
  );
}


function HomePage() {
  const navigate = useNavigate();
  const navOnEnter = (e, url) => {
    if (e.key === "Enter" || e.key === " ") navigate(url);
  };
  return (
    <>
      <section className="container home-quick-strip">
        <Link className="quick-feature" to="/collection/skincare">
          <img src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80" alt="Radiance skincare" />
          <div className="quick-overlay">
            <p className="section-tag">New Arrival</p>
            <h3>Radiance Edit</h3>
            <span>Shop Skincare</span>
          </div>
        </Link>
        <Link className="quick-feature" to="/collection/hair-care">
          <img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=80" alt="Hair care essentials" />
          <div className="quick-overlay">
            <p className="section-tag">Trending</p>
            <h3>Barrier Care</h3>
            <span>Explore Hair Care</span>
          </div>
        </Link>
        <Link className="quick-feature" to="/contact">
          <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80" alt="Beauty support" />
          <div className="quick-overlay">
            <p className="section-tag">Support</p>
            <h3>Need Guidance?</h3>
            <span>Contact GlowCart</span>
          </div>
        </Link>
      </section>

      <section className="container mini-stats">
        <div className="luxury-card"><h3>10k+</h3><p className="muted">Happy customers</p></div>
        <div className="luxury-card"><h3>4.8/5</h3><p className="muted">Average rating</p></div>
        <div className="luxury-card"><h3>100%</h3><p className="muted">Secure checkout support</p></div>
      </section>

      <section className="hero">
        <div className="hero-content">
          <p className="section-tag">Luxury Beauty Ritual</p>
          <h1>Elevate Every Day With Signature Glow</h1>
          <p>
            Premium, clean, and clinically inspired beauty essentials crafted for
            radiant skin, nourished hair, and soft lips.
          </p>
          <div className="hero-actions">
            <button onClick={() => navigate("/")}>Shop Collection</button>
            <button className="btn-light" onClick={() => navigate("/about")}>Explore Brand</button>
          </div>
        </div>
        <div className="hero-panel">
          <h3>Glow Promise</h3>
          <p>Dermatologically curated formulas</p>
          <p>Fast shipping and secure COD checkout</p>
          <p>Conscious ingredients, visible results</p>
        </div>
      </section>

      <section className="container value-strip">
        <div className="luxury-card"><h3>3 Premium Categories</h3><p className="muted">Skincare, Hair Care, Lip Care</p></div>
        <div className="luxury-card"><h3>Trusted Formulations</h3><p className="muted">Ingredient-first and routine-friendly</p></div>
        <div className="luxury-card"><h3>Secure Checkout</h3><p className="muted">Fast order flow with COD support</p></div>
      </section>

      <section className="container">
        <p className="section-tag">Shop By Category</p>
        <div className="luxury-categories">
          <div className="luxury-box" onClick={() => navigate("/collection/skincare")} onKeyDown={(e) => navOnEnter(e, "/collection/skincare")} role="button" tabIndex={0}>Skincare Essentials</div>
          <div className="luxury-box" onClick={() => navigate("/collection/hair-care")} onKeyDown={(e) => navOnEnter(e, "/collection/hair-care")} role="button" tabIndex={0}>Hair Care Rituals</div>
          <div className="luxury-box" onClick={() => navigate("/collection/lip-care")} onKeyDown={(e) => navOnEnter(e, "/collection/lip-care")} role="button" tabIndex={0}>Lip Care Luxe</div>
        </div>
      </section>

      <section className="container home-section-head">
        <p className="section-tag">Category Highlights</p>
        <h2 className="section-title">Choose Your Ritual</h2>
      </section>
      <section className="container image-strip">
        <Link className="img-card" to="/collection/skincare">
          <img src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1000&q=80" alt="Skincare routine" />
          <p>Skin reset ritual</p>
        </Link>
        <Link className="img-card" to="/collection/hair-care">
          <img src="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=80" alt="Hair care products" />
          <p>Silk hair care line</p>
        </Link>
        <Link className="img-card" to="/collection/lip-care">
          <img src="https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=1000&q=80" alt="Lip care collection" />
          <p>Hydrating lip edit</p>
        </Link>
      </section>

      <section className="container split">
        <div className="luxury-card">
          <p className="section-tag">Why GlowCart</p>
          <h3>Meaningful beauty, not just trends</h3>
          <ul>
            <li>Ingredient-first formulations</li>
            <li>Curated routines for real concerns</li>
            <li>Trusted support from browse to delivery</li>
          </ul>
        </div>
        <div className="luxury-card">
          <p className="section-tag">Our Promise</p>
          <h3>Luxury experience with everyday simplicity</h3>
          <p className="muted">
            We design collections that are easy to choose, easy to use, and made to
            deliver visible results over time.
          </p>
        </div>
      </section>

      <section className="container home-section-head">
        <p className="section-tag">Explore Collections</p>
        <h2 className="section-title">Shop By Visual Edit</h2>
      </section>
      <section className="container gallery-four">
        <Link className="visual-card" to="/collection/skincare"><img src="https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=1200&q=80" alt="Skincare cream texture" /><span>Skincare</span></Link>
        <Link className="visual-card" to="/collection/skincare"><img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80" alt="Beauty routine mirror" /><span>Skincare</span></Link>
        <Link className="visual-card" to="/collection/hair-care"><img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80" alt="Hair serum dropper" /><span>Hair Care</span></Link>
        <Link className="visual-card" to="/collection/lip-care"><img src="https://images.unsplash.com/photo-1631730359585-38a4935cbec4?auto=format&fit=crop&w=1200&q=80" alt="Lip care set" /><span>Lip Care</span></Link>
      </section>

      <section className="container home-section-head">
        <p className="section-tag">Explore Pages</p>
        <h2 className="section-title">Quick Navigation</h2>
      </section>
      <section className="container page-links-grid">
        <Link className="luxury-card page-link-card" to="/about"><h3>About</h3><p className="muted">Our brand story and mission</p></Link>
        <Link className="luxury-card page-link-card" to="/collection/skincare"><h3>Skincare</h3><p className="muted">Daily glow essentials</p></Link>
        <Link className="luxury-card page-link-card" to="/collection/hair-care"><h3>Hair Care</h3><p className="muted">Nourish and strengthen</p></Link>
        <Link className="luxury-card page-link-card" to="/collection/lip-care"><h3>Lip Care</h3><p className="muted">Hydrate and protect</p></Link>
        <Link className="luxury-card page-link-card" to="/faq"><h3>FAQ</h3><p className="muted">Quick answers and support</p></Link>
        <Link className="luxury-card page-link-card" to="/contact"><h3>Contact</h3><p className="muted">Reach our team anytime</p></Link>
      </section>

      <section className="container home-section-head">
        <p className="section-tag">Testimonials</p>
        <h2 className="section-title">Loved By Our Customers</h2>
      </section>
      <section className="container testimonial-grid">
        <div className="luxury-card">
          <p>"The skincare collection made my routine so simple and effective. Visible glow in 2 weeks."</p>
          <p className="muted">- Aishwarya, Chennai</p>
        </div>
        <div className="luxury-card">
          <p>"Hair care range reduced frizz and improved shine. Delivery and packaging were premium."</p>
          <p className="muted">- Divya, Bengaluru</p>
        </div>
        <div className="luxury-card">
          <p>"Lip care is super hydrating, and the product quality feels truly luxe for the price."</p>
          <p className="muted">- Meera, Hyderabad</p>
        </div>
      </section>

    </>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    fetch(`${API_BASE}/subscribers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Subscribe failed");
        setStatus("Subscribed successfully. Welcome to GlowCart!");
        setEmail("");
      })
      .catch(() => setStatus("Unable to subscribe right now."));
  };
  return (
    <section className="newsletter">
      <h3>Unlock First Access</h3>
      <p>Get product drops, beauty tips, and exclusive offers.</p>
      <form className="newsletter-row" onSubmit={onSubmit}>
        <input placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Join Now</button>
      </form>
      {status && <p className="muted">{status}</p>}
    </section>
  );
}

function ProductDetails() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishText, setWishText] = useState("");
  useEffect(() => {
    fetch(`${API_BASE}/products/${id}`).then((r) => r.json()).then((data) => {
      setProduct(data);
      setSelectedImage(resolveImageSrc(data?.images?.[0]));
    });
  }, [id]);
  if (!product) return <p className="container">Loading...</p>;
  const offer = Math.max(0, Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100));
  return (
    <div className="container">
      <h1>{product.name}</h1>
      <div className="details">
        <div className="details-media">
          <img
            src={selectedImage || resolveImageSrc(product.images?.[0])}
            alt={product.name}
            onError={(e) => { e.currentTarget.src = resolveImageSrc(""); }}
            className="details-main-image"
          />
          <div className="thumb-row">
            {(product.images || []).slice(0, 2).map((img, idx) => (
              <button key={`${img}-${idx}`} className="thumb-btn" onClick={() => setSelectedImage(resolveImageSrc(img))}>
                <img src={resolveImageSrc(img)} alt={`${product.name} view ${idx + 1}`} onError={(e) => { e.currentTarget.src = resolveImageSrc(""); }} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="muted"><strong>Product:</strong> {product.name}</p>
          <p>{product.description}</p>
          <p><strong>Price:</strong> ₹{product.price} <span className="strike">₹{product.originalPrice}</span></p>
          <p className="discount">{offer}% OFF</p>
          <div className="qty-row">
            <label htmlFor="qty"><strong>Quantity:</strong></label>
            <input id="qty" type="number" min="1" max="10" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))} />
          </div>
          <div className="detail-action-row">
            <button onClick={() => {
              addToCart(product, quantity);
              setAdded(true);
              setTimeout(() => setAdded(false), 1200);
            }}>{added ? "Added" : "Add to Cart"}</button>
          </div>
          <button onClick={() => {
            const wasInWishlist = inWishlist(product._id);
            toggleWishlist(product);
            setWishText(wasInWishlist ? "Removed" : "Wishlisted");
            setTimeout(() => setWishText(""), 1200);
          }}>{wishText || (inWishlist(product._id) ? "Remove Wishlist" : "Add to Wishlist")}</button>
          <div className="luxury-card detail-info-card">
            <h3>Features</h3>
            <ul>
              <li>Premium formula with skin-friendly ingredients</li>
              <li>Easy to layer with your daily routine</li>
              <li>Suitable for regular AM/PM use</li>
            </ul>
            <h3>Benefits</h3>
            <ul>
              <li>Supports hydration and healthy glow</li>
              <li>Helps improve smoothness and softness</li>
              <li>Designed for visible care over time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, cartTotal } = useShop();
  return (
    <div className="container">
      <h1>Cart</h1>
      {cart.length === 0 ? <p>Your cart is empty.</p> : cart.map((item) => (
        <div key={item._id} className="row">
          <span>{item.name}</span>
          <input type="number" min="1" value={item.quantity} onChange={(e) => updateQty(item._id, Number(e.target.value))} />
          <span>₹{item.price * item.quantity}</span>
          <button onClick={() => removeFromCart(item._id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ₹{cartTotal}</h3>
      <button disabled={cart.length === 0} onClick={() => navigate("/checkout")}>Checkout</button>
    </div>
  );
}

function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  return (
    <div className="container">
      <h1>Wishlist</h1>
      {wishlist.length === 0 ? <p>No wishlist items yet.</p> : wishlist.map((item) => (
        <div key={item._id} className="row">
          <span>{item.name}</span>
          <button onClick={() => addToCart(item)}>Add to Cart</button>
          <button onClick={() => toggleWishlist(item)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useShop();
  const [form, setForm] = useState({ customerName: "", email: "", phone: "", address: "" });
  const [message, setMessage] = useState("");

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!cart.length) return;
    const payload = {
      ...form,
      paymentMethod: "Cash on Delivery",
      total: cartTotal,
      items: cart.map((i) => ({ productId: i._id, name: i.name, price: i.price, quantity: i.quantity, image: i.images?.[0] || "" })),
    };
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return setMessage("Order failed. Try again.");

    let emailSent = false;
    if (process.env.REACT_APP_EMAILJS_SERVICE_ID && process.env.REACT_APP_EMAILJS_TEMPLATE_ID && process.env.REACT_APP_EMAILJS_PUBLIC_KEY) {
      try {
        const template = { customer_name: form.customerName, customer_email: form.email, total_amount: cartTotal, address: form.address };
        await emailjs.send(process.env.REACT_APP_EMAILJS_SERVICE_ID, process.env.REACT_APP_EMAILJS_TEMPLATE_ID, template, process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
        if (process.env.REACT_APP_EMAILJS_ADMIN_TEMPLATE_ID) {
          await emailjs.send(process.env.REACT_APP_EMAILJS_SERVICE_ID, process.env.REACT_APP_EMAILJS_ADMIN_TEMPLATE_ID, template, process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
        }
        emailSent = true;
      } catch (err) {
        console.error("EmailJS send failed:", err);
      }
    }
    clearCart();
    setMessage(
      emailSent
        ? "Order placed! Confirmation email sent."
        : "Order placed! Email not sent. Configure EmailJS environment variables for production and redeploy frontend."
    );
    setForm({ customerName: "", email: "", phone: "", address: "" });
  };

  return (
    <div className="container">
      <h1>Checkout (COD)</h1>
      <form className="form" onSubmit={handleOrder}>
        <input placeholder="Name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <textarea placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <input value="Cash on Delivery" readOnly />
        <button type="submit">Place Order</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

function AdminPage() {
  const [adminKey, setAdminKey] = useState(localStorage.getItem("adminKey") || "");
  const [login, setLogin] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", originalPrice: "", category: "Skincare", image1: "", image2: "", description: "" });
  const [editingId, setEditingId] = useState("");

  const loadAdminData = useCallback(() => {
    const headers = { "x-admin-key": adminKey };
    fetch(`${API_BASE}/products`).then((r) => r.json()).then(setProducts);
    fetch(`${API_BASE}/orders`, { headers }).then((r) => r.json()).then(setOrders);
    fetch(`${API_BASE}/subscribers`, { headers }).then((r) => r.json()).then(setSubscribers);
    fetch(`${API_BASE}/contact-submissions`, { headers }).then((r) => r.json()).then(setSubmissions);
  }, [adminKey]);

  useEffect(() => {
    if (adminKey) loadAdminData();
  }, [adminKey, loadAdminData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login),
    });
    if (!res.ok) {
      setLoginError("Invalid credentials. Use backend .env admin values.");
      return;
    }
    const data = await res.json();
    localStorage.setItem("adminKey", data.adminKey);
    setAdminKey(data.adminKey);
    setLoginError("");
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      category: form.category,
      images: [form.image1, form.image2],
      description: form.description,
    };
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_BASE}/products/${editingId}` : `${API_BASE}/products`;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(payload),
    });
    setForm({ name: "", price: "", originalPrice: "", category: "Skincare", image1: "", image2: "", description: "" });
    setEditingId("");
    loadAdminData();
  };

  const editProduct = (p) => {
    setEditingId(p._id);
    setForm({ name: p.name, price: p.price, originalPrice: p.originalPrice, category: p.category, image1: p.images?.[0] || "", image2: p.images?.[1] || "", description: p.description });
  };

  if (!adminKey) {
    return (
      <div className="container">
        <h1>Admin Login</h1>
        <form className="form" onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} required />
          <button type="submit">Login</button>
          {loginError ? <p className="muted">{loginError}</p> : null}
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <button onClick={() => { localStorage.removeItem("adminKey"); setAdminKey(""); }}>Logout</button>
      <h2>Products</h2>
      <form className="form" onSubmit={saveProduct}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <input placeholder="Original Price" type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} required />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option>Skincare</option><option>Hair Care</option><option>Lip Care</option>
        </select>
        <input placeholder="Image 1 URL" value={form.image1} onChange={(e) => setForm({ ...form, image1: e.target.value })} required />
        <input placeholder="Image 2 URL" value={form.image2} onChange={(e) => setForm({ ...form, image2: e.target.value })} required />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
      </form>
      {products.map((p) => (
        <div key={p._id} className="row">
          <span>{p.name} ({p.category})</span>
          <button onClick={() => editProduct(p)}>Edit</button>
          <button onClick={async () => { await fetch(`${API_BASE}/products/${p._id}`, { method: "DELETE", headers: { "x-admin-key": adminKey } }); loadAdminData(); }}>Delete</button>
        </div>
      ))}
      <h2>Orders</h2>
      {orders.map((o) => (
        <div key={o._id} className="order-card">
          <p><strong>{o.customerName}</strong> - ₹{o.total}</p>
          <p>{o.address}</p>
          <p>{o.items?.map((i) => `${i.name} x${i.quantity}`).join(", ")}</p>
          <select value={o.status} onChange={async (e) => {
            await fetch(`${API_BASE}/orders/${o._id}/status`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
              body: JSON.stringify({ status: e.target.value }),
            });
            loadAdminData();
          }}>
            <option>Pending</option><option>Shipped</option><option>Delivered</option>
          </select>
        </div>
      ))}
      <h2>Subscribers</h2>
      {subscribers.map((s) => (
        <div key={s._id} className="row">
          <span>{s.email}</span>
          <span>{new Date(s.createdAt).toLocaleDateString()}</span>
        </div>
      ))}
      <h2>Contact Submissions</h2>
      {submissions.map((s) => (
        <div key={s._id} className="order-card">
          <p><strong>{s.name}</strong> ({s.email})</p>
          <p>{s.message}</p>
        </div>
      ))}
    </div>
  );
}

function BasicPage({ title, text }) {
  return (
    <div className="container">
      <p className="section-tag">GlowCart</p>
      <h1 className="section-title">{title}</h1>
      <div className="luxury-card"><p>{text}</p></div>
    </div>
  );
}

function AppShell() {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("wishlist") || "[]"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("authUser") || "null");
    } catch (_) {
      return null;
    }
  });
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("authUser", JSON.stringify(user)), [user]);

  // Restore session from token (optional) on first load.
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || user) return;
    fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((me) => {
        if (me) setUser({ _id: me._id, name: me.name, email: me.email });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset scroll position when navigating between pages.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Show back-to-top button after scrolling.
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 450);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const found = prev.find((p) => p._id === product._id);
      if (found) return prev.map((p) => (p._id === product._id ? { ...p, quantity: p.quantity + quantity } : p));
      return [...prev, { ...product, quantity }];
    });
  };
  const removeFromCart = (id) => setCart((prev) => prev.filter((p) => p._id !== id));
  const updateQty = (id, qty) => setCart((prev) => prev.map((p) => (p._id === id ? { ...p, quantity: Math.max(1, qty || 1) } : p)));
  const clearCart = () => setCart([]);

  const inWishlist = (id) => wishlist.some((p) => p._id === id);
  const toggleWishlist = (product) => setWishlist((prev) => (prev.some((p) => p._id === product._id) ? prev.filter((p) => p._id !== product._id) : [...prev, product]));

  const cartCount = useMemo(() => cart.reduce((a, b) => a + b.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((a, b) => a + b.price * b.quantity, 0), [cart]);

  const value = { cart, wishlist, addToCart, removeFromCart, updateQty, clearCart, toggleWishlist, inWishlist, cartCount, cartTotal, wishlistCount: wishlist.length };

  return (
    <ShopContext.Provider value={value}>
      <Header cartCount={cartCount} wishlistCount={wishlist.length} user={user} />
      <PageBanner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/collection/skincare" element={<SkincarePage apiBase={API_BASE} addToCart={addToCart} toggleWishlist={toggleWishlist} inWishlist={inWishlist} />} />
        <Route path="/collection/hair-care" element={<HairCarePage apiBase={API_BASE} addToCart={addToCart} toggleWishlist={toggleWishlist} inWishlist={inWishlist} />} />
        <Route path="/collection/lip-care" element={<LipCarePage apiBase={API_BASE} addToCart={addToCart} toggleWishlist={toggleWishlist} inWishlist={inWishlist} />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage apiBase={API_BASE} />} />
        <Route path="/account" element={<AccountPage apiBase={API_BASE} user={user} setUser={setUser} />} />
        <Route path="/privacy" element={<BasicPage title="Privacy Policy" text="Your data is kept secure and used only for order processing." />} />
        <Route path="/terms" element={<BasicPage title="Terms & Conditions" text="By ordering, you agree to our shipping and return terms." />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <NewsletterSection />
      <Footer />
      {showBackToTop ? (
        <button className="back-to-top" type="button" onClick={() => window.scrollTo(0, 0)} aria-label="Back to top">
          ↑
        </button>
      ) : null}
    </ShopContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;