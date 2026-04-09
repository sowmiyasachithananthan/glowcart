import React, { useEffect, useState } from "react";

function MyOrdersPage({ apiBase }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please login to view your orders.");
      setLoading(false);
      return;
    }
    fetch(`${apiBase}/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Unable to load your orders."))))
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unable to load your orders.");
        setLoading(false);
      });
  }, [apiBase]);

  return (
    <div className="container">
      <p className="section-tag">Account</p>
      <h1 className="section-title">My Orders</h1>

      {loading ? <p className="muted">Loading orders...</p> : null}
      {error ? <p className="muted" style={{ color: "#a6362a" }}>{error}</p> : null}
      {!loading && !error && orders.length === 0 ? <p className="muted">No orders found for this account yet.</p> : null}

      {!loading && !error
        ? orders.map((o) => (
            <div key={o._id} className="order-card">
              <p><strong>Order:</strong> #{String(o._id).slice(-6).toUpperCase()}</p>
              <p><strong>Date:</strong> {new Date(o.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {o.status}</p>
              <p><strong>Total:</strong> ₹{o.total}</p>
              <p><strong>Address:</strong> {o.address}</p>
              <p><strong>Items:</strong> {o.items?.map((i) => `${i.name} x${i.quantity}`).join(", ")}</p>
            </div>
          ))
        : null}
    </div>
  );
}

export default MyOrdersPage;

